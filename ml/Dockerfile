# Uses TensorFlow's official GPU image. If your machine has no NVIDIA GPU / drivers,
# swap the base image for "tensorflow/tensorflow:2.16.1" (CPU-only) instead —
# training will simply be slower.
FROM tensorflow/tensorflow:2.16.1-gpu

WORKDIR /workspace

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "train.py"]
