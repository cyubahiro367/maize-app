/*
  Object URLs (URL.createObjectURL) don't survive a page reload — the
  underlying blob is gone, so a saved history entry would show a broken
  image after the PWA restarts. Instead we downscale the photo into a
  small base64 JPEG thumbnail that's cheap enough to sit in localStorage
  alongside the rest of the history entry.
*/
export function fileToThumbnail(file, maxDimension = 96, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image for thumbnail"));
    };

    img.src = objectUrl;
  });
}
