# FloraScan AI — Computer Vision & Plant Disease Model Architecture

This directory houses the machine learning and computer vision pipeline for **FloraScan AI**.

---

## 1. What Model is Being Used?
- **Architecture**: `MobileNetV3-Small` via PyTorch (`torchvision.models.mobilenet_v3_small`).
- **Pretraining**: Initialized with ImageNet weights (`MobileNet_V3_Small_Weights.DEFAULT`).
- **Classifier Head**:
  ```python
  nn.Sequential(
      nn.Linear(in_features, 256),
      nn.Hardswish(inplace=True),
      nn.Dropout(p=0.3),
      nn.Linear(256, num_classes)
  )
  ```
- **Trade-off Evaluation**: MobileNetV3-Small provides superior foliar feature extraction while maintaining rapid inference times (<25ms on CPU) and a tiny binary footprint (~9MB).

---

## 2. What Dataset is Being Used?
- **Source**: Authentic **PlantVillage** dataset repository (`spMohanty/PlantVillage-Dataset`).
- **Target Classes (10)**:
  1. `Apple___Apple_scab`
  2. `Apple___Black_rot`
  3. `Apple___healthy`
  4. `Potato___Early_blight`
  5. `Potato___Late_blight`
  6. `Potato___healthy`
  7. `Tomato___Bacterial_spot`
  8. `Tomato___Early_blight`
  9. `Tomato___Late_blight`
  10. `Tomato___healthy`
- **Data Splitting & Leakage Prevention**:
  - **Train**: 70%
  - **Validation**: 15%
  - **Test**: 15%
  - Split deterministically before downloading; held-out test images are strictly kept unseen until final evaluation.

---

## 3. How the Model is Trained
- **Augmentation**:
  - Random Horizontal Flip ($p=0.5$)
  - Subtle rotations ($\pm 12^\circ$)
  - Minor translation ($\pm 4\%$) and scale ($0.96 \times - 1.04 \times$)
  - Controlled color jitter (brightness $\pm 8\%$, contrast $\pm 8\%$) to simulate variable field lighting without distorting pathogen necrosis.
- **Two-Phase Transfer Learning**:
  - **Phase 1**: Backbone frozen, custom classifier head trained for 5 epochs with Adam ($LR=10^{-3}$).
  - **Phase 2**: Upper feature blocks (layers 8 to 12) unfrozen for fine-tuning with AdamW ($LR=10^{-4}$) and `ReduceLROnPlateau` ($factor=0.5, patience=2$).
- **EarlyStopping & Checkpointing**: Tracks validation loss, checkpointing the optimal weights to `models/florascan_model.pth`.

---

## 4. How Confidence is Calculated
- **No Fabricated Confidence Values**:
  The neural network computes raw logits $z$. The model applies standard Softmax:
  $$\sigma(z)_i = \frac{e^{z_i}}{\sum_{j=1}^K e^{z_j}}$$
- **Confidence**: The maximum softmax probability corresponding to the predicted class.
- **Top-3 Differential Predictions**: Returns the top 3 highest probabilities so growers can see visually similar diseases when symptoms overlap.
- **Uncertainty Alert**: Triggered if the difference between the Top 2 candidates is $< 15\%$.

---

## 5. How Low-Confidence Predictions are Handled
- **Configurable Thresholds**:
  - $\ge 85\%$: **Confirmed Diagnosis** (full treatment and verified chemical fungicides displayed).
  - $60\% - 84\%$: **Likely Diagnosis** (field scouting advised).
  - $< 60\%$: **Low-Confidence Assessment**.
- **Safety Protocol**:
  - If confidence $< 60\%$, FloraScan AI **suppresses all chemical pesticide recommendations**.
  - A prominent amber alert informs the grower:
    > *"The image contains symptoms that may be consistent with [Disease], but the model confidence is not sufficiently reliable for confirmation."*
  - Re-capture instructions guide the user on daylight lighting, photographing both leaf sides, capturing multiple leaves, and using the crop selector.

---

## 6. How the Frontend Receives Predictions
- Client sends `multipart/form-data` with:
  - `file`: Raw image bytes
  - `crop` (optional): "Tomato", "Potato", or "Apple"
- API responds with standardized JSON consumed by `src/App.jsx`:
  ```json
  {
    "prediction": "Early Blight",
    "crop": "Tomato",
    "class_key": "Tomato___Early_blight",
    "confidence": 0.824,
    "confidence_percent": 82.4,
    "status": "likely",
    "status_display": "Likely Diagnosis",
    "top_predictions": [...],
    "image_quality": {
      "score": 0.91,
      "status": "good",
      "laplacian_variance": 142.3,
      "issues": []
    },
    "lesion_metrics": {
      "affected_area_pct": 24.01,
      "severity": "Moderate"
    },
    "symptoms": [...],
    "causes": "...",
    "cultural_management": [...],
    "organic_remedies": [...],
    "chemical_treatments_allowed": true,
    "chemical_remedies": [...],
    "tank_mix": "..."
  }
  ```

---

## 7. How to Retrain the Model with Additional Images
1. Place new images into `dataset/train/<Class_Name>/` and `dataset/validation/<Class_Name>/`.
2. Or use `dataset_manager.py` to pull additional samples:
   ```bash
   python dataset_manager.py dataset 50
   ```
3. Run the training script:
   ```bash
   python train.py
   ```
4. Run the evaluation script:
   ```bash
   python evaluate.py
   ```

---

## 8. Exact Commands to Train and Run FloraScan AI

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Prepare / Download Real Dataset (PlantVillage)
```bash
python dataset_manager.py dataset 35
```

### 3. Train the Transfer Learning Model
```bash
python train.py
```

### 4. Evaluate on Held-Out Test Set
```bash
python evaluate.py
```

### 5. Run Comprehensive Pipeline Verification Test
```bash
python test_pipeline.py
```

### 6. Start the Flask Backend Server
```bash
python app.py
```
*(Runs on `http://127.0.0.1:5000`)*

### 7. Start the Vite React Frontend
```bash
npm run dev
```
*(Runs on `http://localhost:5173`)*
