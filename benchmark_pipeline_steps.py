import os
import sys
import time
import cv2
import numpy as np
import torch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "plant_disease_system"))

from predictor import get_predictor
from image_preprocessing import (
    evaluate_image_quality,
    calculate_lesion_metrics,
    analyze_lesion_morphology,
    IMAGENET_MEAN,
    IMAGENET_STD
)
from recommendations import get_recommendations

# 1. Generate a raw 4K smartphone photo (4032 x 3024)
np.random.seed(42)
img_4k = np.full((3024, 4032, 3), (225, 230, 225), dtype=np.uint8)
cv2.ellipse(img_4k, (2016, 1512), (1200, 800), 25, 0, 360, (35, 140, 45), -1)
noise = np.random.randint(-12, 12, (3024, 4032, 3), dtype=np.int16)
img_4k = np.clip(img_4k.astype(np.int16) + noise, 0, 255).astype(np.uint8)
for center, r in [((1600, 1300), 120), ((2100, 1500), 90), ((2400, 1800), 150), ((1800, 2000), 80)]:
    cv2.circle(img_4k, center, r, (25, 60, 130), -1)

success, buf = cv2.imencode('.jpg', img_4k, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
raw_image_bytes = buf.tobytes()

print(f"=== 4K INPUT BENCHMARK ===")
print(f"Payload Size: {len(raw_image_bytes) / 1024:.1f} KB, Raw Dimensions: 4032x3024 (12.2 Megapixels)\n")

predictor = get_predictor()

# Step 1: Image Upload & Decode + Downscale to 512
t0 = time.perf_counter()
nparr = np.frombuffer(raw_image_bytes, np.uint8)
cv_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
h, w = cv_bgr.shape[:2]
TARGET_DIM = 512
if max(h, w) > TARGET_DIM:
    scale = TARGET_DIM / float(max(h, w))
    working_bgr = cv2.resize(cv_bgr, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
else:
    working_bgr = cv_bgr
t1 = time.perf_counter()
t_decode_ms = (t1 - t0) * 1000

# Step 2: Quality Screening
t0 = time.perf_counter()
quality = evaluate_image_quality(working_bgr)
t1 = time.perf_counter()
t_quality_ms = (t1 - t0) * 1000

# Step 3: HSV Evaluation & Foliar Mask Extraction (CLAHE + HSV + inRange + morphology)
t0 = time.perf_counter()
lesion_metrics = calculate_lesion_metrics(working_bgr)
t1 = time.perf_counter()
t_hsv_mask_ms = (t1 - t0) * 1000

# Step 4: Tensor Preparation (224x224)
t0 = time.perf_counter()
tensor_img = cv2.resize(working_bgr, (224, 224), interpolation=cv2.INTER_AREA)
tensor_rgb = cv2.cvtColor(tensor_img, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
mean = np.array(IMAGENET_MEAN, dtype=np.float32)
std = np.array(IMAGENET_STD, dtype=np.float32)
tensor_norm = (tensor_rgb - mean) / std
tensor = torch.from_numpy(tensor_norm.transpose(2, 0, 1)).unsqueeze(0).to(predictor.device)
t1 = time.perf_counter()
t_tensor_ms = (t1 - t0) * 1000

# Step 5: Neural Model Inference (MobileNetV3)
t0 = time.perf_counter()
with torch.inference_mode():
    outputs = predictor.model(tensor)
    raw_probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
t1 = time.perf_counter()
t_inference_ms = (t1 - t0) * 1000

# Step 6: Host Routing & OOD Detection
t0 = time.perf_counter()
host_probs = {}
for idx, cname in enumerate(predictor.class_names):
    host = predictor.get_host_for_class(cname)
    host_probs[host] = host_probs.get(host, 0.0) + float(raw_probs[idx])
sorted_hosts = sorted(host_probs.items(), key=lambda x: x[1], reverse=True)
top_host = sorted_hosts[0][0]
t1 = time.perf_counter()
t_routing_ms = (t1 - t0) * 1000

# Step 7: Chemical Prescription Retrieval & Safety Gating
t0 = time.perf_counter()
top_class = predictor.class_names[int(np.argmax(raw_probs))]
recs = get_recommendations(
    predicted_class=top_class,
    confidence=float(np.max(raw_probs)),
    is_ood=(top_host == "Background")
)
t1 = time.perf_counter()
t_prescription_ms = (t1 - t0) * 1000

# Total Pipeline
t_total_ms = t_decode_ms + t_quality_ms + t_hsv_mask_ms + t_tensor_ms + t_inference_ms + t_routing_ms + t_prescription_ms

print("=== STEP-BY-STEP PROFILING RESULTS (CPU) ===")
print(f"1. Image Upload, C++ Decode & 512px Resize : {t_decode_ms:6.2f} ms")
print(f"2. Foliar Quality & Exposure Screening    : {t_quality_ms:6.2f} ms")
print(f"3. HSV Color Space & Mask Segmentation     : {t_hsv_mask_ms:6.2f} ms")
print(f"4. Direct Tensor Normalization (224x224)   : {t_tensor_ms:6.2f} ms")
print(f"5. MobileNetV3 Neural Network Inference    : {t_inference_ms:6.2f} ms")
print(f"6. Two-Tier Host Species Routing           : {t_routing_ms:6.2f} ms")
print(f"7. Chemical Prescription Retrieval         : {t_prescription_ms:6.2f} ms")
print(f"--------------------------------------------------")
print(f"TOTAL END-TO-END PIPELINE LATENCY          : {t_total_ms:6.2f} ms")
print(f"Base64 Overlay Size                        : {len(lesion_metrics.get('contour_overlay', '')) / 1024:.1f} KB")
