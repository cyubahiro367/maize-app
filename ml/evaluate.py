"""
Full test-set evaluation matching Section 3.8: accuracy, macro precision/recall/F1,
macro AUC-ROC, per-class breakdown, and a 4x4 confusion matrix figure.

Usage:
    python evaluate.py --data_dir ./data --model_dir ./exported_model --output_dir ./results
"""

import argparse
import os

import numpy as np
import tensorflow as tf
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
)
import matplotlib.pyplot as plt

from data_pipeline import build_datasets, CLASS_NAMES


def _extract_probs(raw_output):
    """model.export() writes an inference-only SavedModel whose serving signature
    returns a dict of output tensors, not a plain array. TFSMLayer surfaces the
    same dict shape, so unwrap it here regardless of the exact key name."""
    if isinstance(raw_output, dict):
        raw_output = list(raw_output.values())[0]
    return raw_output.numpy() if hasattr(raw_output, "numpy") else np.array(raw_output)


def main(data_dir: str, model_dir: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    # Keras 3 cannot load an inference-only export via load_model(); TFSMLayer
    # is the documented replacement for exactly this SavedModel shape.
    model = tf.keras.layers.TFSMLayer(model_dir, call_endpoint="serving_default")
    _, _, test_ds = build_datasets(data_dir)

    y_true, y_pred, y_prob = [], [], []
    for batch_x, batch_y in test_ds:
        probs = _extract_probs(model(batch_x))
        y_prob.extend(probs)
        y_pred.extend(np.argmax(probs, axis=1))
        y_true.extend(np.argmax(batch_y.numpy(), axis=1))

    y_true, y_pred, y_prob = np.array(y_true), np.array(y_pred), np.array(y_prob)

    report = classification_report(
        y_true, y_pred, target_names=CLASS_NAMES, digits=4, output_dict=True
    )
    auc = roc_auc_score(
        tf.keras.utils.to_categorical(y_true, num_classes=len(CLASS_NAMES)),
        y_prob,
        average="macro",
        multi_class="ovr",
    )

    print("=== Classification Report (per-class + macro avg) ===")
    print(classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4))
    print(f"Macro AUC-ROC: {auc:.4f}")

    with open(os.path.join(output_dir, "metrics.txt"), "w") as f:
        f.write(classification_report(y_true, y_pred, target_names=CLASS_NAMES, digits=4))
        f.write(f"\nMacro AUC-ROC: {auc:.4f}\n")

    cm = confusion_matrix(y_true, y_pred)
    fig, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(cm, cmap="Blues")
    ax.set_xticks(range(len(CLASS_NAMES)))
    ax.set_yticks(range(len(CLASS_NAMES)))
    ax.set_xticklabels(CLASS_NAMES, rotation=45, ha="right")
    ax.set_yticklabels(CLASS_NAMES)
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix — Test Set")
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            ax.text(j, i, cm[i, j], ha="center", va="center")
    fig.colorbar(im)
    fig.tight_layout()
    fig.savefig(os.path.join(output_dir, "confusion_matrix.png"), dpi=150)
    print(f"Saved confusion matrix to {output_dir}/confusion_matrix.png")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default="./data")
    parser.add_argument("--model_dir", default="./exported_model")
    parser.add_argument("--output_dir", default="./results")
    args = parser.parse_args()
    main(args.data_dir, args.model_dir, args.output_dir)