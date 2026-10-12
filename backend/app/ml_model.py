import io
import logging
import os

import numpy as np
from PIL import Image

from app.config import settings

logger = logging.getLogger("uvicorn.error")

# Class order MUST match the one-hot encoding used during training
# (Grey Leaf Spot=0, Northern Leaf Blight=1, Common Rust=2, Healthy=3)
CLASS_NAMES = [
    "grey_leaf_spot",
    "northern_leaf_blight",
    "common_rust",
    "healthy",
]

IMG_SIZE = (224, 224)

_model = None
_tf = None


def _lazy_import_tf():
    """TensorFlow import is slow (~seconds) — do it once, lazily, not at module import time."""
    global _tf
    if _tf is None:
        import tensorflow as tf  # noqa: WPS433

        _tf = tf
    return _tf


def load_model():
    """Loads the exported SavedModel once and caches it. Returns None (with a warning)
    if no trained model has been placed at MODEL_PATH yet, so the API can still boot
    for development/testing before training is complete."""
    global _model
    if _model is not None:
        return _model

    tf = _lazy_import_tf()

    if not os.path.isdir(settings.MODEL_PATH) or not os.listdir(settings.MODEL_PATH):
        logger.warning(
            "No model found at %s — /predict will return 503 until a trained "
            "model is placed there. See ml/train.py.",
            settings.MODEL_PATH,
        )
        return None

    logger.info("Loading model from %s", settings.MODEL_PATH)
    # train.py exports via model.export(), an inference-only SavedModel.
    # Keras 3's load_model() can't read that format — TFSMLayer is the
    # documented way to load it back for inference.
    _model = tf.keras.layers.TFSMLayer(settings.MODEL_PATH, call_endpoint="serving_default")
    return _model


def _extract_probs(raw_output):
    if isinstance(raw_output, dict):
        raw_output = list(raw_output.values())[0]
    return raw_output.numpy() if hasattr(raw_output, "numpy") else np.array(raw_output)


def preprocess_image(raw_bytes: bytes) -> "np.ndarray":
    tf = _lazy_import_tf()

    image = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    array = np.asarray(image, dtype=np.float32)
    array = tf.keras.applications.mobilenet_v2.preprocess_input(array)
    return np.expand_dims(array, axis=0)  # add batch dimension


def predict(raw_bytes: bytes) -> tuple[str, float]:
    """Returns (predicted_class_code, confidence)."""
    model = load_model()
    if model is None:
        raise RuntimeError("Model not loaded — place a trained SavedModel at MODEL_PATH")

    batch = preprocess_image(raw_bytes)
    probabilities = _extract_probs(model(batch))[0]
    class_index = int(np.argmax(probabilities))
    confidence = float(probabilities[class_index])
    return CLASS_NAMES[class_index], confidence