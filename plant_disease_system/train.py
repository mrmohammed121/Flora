"""
train.py - FloraScan AI Transfer Learning & Model Training Pipeline
Trains a lightweight MobileNetV3-Small CNN using realistic data augmentations,
class-balanced loss, two-phase transfer learning (head training -> fine-tuning),
learning rate scheduling (ReduceLROnPlateau), and EarlyStopping.
"""

import os
import sys
import json
import time
import copy
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from collections import Counter

# Safe Windows stdout encoding
if sys.platform == 'win32' and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from model import build_model, save_checkpoint, MODEL_VERSION

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODELS_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
MODEL_SAVE_PATH = os.path.join(MODELS_DIR, "florascan_model.pth")
CLASS_NAMES_PATH = os.path.join(MODELS_DIR, "class_names.json")
HISTORY_SAVE_PATH = os.path.join(REPORTS_DIR, "training_history.json")

BATCH_SIZE = 16
IMG_SIZE = 224
PHASE1_EPOCHS = 5   # Train classifier head
PHASE2_EPOCHS = 12  # Fine-tune upper feature layers
PATIENCE = 4

def get_transforms():
    """
    Constructs realistic augmentations that preserve diagnostic foliar features.
    """
    train_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=12),
        transforms.RandomAffine(degrees=0, translate=(0.04, 0.04), scale=(0.96, 1.04)),
        transforms.ColorJitter(brightness=0.08, contrast=0.08),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform

def train_florascan():
    print("=" * 65)
    print("  FLORASCAN AI — PRODUCTION MODEL TRAINING PIPELINE")
    print("=" * 65)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Computing device: {device}")

    train_dir = os.path.join(DATASET_DIR, "train")
    val_dir = os.path.join(DATASET_DIR, "validation")

    if not os.path.exists(train_dir) or not os.path.exists(val_dir):
        raise FileNotFoundError(f"Dataset split directories missing: {train_dir} or {val_dir}")

    train_transform, val_transform = get_transforms()

    train_dataset = datasets.ImageFolder(train_dir, transform=train_transform)
    val_dataset = datasets.ImageFolder(val_dir, transform=val_transform)

    class_names = train_dataset.classes
    num_classes = len(class_names)
    print(f"[INFO] Detected {num_classes} classes: {class_names}")

    # Inspect class counts & compute class balancing weights
    train_counts = Counter([train_dataset.targets[i] for i in range(len(train_dataset))])
    print("[INFO] Class image distribution in Train split:")
    for idx, name in enumerate(class_names):
        print(f"  - {name}: {train_counts[idx]} images")

    total_samples = len(train_dataset)
    class_weights = [total_samples / (num_classes * max(1, train_counts[idx])) for idx in range(num_classes)]
    weights_tensor = torch.tensor(class_weights, dtype=torch.float).to(device)
    print(f"[INFO] Computed class balancing weights.")

    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

    # Initialize Transfer Learning Model
    print("\n[INFO] Loading Pretrained MobileNetV3-Small backbone...")
    model = build_model(num_classes=num_classes, pretrained=True, freeze_backbone=True)
    model.to(device)

    criterion = nn.CrossEntropyLoss(weight=weights_tensor)

    # Track metrics history
    history = {
        "train_loss": [],
        "train_acc": [],
        "val_loss": [],
        "val_acc": [],
        "learning_rates": []
    }

    best_val_loss = float("inf")
    best_val_acc = 0.0
    best_model_weights = copy.deepcopy(model.state_dict())
    patience_counter = 0

    # -------------------------------------------------------------
    # PHASE 1: Warmup - Train Classification Head with Frozen Backbone
    # -------------------------------------------------------------
    print("\n" + "-" * 60)
    print("  PHASE 1: Training Classification Head (Backbone Frozen)")
    print("-" * 60)
    optimizer = torch.optim.Adam(model.classifier.parameters(), lr=1e-3, weight_decay=1e-4)

    for epoch in range(1, PHASE1_EPOCHS + 1):
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in train_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            _, preds = torch.max(outputs, 1)

            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()

        epoch_train_loss = running_loss / len(train_dataset)
        epoch_train_acc = running_corrects / len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        val_corrects = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data).item()

        epoch_val_loss = val_loss / len(val_dataset)
        epoch_val_acc = val_corrects / len(val_dataset)

        history["train_loss"].append(round(epoch_train_loss, 4))
        history["train_acc"].append(round(epoch_train_acc, 4))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["val_acc"].append(round(epoch_val_acc, 4))
        history["learning_rates"].append(1e-3)

        print(f"Phase 1 - Epoch [{epoch}/{PHASE1_EPOCHS}] | "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc*100:.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc*100:.2f}%")

        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            best_val_acc = epoch_val_acc
            best_model_weights = copy.deepcopy(model.state_dict())

    # -------------------------------------------------------------
    # PHASE 2: Fine-Tuning Upper Feature Layers + Classifier
    # -------------------------------------------------------------
    print("\n" + "-" * 60)
    print("  PHASE 2: Fine-Tuning Upper Feature Layers (LR=1e-4)")
    print("-" * 60)

    # Unfreeze upper feature blocks (layers 8 to 12)
    for i, block in enumerate(model.features):
        if i >= 8:
            for param in block.parameters():
                param.requires_grad = True

    optimizer = torch.optim.AdamW([
        {"params": [p for i, block in enumerate(model.features) if i >= 8 for p in block.parameters()], "lr": 1e-4},
        {"params": model.classifier.parameters(), "lr": 3e-4}
    ], weight_decay=1e-4)

    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", factor=0.5, patience=2, min_lr=1e-6
    )

    for epoch in range(1, PHASE2_EPOCHS + 1):
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in train_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            _, preds = torch.max(outputs, 1)

            loss.backward()
            optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data).item()

        epoch_train_loss = running_loss / len(train_dataset)
        epoch_train_acc = running_corrects / len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        val_corrects = 0
        with torch.no_grad():
            for inputs, labels in val_loader:
                inputs = inputs.to(device)
                labels = labels.to(device)
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                val_loss += loss.item() * inputs.size(0)
                val_corrects += torch.sum(preds == labels.data).item()

        epoch_val_loss = val_loss / len(val_dataset)
        epoch_val_acc = val_corrects / len(val_dataset)
        current_lr = optimizer.param_groups[0]["lr"]

        scheduler.step(epoch_val_loss)

        history["train_loss"].append(round(epoch_train_loss, 4))
        history["train_acc"].append(round(epoch_train_acc, 4))
        history["val_loss"].append(round(epoch_val_loss, 4))
        history["val_acc"].append(round(epoch_val_acc, 4))
        history["learning_rates"].append(current_lr)

        print(f"Phase 2 - Epoch [{epoch}/{PHASE2_EPOCHS}] | "
              f"Train Loss: {epoch_train_loss:.4f} Acc: {epoch_train_acc*100:.2f}% | "
              f"Val Loss: {epoch_val_loss:.4f} Acc: {epoch_val_acc*100:.2f}% | "
              f"LR: {current_lr:.6f}")

        # Checkpoint if best
        if epoch_val_loss < best_val_loss:
            best_val_loss = epoch_val_loss
            best_val_acc = epoch_val_acc
            best_model_weights = copy.deepcopy(model.state_dict())
            patience_counter = 0
            print("  [*] Model checkpoint updated (best validation loss)")
        else:
            patience_counter += 1
            if patience_counter >= PATIENCE:
                print(f"[INFO] Early stopping triggered after {PATIENCE} epochs without improvement.")
                break

    # Load best model weights
    model.load_state_dict(best_model_weights)

    # Save model and artifacts
    os.makedirs(MODELS_DIR, exist_ok=True)
    os.makedirs(REPORTS_DIR, exist_ok=True)

    metadata = {
        "model_version": MODEL_VERSION,
        "training_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "architecture": "MobileNetV3-Small",
        "num_classes": num_classes,
        "best_val_loss": round(best_val_loss, 4),
        "best_val_acc": round(best_val_acc, 4),
        "total_train_images": len(train_dataset),
        "total_val_images": len(val_dataset)
    }

    save_checkpoint(model, class_names, MODEL_SAVE_PATH, metadata=metadata)

    # Save class names JSON
    with open(CLASS_NAMES_PATH, "w", encoding="utf-8") as f:
        json.dump(class_names, f, indent=2)
    print(f"[OK] Saved class mapping to: {CLASS_NAMES_PATH}")

    # Also save to base classes.json for backwards compatibility
    with open(os.path.join(BASE_DIR, "classes.json"), "w", encoding="utf-8") as f:
        json.dump(class_names, f, indent=2)

    # Save training history
    with open(HISTORY_SAVE_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)
    print(f"[OK] Saved training history to: {HISTORY_SAVE_PATH}")

    print("\n" + "=" * 65)
    print(f"[OK] TRAINING COMPLETE! Best Val Acc: {best_val_acc*100:.2f}% | Best Val Loss: {best_val_loss:.4f}")
    print(f"[OK] Production model saved at: {MODEL_SAVE_PATH}")
    print("=" * 65)

    return model, class_names, metadata

if __name__ == "__main__":
    train_florascan()
