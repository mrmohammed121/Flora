"""
recommendations.py - FloraScan AI Agronomic Recommendation & Context Engine
Manages:
1. Botanical taxonomy & crop category resolution (Food Crops, Ornamentals, Orchard Trees, Non-Agricultural)
2. Category-specific prescription protocols (PHI/REI for vegetables vs Petal Safety & Winter Sanitation for Ornamentals)
3. Confidence gating & strict chemical suppression (<60% or Unrecognized OOD)
4. Interactive Human-in-the-Loop Clarification generation
"""

import os
import json

HIGH_CONFIDENCE_THRESHOLD = 0.75     # >= 75%: Confirmed
MODERATE_CONFIDENCE_THRESHOLD = 0.50 # >= 50%: Likely
                                     # < 50%: Uncertain (Triggers Krishi Sakha Gemini Vision fallback)

DISEASE_DB_PATH = os.path.join(os.path.dirname(__file__), "diseases.json")

def load_disease_database():
    """Load the structured agronomic disease database."""
    if not os.path.exists(DISEASE_DB_PATH):
        return {}
    with open(DISEASE_DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

DISEASE_DB = load_disease_database()

def generate_clarification_prompt(top_hosts: list, top_predictions: list, morphology: dict = None) -> dict:
    """
    Constructs an interactive Human-in-the-Loop clarification question when:
    - Vision model confidence is borderline (50% - 80%)
    - Top predicted classes belong to different host plant botanical groups
    - Visual morphology shows diagnostic features (e.g. feathery edges vs concentric rings)
    """
    if not top_hosts or len(top_hosts) < 2:
        return {"needed": False}

    host1, conf1 = top_hosts[0]["host"], top_hosts[0]["confidence"]
    host2, conf2 = top_hosts[1]["host"], top_hosts[1]["confidence"]

    # If top host confidence is already dominant (>85%) or difference is huge (>0.30), no clarification needed
    if conf1 >= 0.85 and (conf1 - conf2) > 0.30:
        return {"needed": False}

    # Case A: Ornamental (Rose) vs Solanaceous Crop (Tomato/Potato)
    if (host1 == "Rose" and host2 in ["Tomato", "Potato"]) or (host2 == "Rose" and host1 in ["Tomato", "Potato"]):
        return {
            "needed": True,
            "question": "Is this a garden shrub (Rose) or a vegetable crop (Tomato / Potato)?",
            "field_check": "Do you see feathery fringed margins on the spots (Rose Black Spot) or concentric circular bullseye rings (Early Blight)?",
            "reason": "Borderline vision score between Rosaceae and Solanaceae foliar symptoms. Your input enables 100% accurate biological gating.",
            "options": [
                {
                    "label": "Rose (Garden Shrub)",
                    "value": "Rose",
                    "badge": "Ornamental",
                    "hint": "Thorny cane shrub; spots have feathery/fringed edges with yellow halos."
                },
                {
                    "label": "Tomato (Solanaceous Crop)",
                    "value": "Tomato",
                    "badge": "Vegetable Crop",
                    "hint": "Herbaceous crop; spots show concentric bullseye rings or greasy bacterial dots."
                },
                {
                    "label": "Potato (Field Crop)",
                    "value": "Potato",
                    "badge": "Field Crop",
                    "hint": "Tubers below ground; dark lesions with chlorotic margins on ovate leaflets."
                }
            ]
        }

    # Case B: Fruit Orchard (Apple/Citrus) vs Field Vegetable
    if (host1 in ["Apple", "Citrus"] and host2 in ["Tomato", "Potato", "Pepper"]) or \
       (host2 in ["Apple", "Citrus"] and host1 in ["Tomato", "Potato", "Pepper"]):
        return {
            "needed": True,
            "question": f"Is this specimen from an orchard tree ({host1}) or a field vegetable ({host2})?",
            "field_check": "Confirm whether the leaf originates from a woody perennial tree canopy or an annual field vegetable crop.",
            "reason": "Perennial orchard treatments (Tree Row Volume) differ fundamentally from annual row-crop sprays.",
            "options": [
                {"label": f"{host1} (Orchard Tree)", "value": host1, "badge": "Perennial Orchard", "hint": f"Perennial woody tree canopy ({host1})."},
                {"label": f"{host2} (Field Crop)", "value": host2, "badge": "Row Crop", "hint": f"Herbaceous annual crop foliage ({host2})."}
            ]
        }

    # Case C: Closely related field crops (e.g. Tomato vs Potato vs Pepper)
    if conf1 < 0.80 and (conf1 - conf2) < 0.20:
        return {
            "needed": True,
            "question": f"Please verify the host plant species: is this {host1} or {host2}?",
            "field_check": "Inspect leaf morphology: Tomato has pinnately divided pungent leaves, Potato has large terminal leaflets, Pepper has smooth elliptic leaves.",
            "reason": "Multiple solanaceous crops share similar spot morphology. Selecting the exact crop applies tailored harvest intervals.",
            "options": [
                {"label": host1, "value": host1, "badge": "Host Plant", "hint": f"Cultivated {host1} foliage."},
                {"label": host2, "value": host2, "badge": "Host Plant", "hint": f"Cultivated {host2} foliage."}
            ]
        }

    return {"needed": False}


def get_recommendations(
    predicted_class: str,
    confidence: float,
    top_predictions: list = None,
    image_quality: dict = None,
    morphology: dict = None,
    top_hosts: list = None,
    is_ood: bool = False
) -> dict:
    """
    Synthesizes agronomist recommendations, category-specific safety notices,
    and cultural protocols based on hierarchical host gating and confidence.
    """
    info = DISEASE_DB.get(predicted_class, {
        "disease": predicted_class.replace("___", " ").replace("_", " "),
        "crop": predicted_class.split("___")[0] if "___" in predicted_class else "Unknown",
        "host_species": predicted_class.split("___")[0] if "___" in predicted_class else "Unknown",
        "botanical_name": "Agricultural Crop",
        "plant_family": "Angiosperms",
        "category": "FOOD_CROP",
        "scientific_name": "N/A",
        "status": "Unknown",
        "severity": "Unassessed",
        "symptoms": ["Unspecified foliar symptoms observed."],
        "causes": "Etiological cause unconfirmed.",
        "cultural_management": ["Prune visibly diseased tissue and monitor crop."],
        "organic_remedies": ["Apply standard biocontrol agent if symptoms persist."],
        "chemical_remedies": [],
        "source": "FloraScan Extension Advisory"
    })

    disease_name = info.get("disease", predicted_class)
    crop_name = info.get("crop", "Plant")
    host_species = info.get("host_species", crop_name)
    botanical_name = info.get("botanical_name", "N/A")
    category = info.get("category", "FOOD_CROP")
    is_healthy = "healthy" in predicted_class.lower()

    # 1. Out-of-Distribution or Non-Agricultural Object handling
    if is_ood or category == "NON_AGRICULTURAL" or predicted_class == "Background___unrecognized":
        return {
            "status_code": "unrecognized_species",
            "status_display": "Unrecognized / Non-Agricultural",
            "is_healthy": False,
            "crop": "Unrecognized",
            "host_species": "Unknown",
            "botanical_name": "Non-crop background specimen",
            "category": "NON_AGRICULTURAL",
            "disease": "Unrecognized Foliage / Background",
            "scientific_name": "N/A",
            "severity": "None",
            "safety_message": "Plant species not currently recognized. Please specify the host crop or upload a clear agricultural crop leaf.",
            "uncertainty_warning": "The scanned image does not match supported agricultural or horticultural species.",
            "clarification": {
                "needed": True,
                "question": "Which agricultural crop is this leaf from?",
                "field_check": "Select the host crop to unlock biological disease identification:",
                "options": [
                    {"label": "Tomato", "value": "Tomato", "badge": "Vegetable"},
                    {"label": "Cucumber", "value": "Cucumber", "badge": "Cucurbit"},
                    {"label": "Potato", "value": "Potato", "badge": "Vegetable"},
                    {"label": "Rose", "value": "Rose", "badge": "Ornamental"},
                    {"label": "Apple", "value": "Apple", "badge": "Orchard"},
                    {"label": "Citrus", "value": "Citrus", "badge": "Orchard"},
                    {"label": "Pepper", "value": "Pepper", "badge": "Vegetable"}
                ]
            },
            "symptoms": ["Specimen exhibits non-crop background patterns, weed foliage, artificial textures, or non-botanical objects."],
            "causes": "Out-of-Distribution specimen, camera obstruction, weed foliage, or non-plant material.",
            "cultural_management": [
                "Position the camera directly facing an agricultural crop leaf",
                "Select the specific crop type using the crop selector",
                "Ensure the leaf occupies at least 70% of the image frame under natural daylight"
            ],
            "organic_remedies": [],
            "chemical_treatments_allowed": False,
            "chemical_notice": "Chemical prescriptions are completely suppressed for unrecognized or non-agricultural species.",
            "chemical_remedies": [],
            "tank_mix": "No chemical application permitted on unrecognized species.",
            "recapture_guidelines": [
                "Capture an agricultural or garden plant leaf (Tomato, Potato, Rose, Apple, Citrus, Pepper)",
                "Ensure sharp focus on leaf veins and lesion margins",
                "Avoid capturing fingers, soil, tools, or desk surfaces"
            ],
            "source": "FloraScan Out-of-Distribution Safety Protocol"
        }

    # 2. Determine Diagnostic Status based on confidence (50% threshold safeguard)
    if confidence >= HIGH_CONFIDENCE_THRESHOLD:
        status_code = "confirmed"
        status_display = "Confirmed Diagnosis"
        redirect_to_krishi_sakha = False
    elif confidence >= MODERATE_CONFIDENCE_THRESHOLD:
        status_code = "likely"
        status_display = "Likely Diagnosis"
        redirect_to_krishi_sakha = False
    else:
        status_code = "uncertain"
        status_display = "Uncertain Diagnosis (<50%)"
        redirect_to_krishi_sakha = True

    # 3. Check for Top-Prediction Ambiguity (Uncertainty Notice)
    uncertainty_warning = None
    if top_predictions and len(top_predictions) >= 2:
        top1 = top_predictions[0]
        top2 = top_predictions[1]
        diff = top1["confidence"] - top2["confidence"]
        if diff < 0.15 and confidence < 0.75:
            uncertainty_warning = (
                f"Model uncertainty is elevated because multiple conditions ({top1['disease']} and {top2['disease']}) "
                f"share visually similar foliar symptoms. Review differential features carefully."
            )

    # 4. Human-in-the-Loop Clarification Evaluation
    clarification = generate_clarification_prompt(top_hosts, top_predictions, morphology)

    # 5. Low-Confidence / Uncertain Safety Protocol & Chemical Gating
    recapture_guidelines = [
        "Capture well-lit photos under natural daylight without heavy shadows or flash glare",
        "Photograph both upper (adaxial) and lower (abaxial) surfaces of affected leaves",
        "Provide a clear close-up of lesion margins and concentric zones",
        "Capture multiple leaves showing early vs. advanced symptom progression",
        "Specify the exact host crop in the crop selector to constrain diagnostic candidates"
    ]

    chemical_treatments_allowed = True
    safety_message = None
    chemical_notice = None

    if status_code == "uncertain":
        chemical_treatments_allowed = False
        safety_message = (
            f"Uncertain diagnosis. The leaf symptoms do not clearly match known field diseases "
            f"({confidence * 100:.1f}% confidence, below the 50% diagnostic threshold). "
            f"Redirecting to Krishi Sakha for visual inspection..."
        )
        chemical_notice = (
            "Chemical treatments are suppressed due to uncertain prediction confidence (<50%). "
            "FloraScan AI requires confirmed or likely diagnosis (>=50%) before recommending specific "
            "chemical pesticides to prevent inappropriate agrochemical usage. "
            "Use Krishi Sakha Gemini Vision verification or consult a local extension officer."
        )
    elif status_code == "likely":
        safety_message = (
            f"Foliar patterns are likely consistent with {disease_name} ({confidence * 100:.1f}% confidence). "
            f"Verify with field scouting before undertaking intensive chemical interventions."
        )

    # 6. Category-Specific Prescription Engine
    ornamental_care = info.get("ornamental_care")
    orchard_care = info.get("orchard_care")

    # If Ornamental, adjust chemical notices and highlights
    if category == "ORNAMENTAL":
        if ornamental_care and ornamental_care.get("petal_safety"):
            if not safety_message:
                safety_message = f"ORNAMENTAL PROTOCOL: {ornamental_care['petal_safety']}"
            else:
                safety_message += f" | NOTE: {ornamental_care['petal_safety']}"

    # Prepare final output structure
    recommendation_payload = {
        "status_code": status_code,
        "status_display": status_display,
        "is_healthy": is_healthy,
        "crop": crop_name,
        "host_species": host_species,
        "botanical_name": botanical_name,
        "category": category,
        "disease": disease_name,
        "scientific_name": info.get("scientific_name", "N/A"),
        "severity": info.get("severity", "Moderate"),
        "safety_message": safety_message,
        "uncertainty_warning": uncertainty_warning,
        "clarification": clarification,
        "morphological_indicators": info.get("morphological_indicators", {}),
        "ornamental_care": ornamental_care,
        "orchard_care": orchard_care,
        "symptoms": info.get("symptoms", []),
        "causes": info.get("causes", ""),
        "cultural_management": info.get("cultural_management", []),
        "organic_remedies": info.get("organic_remedies", []),
        "chemical_treatments_allowed": chemical_treatments_allowed,
        "chemical_notice": chemical_notice,
        "chemical_remedies": info.get("chemical_remedies", []) if chemical_treatments_allowed else [],
        "tank_mix": info.get("tank_mix", "") if chemical_treatments_allowed else "",
        "redirect_to_krishi_sakha": redirect_to_krishi_sakha,
        "recapture_guidelines": recapture_guidelines if status_code in ["uncertain", "low_confidence"] else [],
        "source": info.get("source", "FloraScan Agritech Extension")
    }

    return recommendation_payload
