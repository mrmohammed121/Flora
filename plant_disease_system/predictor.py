"""
predictor.py - FloraScan AI Two-Tier Hierarchical Inference & Diagnostic Engine

Core Capabilities:
1. Two-Tier Hierarchical Classification:
   - Stage 1: Botanical Host Identification (e.g., Rosa spp., Solanum lycopersicum, Citrus spp.)
   - Stage 2: Within-Host Pathogen Routing (Mathematically eliminates cross-species false positives)
2. Out-of-Distribution (OOD) & Negative Background Rejection
3. Morphological Lesion Pattern Distinction (Feathery Fringed vs Concentric Target Rings)
4. Context-Aware Agronomic Prescription Synthesis (Food vs Ornamental vs Orchard)
5. Interactive Human-in-the-Loop Clarification & Probabilistic Re-ranking
"""

import os
import json
import time
import torch
import numpy as np

from model import load_checkpoint, MODEL_VERSION
from image_preprocessing import preprocess_image_bytes
from recommendations import get_recommendations, HIGH_CONFIDENCE_THRESHOLD, MODERATE_CONFIDENCE_THRESHOLD

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "florascan_model.pth")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "models", "class_names.json")

# Botanical Host Mapping
BOTANICAL_HOSTS = {
    "Apple": {
        "botanical": "Malus domestica",
        "family": "Rosaceae",
        "category": "PERENNIAL_ORCHARD",
        "common_name": "Apple"
    },
    "Citrus": {
        "botanical": "Citrus spp.",
        "family": "Rutaceae",
        "category": "PERENNIAL_ORCHARD",
        "common_name": "Citrus"
    },
    "Pepper": {
        "botanical": "Capsicum annuum",
        "family": "Solanaceae",
        "category": "FOOD_CROP",
        "common_name": "Bell Pepper"
    },
    "Potato": {
        "botanical": "Solanum tuberosum",
        "family": "Solanaceae",
        "category": "FOOD_CROP",
        "common_name": "Potato"
    },
    "Rose": {
        "botanical": "Rosa spp.",
        "family": "Rosaceae",
        "category": "ORNAMENTAL",
        "common_name": "Rose"
    },
    "Tomato": {
        "botanical": "Solanum lycopersicum",
        "family": "Solanaceae",
        "category": "FOOD_CROP",
        "common_name": "Tomato"
    },
    "Cucumber": {
        "botanical": "Cucumis sativus",
        "family": "Cucurbitaceae",
        "category": "FOOD_CROP",
        "common_name": "Cucumber"
    },
    "Background": {
        "botanical": "Non-crop background specimen",
        "family": "Non-Agricultural",
        "category": "NON_AGRICULTURAL",
        "common_name": "Unrecognized / Background"
    }
}

class FloraScanPredictor:
    def __init__(self, model_path=MODEL_PATH, class_names_path=CLASS_NAMES_PATH):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_path = model_path
        self.class_names_path = class_names_path
        self.model = None
        self.class_names = []
        self.metadata = {}
        self.load_engine()

    def load_engine(self):
        """Loads trained weights and class mappings."""
        if not os.path.exists(self.model_path):
            print(f"[!] Warning: Model checkpoint not found at {self.model_path}.")
            return

        try:
            self.model, self.class_names, self.metadata = load_checkpoint(self.model_path, device=self.device)
            # Warm up PyTorch dispatch kernels for zero-latency first inference
            with torch.inference_mode():
                _ = self.model(torch.zeros(1, 3, 224, 224, device=self.device))
            print(f"[OK] FloraScan Hierarchical Predictor active on {self.device}. Loaded {len(self.class_names)} classes.")
        except Exception as e:
            print(f"[-] Error loading model checkpoint: {e}")

    def is_ready(self):
        return self.model is not None and len(self.class_names) > 0

    def get_host_for_class(self, class_name: str) -> str:
        """Extracts host species from class string (e.g. 'Rose___Black_spot' -> 'Rose')."""
        if "___" in class_name:
            return class_name.split("___")[0]
        return "Background"

    def predict(self, image_bytes: bytes, crop: str = None, clarification_answer: str = None) -> dict:
        """
        Executes Two-Tier Hierarchical Inference Pipeline:
        1. Preprocessing, quality screening, and morphological lesion pattern extraction.
        2. MobileNetV3 inference yielding raw logits and softmax probabilities.
        3. Out-of-Distribution (OOD) & Negative Background detection.
        4. Stage 1: Botanical Host Identification P(Host | x) = sum_{c in Host} P(c | x).
           Enforces user selection / clarification if provided.
        5. Stage 2: Within-Host Pathogen Routing P(c | x, Host*).
           Eliminates cross-species candidates (e.g. P(Alternaria | Rose) = 0.0%).
        6. Morphological lesion pattern cross-referencing.
        7. Context-Aware Agronomic Prescription synthesis.
        """
        if not self.is_ready():
            self.load_engine()
            if not self.is_ready():
                return {
                    "error": "Model engine is not ready. Verify models/florascan_model.pth exists.",
                    "status": "error"
                }

        # 1. Preprocessing, Quality Screening & Morphological Feature Extraction
        t_overall_start = time.perf_counter()
        try:
            preprocessed = preprocess_image_bytes(image_bytes)
        except Exception as e:
            return {
                "error": f"Invalid image upload: {str(e)}",
                "status": "error"
            }

        quality = preprocessed["quality"]
        lesion_metrics = preprocessed["lesion_metrics"]
        morphology = preprocessed.get("morphology", {})
        timing_breakdown = preprocessed.get("timing_breakdown", {})
        tensor = preprocessed["tensor"].to(self.device)

        # Severe quality rejection (only for heavily degraded non-diagnostic uploads)
        if not quality["is_valid"] and quality["score"] < 0.20 and quality.get("laplacian_variance", 0) < 25.0:
            return {
                "status": "insufficient_quality",
                "message": "Image quality is insufficient for reliable diagnosis. Please upload a clear leaf photo.",
                "image_quality": quality,
                "issues": quality["issues"],
                "recommendation": "Foliar disease symptoms cannot be resolved. Capture a steady, focused photo under daylight without heavy shadows."
            }

        # 2. Neural Inference (using zero-overhead inference_mode)
        t_inf_start = time.perf_counter()
        with torch.inference_mode():
            outputs = self.model(tensor)
            raw_probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
        t_inf_end = time.perf_counter()

        # 3. Out-of-Distribution (OOD) Detection
        t_route_start = time.perf_counter()
        # Check maximum softmax probability and explicit background class
        bg_idx = -1
        for idx, cname in enumerate(self.class_names):
            if cname.startswith("Background"):
                bg_idx = idx
                break

        bg_prob = float(raw_probs[bg_idx]) if bg_idx != -1 else 0.0
        max_prob = float(np.max(raw_probs))
        
        # OOD only if background probability strongly dominates
        is_ood = (bg_prob > 0.68) or (max_prob < 0.15 and bg_prob > 0.35)

        # 4. Stage 1: Botanical Host Identification
        # Calculate marginal host probabilities: P(Host_k | x) = sum_{c in Host_k} P(c | x)
        host_probs = {}
        for idx, cname in enumerate(self.class_names):
            host = self.get_host_for_class(cname)
            host_probs[host] = host_probs.get(host, 0.0) + float(raw_probs[idx])

        # Sort hosts by marginal probability
        sorted_hosts = sorted(host_probs.items(), key=lambda x: x[1], reverse=True)
        top_hosts = []
        for h_name, h_prob in sorted_hosts:
            host_info = BOTANICAL_HOSTS.get(h_name, {})
            top_hosts.append({
                "host": h_name,
                "botanical_name": host_info.get("botanical", "N/A"),
                "category": host_info.get("category", "FOOD_CROP"),
                "confidence": round(h_prob, 4),
                "confidence_percent": round(h_prob * 100, 2)
            })

        # Effective Host Selection (User Override / Clarification Answer / Top Model Prediction)
        selected_host = None
        user_override = False

        if clarification_answer and clarification_answer in BOTANICAL_HOSTS:
            selected_host = clarification_answer
            user_override = True
        elif crop and crop.lower() not in ["all", "any", "unknown", ""]:
            # Match user selected crop
            for h in BOTANICAL_HOSTS:
                if h.lower() == crop.lower():
                    selected_host = h
                    user_override = True
                    break

        if not selected_host:
            selected_host = sorted_hosts[0][0]

        # If top host is Background and no override, flag OOD
        if selected_host == "Background" and not user_override:
            is_ood = True

        # 5. Stage 2: Within-Host Pathogen Routing
        # Condition probabilities strictly on the selected host species
        host_classes = [cname for cname in self.class_names if self.get_host_for_class(cname) == selected_host]
        if not host_classes:
            host_classes = self.class_names

        host_indices = [self.class_names.index(c) for c in host_classes]
        conditioned_raw = raw_probs[host_indices]
        sum_cond = float(np.sum(conditioned_raw))
        if sum_cond > 0:
            conditioned_probs = conditioned_raw / sum_cond
        else:
            conditioned_probs = np.ones_like(conditioned_raw) / len(conditioned_raw)

        # Sort within-host diseases
        sorted_within = np.argsort(conditioned_probs)[::-1]
        top_predictions = []
        for rank in sorted_within:
            cname = host_classes[rank]
            conf = float(conditioned_probs[rank])
            crop_prefix, disease_suffix = cname.split("___") if "___" in cname else ("", cname)
            clean_disease = disease_suffix.replace("_", " ")

            top_predictions.append({
                "class_key": cname,
                "crop": crop_prefix.capitalize(),
                "disease": clean_disease,
                "confidence": round(conf, 4),
                "confidence_percent": round(conf * 100, 2)
            })

        primary = top_predictions[0]
        primary_class_key = primary["class_key"]
        
        # Safeguard: if primary prediction is healthy, but visual morphology and foliar metrics
        # indicate visible foliar symptoms (>8% affected area or distinct lesion pattern),
        # check if secondary within-host candidate is a disease
        if "healthy" in primary_class_key.lower() and lesion_metrics.get("affected_area_pct", 0) > 8.0:
            disease_candidates = [p for p in top_predictions if "healthy" not in p["class_key"].lower()]
            if disease_candidates and disease_candidates[0]["confidence"] > 0.15:
                primary = disease_candidates[0]
                primary_class_key = primary["class_key"]

        host_marginal = host_probs.get(selected_host, 1.0)
        # Use true within-host conditioned confidence without artificial penalty
        final_confidence = primary["confidence"]

        # 6. Morphological Alignment Cross-Reference
        morph_pattern = morphology.get("pattern", "none")
        morphology_alignment = "neutral"
        if primary_class_key == "Rose___Black_spot" and morph_pattern == "feathery_fringed":
            morphology_alignment = "high_congruence"
        elif "Early_blight" in primary_class_key and morph_pattern == "concentric_rings":
            morphology_alignment = "high_congruence"
        elif "Bacterial_spot" in primary_class_key and morph_pattern == "angular_vein_restricted":
            morphology_alignment = "high_congruence"
        t_route_end = time.perf_counter()

        # 7. Synthesize Agronomic Recommendations via Context Engine (Zero-Latency In-Memory Database)
        t_recs_start = time.perf_counter()
        recs = get_recommendations(
            predicted_class=primary_class_key,
            confidence=final_confidence,
            top_predictions=top_predictions,
            image_quality=quality,
            morphology=morphology,
            top_hosts=top_hosts,
            is_ood=is_ood
        )
        t_recs_end = time.perf_counter()
        t_overall_end = time.perf_counter()

        timing_profiling = {
            "image_decode_and_resize_ms": timing_breakdown.get("image_decode_and_resize_ms", 0.0),
            "quality_screening_ms": timing_breakdown.get("quality_screening_ms", 0.0),
            "hsv_foliar_segmentation_ms": timing_breakdown.get("hsv_foliar_segmentation_ms", 0.0),
            "tensor_normalization_ms": timing_breakdown.get("tensor_normalization_ms", 0.0),
            "neural_inference_ms": round((t_inf_end - t_inf_start) * 1000, 2),
            "hierarchical_routing_ms": round((t_route_end - t_route_start) * 1000, 2),
            "chemical_prescription_retrieval_ms": round((t_recs_end - t_recs_start) * 1000, 2),
            "total_pipeline_ms": round((t_overall_end - t_overall_start) * 1000, 2)
        }

        # 8. Assemble Full Two-Tier Diagnostic API Payload
        host_meta = BOTANICAL_HOSTS.get(selected_host, {})
        response = {
            "prediction": recs["disease"],
            "crop": selected_host,
            "class_key": primary_class_key,
            "confidence": final_confidence,
            "confidence_percent": round(final_confidence * 100, 2),
            "status": recs["status_code"],
            "status_display": recs["status_display"],
            "is_healthy": recs["is_healthy"],
            "is_ood": is_ood,
            "botanical_host": {
                "host": selected_host,
                "botanical_name": host_meta.get("botanical", "N/A"),
                "family": host_meta.get("family", "N/A"),
                "category": host_meta.get("category", "FOOD_CROP"),
                "confidence": round(host_marginal, 4),
                "confidence_percent": round(host_marginal * 100, 2),
                "user_selected": user_override
            },
            "scientific_name": recs["scientific_name"],
            "severity": recs["severity"],
            "safety_message": recs["safety_message"],
            "uncertainty_warning": recs["uncertainty_warning"],
            "clarification": recs["clarification"],
            "top_hosts": top_hosts[:3],
            "top_predictions": top_predictions[:3],
            "morphology": {
                "pattern": morphology.get("pattern", "none"),
                "pattern_display": morphology.get("pattern_display", "Uniform Surface"),
                "margin_roughness": morphology.get("margin_roughness", 1.0),
                "circularity": morphology.get("circularity", 1.0),
                "concentric_score": morphology.get("concentric_score", 0.0),
                "diagnostic_note": morphology.get("diagnostic_note", ""),
                "alignment": morphology_alignment
            },
            "lesion_metrics": {
                "affected_area_pct": lesion_metrics["affected_area_pct"],
                "severity": lesion_metrics["severity"],
                "leaf_pixels": lesion_metrics.get("leaf_pixels", 0),
                "disease_pixels": lesion_metrics.get("disease_pixels", 0)
            },
            "contour_overlay": lesion_metrics.get("contour_overlay", ""),
            "redirect_to_krishi_sakha": recs.get("redirect_to_krishi_sakha", False),
            "image_quality": {
                "score": quality["score"],
                "status": quality["status"],
                "laplacian_variance": quality["laplacian_variance"],
                "issues": quality["issues"]
            },
            "ornamental_care": recs.get("ornamental_care"),
            "orchard_care": recs.get("orchard_care"),
            "symptoms": recs["symptoms"],
            "causes": recs["causes"],
            "cultural_management": recs["cultural_management"],
            "organic_remedies": recs["organic_remedies"],
            "chemical_treatments_allowed": recs["chemical_treatments_allowed"],
            "chemical_notice": recs["chemical_notice"],
            "chemical_remedies": recs["chemical_remedies"],
            "tank_mix": recs["tank_mix"],
            "recapture_guidelines": recs["recapture_guidelines"],
            "timing_profiling_ms": timing_profiling,
            "model_metadata": {
                "model_version": self.metadata.get("model_version", MODEL_VERSION),
                "architecture": "MobileNetV3-Small (Hierarchical 2-Stage)",
                "total_classes": len(self.class_names),
                "total_hosts": len(BOTANICAL_HOSTS)
            }
        }

        return response

# Global Singleton
_predictor_instance = None

def get_predictor():
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = FloraScanPredictor()
    return _predictor_instance
