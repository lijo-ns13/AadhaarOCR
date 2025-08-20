export async function getCroppedImg(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  fileName: string
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // ✅ Use scaled width/height (important!)
  const pixelWidth = Math.floor(crop.width * scaleX);
  const pixelHeight = Math.floor(crop.height * scaleY);

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.drawImage(
    image,
    crop.x * scaleX, // start x
    crop.y * scaleY, // start y
    pixelWidth, // source width
    pixelHeight, // source height
    0,
    0,
    pixelWidth, // destination width
    pixelHeight // destination height
  );

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.95
    ); // use 95% quality
  });
}
