"""
Two-phase MobileNetV2 transfer learning, per Section 3.7:

  Phase 1: train classification head only, 10 epochs, Adam lr=1e-4
  Phase 2: unfreeze top 30 base layers, fine-tune up to 50 epochs, Adam lr=1e-5,
           EarlyStopping(patience=7), ReduceLROnPlateau(factor=0.2, patience=7)

Usage:
    python train.py --data_dir ./data --output_dir ./exported_model
"""

import argparse
import json
import os

import tensorflow as tf

from data_pipeline import build_datasets, CLASS_NAMES, IMG_SIZE


def build_model():
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = False

    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = base_model(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(len(CLASS_NAMES), activation="softmax")(x)

    model = tf.keras.Model(inputs, outputs)
    return model, base_model


def main(data_dir: str, output_dir: str, log_dir: str):
    os.makedirs(log_dir, exist_ok=True)
    train_ds, val_ds, test_ds = build_datasets(data_dir)

    model, base_model = build_model()

    # ---------------- Phase 1: train the head only ----------------
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    print("=== Phase 1: training classification head ===")
    history_1 = model.fit(train_ds, validation_data=val_ds, epochs=10)

    # ---------------- Phase 2: fine-tune top 30 base layers ----------------
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss", patience=7, restore_best_weights=True
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.2, patience=7
        ),
        tf.keras.callbacks.CSVLogger(os.path.join(log_dir, "phase2_training_log.csv")),
    ]

    print("=== Phase 2: fine-tuning top 30 base layers ===")
    history_2 = model.fit(
        train_ds, validation_data=val_ds, epochs=50, callbacks=callbacks
    )

    # ---------------- Export ----------------
    os.makedirs(output_dir, exist_ok=True)
    # model.save() refuses plain directory paths in this Keras version.
    # model.export() writes an inference-only SavedModel, which is exactly what
    # the backend's TFSMLayer loader (and evaluate.py) expect.
    model.export(output_dir)
    print(f"Model exported to {output_dir}")

    with open(os.path.join(log_dir, "phase1_history.json"), "w") as f:
        json.dump(history_1.history, f)
    with open(os.path.join(log_dir, "phase2_history.json"), "w") as f:
        json.dump(history_2.history, f)

    # Quick sanity check on the test set (full evaluation lives in evaluate.py)
    test_loss, test_acc = model.evaluate(test_ds)
    print(f"Test accuracy (quick check): {test_acc:.4f}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", default="./data")
    parser.add_argument("--output_dir", default="./exported_model")
    parser.add_argument("--log_dir", default="./logs")
    args = parser.parse_args()
    main(args.data_dir, args.output_dir, args.log_dir)
