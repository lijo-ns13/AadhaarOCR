import { useState, useRef } from "react";
import { OcrGenerate, type OcrResponse } from "./services/OcrService";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "./utils/cavasPreview";

export default function App() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [croppingFile, setCroppingFile] = useState<"front" | "back" | null>(
    null
  );
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 30,
    height: 30,
    x: 0,
    y: 0,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [data, setData] = useState<OcrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // when user selects file → open crop modal
  const handleFileSelect = (file: File, type: "front" | "back") => {
    setCurrentFile(file);
    setCroppingFile(type);
  };

  const handleCropComplete = async () => {
    if (
      !imgRef.current ||
      !crop.width ||
      !crop.height ||
      !croppingFile ||
      !currentFile
    )
      return;

    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        {
          x: crop.x ?? 0,
          y: crop.y ?? 0,
          width: crop.width,
          height: crop.height,
        },
        `${croppingFile}.jpg`
      );

      if (croppingFile === "front") {
        setFrontFile(croppedFile);
      } else {
        setBackFile(croppedFile);
      }
    } catch (err) {
      setError("Failed to crop image");
      console.error(err);
    } finally {
      setCroppingFile(null);
      setCurrentFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!frontFile || !backFile) {
      setError("Please select both front and back images");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("front", frontFile);
    formData.append("back", backFile);

    try {
      const res = await OcrGenerate(formData);
      setData(res);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFrontFile(null);
    setBackFile(null);
    setData(null);
    setError(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-xl font-bold mb-4">Aadhaar OCR Generator</h1>

      <div className="mb-4">
        <label className="block mb-2">
          Front Image:
          {frontFile && (
            <div className="mt-1 text-sm text-green-600">Image selected</div>
          )}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0], "front")
          }
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Back Image:
          {backFile && (
            <div className="mt-1 text-sm text-green-600">Image selected</div>
          )}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleFileSelect(e.target.files[0], "back")
          }
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {/* Cropper Modal */}
      {croppingFile && currentFile && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md max-w-lg w-full">
            <h2 className="text-lg font-semibold mb-2">
              Crop {croppingFile === "front" ? "Front" : "Back"} Image
            </h2>
            <div className="max-h-[70vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={URL.createObjectURL(currentFile)}
                  alt="Crop preview"
                  style={{ maxWidth: "100%" }}
                />
              </ReactCrop>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => {
                  setCroppingFile(null);
                  setCurrentFile(null);
                }}
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !frontFile || !backFile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p>
            <strong>DOB:</strong> {data.dob}
          </p>
          <p>
            <strong>Aadhaar Number:</strong> {data.aadhaarNumber}
          </p>
          <p>
            <strong>Gender:</strong> {data.gender}
          </p>
          <p>
            <strong>Address:</strong> {data.address}
          </p>
        </div>
      )}
    </div>
  );
}
