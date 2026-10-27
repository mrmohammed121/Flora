"""
evaluate.py - FloraScan AI Rigorous Model Evaluation Pipeline
Evaluates the trained MobileNetV3-Small model on the unseen TEST dataset partition.
Calculates Accuracy, per-class Precision, Recall, F1-Score, and full Confusion Matrix.
Saves comprehensive reports to reports/classification_report.txt and reports/confusion_matrix.json.
"""

import os
import sys
import json
import time
import numpy as np
import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

# Safe Windows stdout encoding
if sys.platform == 'win32' and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from model import load_checkpoint

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DIR = os.path.join(BASE_DIR, "dataset", "test")
MODEL_PATH = os.path.join(BASE_DIR, "models", "florascan_model.pth")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
REPORT_TXT_PATH = os.path.join(REPORTS_DIR, "classification_report.txt")
CONF_MATRIX_PATH = os.path.join(REPORTS_DIR, "confusion_matrix.json")
EVAL_METRICS_PATH = os.path.join(REPORTS_DIR, "evaluation_metrics.json")

IMG_SIZE = 224

def evaluate_florascan(model_path=MODEL_PATH, test_dir=TEST_DIR):
    print("=" * 65)
    print("  FLORASCAN AI — HELD-OUT TEST SET EVALUATION")
    print("=" * 65)

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Trained model not found at: {model_path}. Please run train.py first.")

    if not os.path.exists(test_dir):
        raise FileNotFoundError(f"Test dataset directory not found at: {test_dir}")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INFO] Computing device: {device}")

    # Load model and class names
    model, class_names, metadata = load_checkpoint(model_path, device=device)
    num_classes = len(class_names)
    print(f"[INFO] Loaded model version: {metadata.get('model_version', 'Unknown')}")
    print(f"[INFO] Evaluating across {num_classes} classes: {class_names}")

    test_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    test_dataset = datasets.ImageFolder(test_dir, transform=test_transform)
    test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False, num_workers=0)
    print(f"[INFO] Test dataset size: {len(test_dataset)} unseen images")

    y_true = []
    y_pred = []
    y_probs = []

    model.eval()
    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)

            y_true.extend(labels.cpu().numpy().tolist())
            y_pred.extend(preds.cpu().numpy().tolist())
            y_probs.extend(probs.cpu().numpy().tolist())

    y_true = np.array(y_true)
    y_pred = np.array(y_pred)

    # 1. Confusion Matrix: Rows = True, Cols = Predicted
    cm = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        cm[t, p] += 1

    # 2. Per-Class Metrics
    per_class_results = {}
    precisions = []
    recalls = []
    f1s = []
    supports = []

    for i, cls_name in enumerate(class_names):
        tp = cm[i, i]
        fp = np.sum(cm[:, i]) - tp
        fn = np.sum(cm[i, :]) - tp
        support = int(np.sum(cm[i, :]))

        precision = float(tp / (tp + fp)) if (tp + fp) > 0 else 0.0
        recall = float(tp / (tp + fn)) if (tp + fn) > 0 else 0.0
        f1 = float(2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

        precisions.append(precision)
        recalls.append(recall)
        f1s.append(f1)
        supports.append(support)

        per_class_results[cls_name] = {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "support": support
        }

    total_correct = int(np.trace(cm))
    total_samples = int(len(y_true))
    overall_accuracy = float(total_correct / total_samples) if total_samples > 0 else 0.0

    macro_precision = float(np.mean(precisions))
    macro_recall = float(np.mean(recalls))
    macro_f1 = float(np.mean(f1s))

    total_support = sum(supports)
    weighted_precision = float(sum(p * s for p, s in zip(precisions, supports)) / total_support) if total_support > 0 else 0.0
    weighted_recall = float(sum(r * s for r, s in zip(recalls, supports)) / total_support) if total_support > 0 else 0.0
    weighted_f1 = float(sum(f * s for f, s in zip(f1s, supports)) / total_support) if total_support > 0 else 0.0

    # 3. Identify Lowest-Performing Class
    worst_class = None
    worst_f1 = 1.01
    for cls_name, metrics in per_class_results.items():
        if metrics["f1_score"] < worst_f1:
            worst_f1 = metrics["f1_score"]
            worst_class = cls_name

    # 4. Generate Standard Classification Report Text
    lines = []
    lines.append("=" * 75)
    lines.append(f"  FLORASCAN AI — MODEL EVALUATION REPORT ({time.strftime('%Y-%m-%d %H:%M:%S')})")
    lines.append(f"  Model: {metadata.get('model_version', 'MobileNetV3-Small')} | Test Samples: {total_samples}")
    lines.append("=" * 75)
    lines.append(f"{'Class Name':<32} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'Support':>8}")
    lines.append("-" * 75)

    for cls_name in class_names:
        m = per_class_results[cls_name]
        lines.append(f"{cls_name:<32} {m['precision']:>10.4f} {m['recall']:>10.4f} {m['f1_score']:>10.4f} {m['support']:>8d}")

    lines.append("-" * 75)
    lines.append(f"{'Overall Accuracy':<32} {'':<10} {'':<10} {overall_accuracy:>10.4f} {total_support:>8d}")
    lines.append(f"{'Macro Average':<32} {macro_precision:>10.4f} {macro_recall:>10.4f} {macro_f1:>10.4f} {total_support:>8d}")
    lines.append(f"{'Weighted Average':<32} {weighted_precision:>10.4f} {weighted_recall:>10.4f} {weighted_f1:>10.4f} {total_support:>8d}")
    lines.append("=" * 75)
    lines.append("\nPERFORMANCE ANALYSIS & DIAGNOSTIC OBSERVATIONS:")
    lines.append(f"• Overall Test Accuracy: {overall_accuracy * 100:.2f}%")
    lines.append(f"• Macro F1-Score: {macro_f1 * 100:.2f}%")
    lines.append(f"• Lowest-Performing Class: {worst_class} (F1 = {worst_f1 * 100:.2f}%)")
    if worst_f1 < 0.70:
        lines.append(f"  [!] Recommendation: Collect additional diverse field images and augment angles for {worst_class}.")
    else:
        lines.append("  [OK] All classes exhibit robust generalization and diagnostic discrimination.")

    report_text = "\n".join(lines)
    print("\n" + report_text)

    # 5. Save Artifacts
    os.makedirs(REPORTS_DIR, exist_ok=True)
    with open(REPORT_TXT_PATH, "w", encoding="utf-8") as f:
        f.write(report_text)
    print(f"\n[OK] Classification report written to: {REPORT_TXT_PATH}")

    conf_matrix_data = {
        "classes": class_names,
        "matrix": cm.tolist()
    }
    with open(CONF_MATRIX_PATH, "w", encoding="utf-8") as f:
        json.dump(conf_matrix_data, f, indent=2)
    print(f"[OK] Confusion matrix written to: {CONF_MATRIX_PATH}")

    summary_metrics = {
        "model_version": metadata.get("model_version", "MobileNetV3-Small"),
        "evaluation_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "test_samples": total_samples,
        "overall_accuracy": round(overall_accuracy, 4),
        "macro_precision": round(macro_precision, 4),
        "macro_recall": round(macro_recall, 4),
        "macro_f1": round(macro_f1, 4),
        "weighted_f1": round(weighted_f1, 4),
        "lowest_performing_class": worst_class,
        "lowest_f1_score": round(worst_f1, 4),
        "per_class": per_class_results
    }
    with open(EVAL_METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(summary_metrics, f, indent=2)
    print(f"[OK] Evaluation metrics written to: {EVAL_METRICS_PATH}")

    return summary_metrics

if __name__ == "__main__":
    evaluate_florascan()
