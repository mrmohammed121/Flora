"""
model.py - FloraScan AI Transfer Learning Architecture
Lightweight MobileNetV3-Small architecture for plant disease classification.
Provides optimal trade-off of high accuracy, rapid CPU inference (<25ms), and low memory footprint (~10MB).
"""

import os
import torch
import torch.nn as nn
from torchvision import models

MODEL_VERSION = "FloraScan-MobileNetV3-v1.0"

def build_model(num_classes: int, pretrained: bool = True, freeze_backbone: bool = False) -> nn.Module:
    """
    Constructs a MobileNetV3-Small network with transfer learning weights.
    Adapts the classifier head to the exact number of plant disease classes.
    """
    if pretrained:
        weights = models.MobileNet_V3_Small_Weights.DEFAULT
        model = models.mobilenet_v3_small(weights=weights)
    else:
        model = models.mobilenet_v3_small(weights=None)

    if freeze_backbone:
        for param in model.features.parameters():
            param.requires_grad = False

    # MobileNetV3 classifier head structure:
    # classifier[0]: Linear(in_features, 1024)
    # classifier[1]: Hardswish()
    # classifier[2]: Dropout(p=0.2, inplace=True)
    # classifier[3]: Linear(1024, 1000)
    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.Hardswish(inplace=True),
        nn.Dropout(p=0.3),
        nn.Linear(256, num_classes)
    )
    return model

def save_checkpoint(model: nn.Module, class_names: list, save_path: str, metadata: dict = None):
    """
    Saves model weights, class mappings, and metadata in a production-ready package.
    """
    os.makedirs(os.path.dirname(os.path.abspath(save_path)), exist_ok=True)
    payload = {
        "model_version": MODEL_VERSION,
        "state_dict": model.state_dict(),
        "class_names": class_names,
        "num_classes": len(class_names),
        "metadata": metadata or {}
    }
    torch.save(payload, save_path)
    print(f"[OK] Checkpoint saved successfully: {save_path}")

def load_checkpoint(weights_path: str, device: torch.device = None):
    """
    Loads model checkpoint and extracts class mappings and metadata.
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"Model weights not found at: {weights_path}")

    checkpoint = torch.load(weights_path, map_location=device)
    class_names = checkpoint.get("class_names", [])
    num_classes = checkpoint.get("num_classes", len(class_names))

    model = build_model(num_classes=num_classes, pretrained=False)
    model.load_state_dict(checkpoint["state_dict"])
    model.to(device)
    model.eval()

    return model, class_names, checkpoint.get("metadata", {})
