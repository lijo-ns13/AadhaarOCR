import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // We'll create this helper

interface AadhaarUploadProps {
  onSubmit: (frontFile: File, backFile: File) => void;
}

export default function AadhaarUpload({ onSubmit }: AadhaarUploadProps) {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppingSide, setCroppingSide] = useState<"front" | "back" | null>(
    null
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      if (side === "front") {
        setFrontFile(file);
        setFrontPreview(url);
        setCroppingSide("front");
      } else {
        setBackFile(file);
        setBackPreview(url);
        setCroppingSide("back");
      }
    }
  };

  const handleCropSave = async () => {
    if (!croppingSide || !croppedAreaPixels) return;

    const imageSrc = croppingSide === "front" ? frontPreview : backPreview;
    if (!imageSrc) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], `${croppingSide}.jpg`, {
      type: "image/jpeg",
    });

    if (croppingSide === "front") {
      setFrontFile(croppedFile);
      setFrontPreview(URL.createObjectURL(croppedFile));
    } else {
      setBackFile(croppedFile);
      setBackPreview(URL.createObjectURL(croppedFile));
    }

    setCroppingSide(null); // Exit crop mode
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !backFile) {
      alert("Please upload both sides");
      return;
    }
    onSubmit(frontFile, backFile);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Upload Aadhaar
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Front Side</label>
          {frontPreview && (
            <img
              src={frontPreview}
              alt="Front Preview"
              className="mb-2 w-full rounded border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "front")}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Back Side</label>
          {backPreview && (
            <img
              src={backPreview}
              alt="Back Preview"
              className="mb-2 w-full rounded border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "back")}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Crop Modal */}
      {croppingSide && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-2xl">
            <div className="relative w-full h-96 bg-black">
              <Cropper
                image={croppingSide === "front" ? frontPreview! : backPreview!}
                crop={crop}
                zoom={zoom}
                aspect={3 / 2}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCroppingSide(null)}
                className="bg-gray-400 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="bg-blue-600 px-4 py-2 rounded text-white"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
