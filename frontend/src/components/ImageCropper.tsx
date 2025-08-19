import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel?: () => void;
}

// Convert crop pixels to actual cropped image
const getCroppedImg = (imageSrc: string, pixelCrop: Area) => {
  return new Promise<File>((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob((blob) => {
        if (blob)
          resolve(new File([blob], "cropped.png", { type: "image/png" }));
        else reject("Canvas is empty");
      }, "image/png");
    };
    image.onerror = reject;
  });
};

export default function ImageCropper({
  imageFile,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    const imageSrc = URL.createObjectURL(imageFile);
    const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedFile);
  };

  return (
    <div className="relative w-full h-80 bg-gray-200">
      <Cropper
        image={URL.createObjectURL(imageFile)}
        crop={crop}
        zoom={zoom}
        aspect={1.45}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteInternal}
      />
      <div className="absolute bottom-2 left-2 flex gap-2">
        <button
          onClick={handleCrop}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crop
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
