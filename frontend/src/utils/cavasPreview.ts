export async function getCroppedImg(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const pixelWidth = Math.floor(crop.width * scaleX);
  const pixelHeight = Math.floor(crop.height * scaleY);

  // High-DPI support
  const dpr = window.devicePixelRatio || 1;
  canvas.width = pixelWidth * dpr;
  canvas.height = pixelHeight * dpr;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale for high-DPI
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    pixelWidth,
    pixelHeight,
    0,
    0,
    pixelWidth,
    pixelHeight
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95
    );
  });
}
