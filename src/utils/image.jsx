// utils/image.js
export function compressImageToBase64(file, maxWidth = 360, quality = 0.25) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // 🔹 Hitung scale sesuai maxWidth
        const scale = Math.min(maxWidth / img.width, 1);
        const canvasWidth = img.width * scale;
        const canvasHeight = img.height * scale;

        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "low";

        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

        // 🔹 Convert ke Blob untuk Base64 lebih kecil
        canvas.toBlob(
          (blob) => {
            const reader2 = new FileReader();
            reader2.onloadend = () => resolve(reader2.result);
            reader2.readAsDataURL(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
