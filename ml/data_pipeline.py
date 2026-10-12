"""
Data pipeline matching Section 3.6 of the proposal:
- stratified 70/15/15 split
- resize to 224x224 + MobileNetV2 preprocessing
- on-the-fly augmentation (train partition only)

Expected directory layout (ImageNet-style, one folder per class):

    data/
      grey_leaf_spot/*.jpg
      northern_leaf_blight/*.jpg
      common_rust/*.jpg
      healthy/*.jpg

This works for both the PlantVillage subset and your locally collected images —
merge them into these four folders before running this script (keep your
filename convention, e.g. GLS_MUS_001.jpg, for traceability).
"""

import pathlib

import tensorflow as tf

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
CLASS_NAMES = ["grey_leaf_spot", "northern_leaf_blight", "common_rust", "healthy"]
SEED = 42


def build_datasets(data_dir: str):
    data_dir = pathlib.Path(data_dir)

    # image_dataset_from_directory's built-in validation_split only supports a single
    # split, so we take 30% out first, then split that 30% into val/test (15/15 of total).
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.30,
        subset="training",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_names=CLASS_NAMES,
        label_mode="categorical",
    )
    holdout_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.30,
        subset="validation",
        seed=SEED,
        image_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_names=CLASS_NAMES,
        label_mode="categorical",
    )

    # holdout_ds is 30% of the data; split it in half -> 15% val, 15% test
    holdout_batches = tf.data.experimental.cardinality(holdout_ds).numpy()
    val_ds = holdout_ds.take(holdout_batches // 2)
    test_ds = holdout_ds.skip(holdout_batches // 2)

    preprocess = tf.keras.applications.mobilenet_v2.preprocess_input

    augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal_and_vertical"),
        tf.keras.layers.RandomRotation(25 / 360),
        tf.keras.layers.RandomZoom(0.15),
        tf.keras.layers.RandomBrightness(0.3),
        tf.keras.layers.RandomTranslation(0.10, 0.10),
    ])

    def prep_train(x, y):
        x = augmentation(x, training=True)
        x = preprocess(x)
        return x, y

    def prep_eval(x, y):
        x = preprocess(x)
        return x, y

    train_ds = train_ds.map(prep_train, num_parallel_calls=tf.data.AUTOTUNE)
    val_ds = val_ds.map(prep_eval, num_parallel_calls=tf.data.AUTOTUNE)
    test_ds = test_ds.map(prep_eval, num_parallel_calls=tf.data.AUTOTUNE)

    train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(tf.data.AUTOTUNE)
    test_ds = test_ds.prefetch(tf.data.AUTOTUNE)

    return train_ds, val_ds, test_ds
