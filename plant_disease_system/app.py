"""
app.py - FloraScan AI Production Flask Backend & Inference API
Provides REST endpoints:
- POST /predict: Full 2-stage hierarchical ML inference, OOD detection, lesion morphology, and category-aware prescriptions
- GET /health: Model service status & loaded classes
- GET /api/model-info: Real evaluated model metrics (accuracy, F1, version)
- GET /api/crops: Supported agricultural & ornamental crops
- GET /api/diseases: Agronomic knowledge database
"""

import os
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

from predictor import get_predictor, BOTANICAL_HOSTS
from recommendations import load_disease_database

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
EVAL_METRICS_PATH = os.path.join(REPORTS_DIR, "evaluation_metrics.json")

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

predictor = get_predictor()

@app.route("/")
def home():
    if os.path.exists(os.path.join(BASE_DIR, "templates", "index.html")):
        return render_template("index.html")
    return jsonify({
        "service": "FloraScan AI Agritech Diagnostic API",
        "status": "online",
        "pipeline": "Two-Tier Hierarchical Classification (Botanical Host -> Pathogen)",
        "endpoints": {
            "predict": "POST /predict",
            "health": "GET /health",
            "model_info": "GET /api/model-info",
            "crops": "GET /api/crops",
            "diseases": "GET /api/diseases"
        }
    })

@app.route("/health", methods=["GET"])
def health():
    ready = predictor.is_ready()
    return jsonify({
        "status": "ready" if ready else "initializing",
        "device": str(predictor.device),
        "classes_count": len(predictor.class_names),
        "classes": predictor.class_names,
        "supported_hosts": [h for h in BOTANICAL_HOSTS if h != "Background"],
        "model_version": predictor.metadata.get("model_version", "FloraScan-MobileNetV3-v1.0")
    })

@app.route("/api/crops", methods=["GET"])
def get_crops():
    """Returns unique agricultural & ornamental crops supported by the active model."""
    crops = set()
    for c in predictor.class_names:
        if "___" in c:
            host = c.split("___")[0]
            if host != "Background":
                crops.add(host)
    return jsonify({
        "crops": ["All"] + sorted(list(crops)),
        "host_details": {k: v for k, v in BOTANICAL_HOSTS.items() if k != "Background"}
    })

@app.route("/api/diseases", methods=["GET"])
def get_diseases():
    """Returns the structured disease database."""
    db = load_disease_database()
    return jsonify(db)

@app.route("/api/model-info", methods=["GET"])
def model_info():
    """
    Returns authentic model metrics from held-out test evaluation.
    Never fabricates metrics.
    """
    if os.path.exists(EVAL_METRICS_PATH):
        try:
            with open(EVAL_METRICS_PATH, "r", encoding="utf-8") as f:
                metrics = json.load(f)
            return jsonify({
                "status": "success",
                "metrics": metrics
            })
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    return jsonify({
        "status": "pending_evaluation",
        "message": "Evaluation metrics not yet generated. Run evaluate.py on held-out test set."
    })

@app.route("/predict", methods=["POST"])
def predict():
    """
    Core Two-Tier Diagnostic Endpoint:
    Expects multipart form-data:
      - 'file' or 'image': leaf image file
      - 'crop' (optional): crop name (e.g., 'Rose', 'Tomato', 'Potato', 'Apple', 'Citrus', 'Pepper')
      - 'clarification_answer' (optional): user's answer to Human-in-the-Loop clarification prompt
    """
    file = request.files.get("file") or request.files.get("image")
    if not file or file.filename == "":
        return jsonify({
            "error": "No image file provided in request (use form field 'file' or 'image').",
            "status": "error"
        }), 400

    crop = request.form.get("crop") or request.args.get("crop") or None
    if crop and crop.strip().lower() in ["all", "any", "none", ""]:
        crop = None

    clarification_answer = request.form.get("clarification_answer") or request.args.get("clarification_answer") or None
    if clarification_answer and clarification_answer.strip().lower() in ["all", "any", "none", ""]:
        clarification_answer = None

    try:
        img_bytes = file.read()
        if len(img_bytes) == 0:
            return jsonify({"error": "Uploaded image file is empty.", "status": "error"}), 400

        # Execute 2-tier hierarchical inference pipeline
        result = predictor.predict(img_bytes, crop=crop, clarification_answer=clarification_answer)

        if "error" in result and result.get("status") == "error":
            code = 400 if "Invalid image upload" in result.get("error", "") else 500
            return jsonify(result), code

        # Backwards-compatibility adapters for existing frontend features
        # (SprayCalculator, jsPDF exporter, Krishi Sakha chat)
        result["disease"] = result.get("prediction", "")
        result["raw_class"] = result.get("class_key", "")
        result["affected_area_pct"] = result.get("lesion_metrics", {}).get("affected_area_pct", 0.0)

        # Convert chemical remedies into active_ingredients format if present
        chem_remedies = result.get("chemical_remedies", [])
        active_ingredients = []
        for r in chem_remedies:
            active_ingredients.append({
                "name": r.get("name", ""),
                "type": r.get("frac_group", "Fungicide"),
                "frac_group": r.get("frac_group", ""),
                "dosage_knapsack": r.get("dosage_knapsack", ""),
                "dosage_broadcast": r.get("dosage_broadcast", ""),
                "phi": r.get("phi", ""),
                "rei": r.get("rei", ""),
                "role": r.get("role", "")
            })
        result["active_ingredients"] = active_ingredients
        result["organic_remedy"] = "; ".join(result.get("organic_remedies", []))
        result["cultural_remedy"] = "; ".join(result.get("cultural_management", []))

        # Include category-aware spraying schedule and PPE
        category = result.get("botanical_host", {}).get("category", "FOOD_CROP")
        if category == "ORNAMENTAL":
            result["spraying_schedule"] = {
                "frequency": "7 to 10 days during warm, humid conditions",
                "application_window": "Early morning or late afternoon (Avoid direct sunlight and hot temperatures)",
                "rainfastness": "Requires 2 to 4 hours rain-free drying window",
                "special_warning": "CRITICAL: Do NOT spray directly onto open flower petals. Direct chemical contact causes petal scorch and harms pollinating honeybees."
            }
            result["safety_ppe"] = {
                "ppe": "Chemical-resistant gloves, protective eye goggles, N95 respirator mask.",
                "rei_summary": "12 hours (until spray has completely dried).",
                "phi_summary": "Not Applicable (Non-Edible Ornamental Garden Species)."
            }
        elif category == "PERENNIAL_ORCHARD":
            result["spraying_schedule"] = {
                "frequency": "Calibrate to Tree Row Volume (TRV); spray at early vegetative flush",
                "application_window": "Calm, low-wind early mornings to prevent spray drift across orchard canopy",
                "rainfastness": "Requires 3 to 5 hours rain-free drying window"
            }
            result["safety_ppe"] = {
                "ppe": "High-pressure orchard spray suit, chemical respirator, full face shield, nitrile gloves, rubber boots.",
                "rei_summary": "24 to 48 hours orchard re-entry restriction.",
                "phi_summary": "Observe strict pre-harvest interval before fruit harvest."
            }
        else: # FOOD_CROP
            result["spraying_schedule"] = {
                "frequency": "7 to 10 days during warm, humid conditions",
                "application_window": "Early morning or late afternoon",
                "rainfastness": "Requires 2 to 4 hours rain-free drying window"
            }
            result["safety_ppe"] = {
                "ppe": "Chemical-resistant gloves, protective eye goggles, N95 respirator mask, rubber boots.",
                "rei_summary": "12 to 24 hours re-entry interval.",
                "phi_summary": "Strictly observe Pre-Harvest Interval (PHI) on pesticide label before picking produce."
            }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": f"Prediction server error: {str(e)}",
            "status": "error"
        }), 500

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
