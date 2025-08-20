import { useState, useRef } from "react";
import { OcrGenerate, type OcrResponse } from "./services/OcrService";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
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
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [data, setData] = useState<OcrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ copy feedback
  const [copied, setCopied] = useState<string | null>(null);

  const handleFileSelect = (file: File, type: "front" | "back") => {
    setCurrentFile(file);
    setCroppingFile(type);
  };

  const handleCropComplete = async () => {
    if (
      !imgRef.current ||
      !completedCrop?.width ||
      !completedCrop?.height ||
      !croppingFile ||
      !currentFile
    )
      return;

    try {
      const croppedFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        `${croppingFile}.jpg`
      );
      if (croppingFile === "front") setFrontFile(croppedFile);
      else setBackFile(croppedFile);
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
      setError("Please select and crop both front and back images");
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Aadhaar OCR Generator
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        {/* File Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Upload Front Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileSelect(e.target.files[0], "front")
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            {frontFile && (
              <p className="text-green-600 text-sm mt-2">
                ✅ Front image cropped
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Upload Back Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileSelect(e.target.files[0], "back")
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
            />
            {backFile && (
              <p className="text-green-600 text-sm mt-2">
                ✅ Back image cropped
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading || !frontFile || !backFile}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-500"
          >
            Reset
          </button>
        </div>

        {/* Crop Modal */}
        {croppingFile && currentFile && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl shadow-lg max-w-lg w-full">
              <h2 className="text-lg font-semibold mb-3 text-center">
                Crop {croppingFile === "front" ? "Front" : "Back"} Image
              </h2>
              <div className="max-h-[70vh] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    src={URL.createObjectURL(currentFile)}
                    alt="Crop preview"
                    style={{ maxWidth: "100%" }}
                  />
                </ReactCrop>
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setCroppingFile(null);
                    setCurrentFile(null);
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded hover:opacity-90"
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* OCR Results */}
        {data && (
          <div className="mt-8 p-5 bg-gray-50 rounded-xl shadow-inner">
            <h2 className="text-xl font-semibold text-center mb-5 text-gray-800">
              OCR Result
            </h2>
            <div className="space-y-3">
              {Object.entries(data)
                .filter(([key]) => key !== "rawText")
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center bg-white rounded-md px-3 py-2 shadow-sm"
                  >
                    <p className="text-gray-700">
                      <strong className="capitalize">{key}:</strong> {value}
                    </p>
                    <button
                      onClick={() => handleCopy(String(value), key)}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {copied === key ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleCopy(JSON.stringify(data, null, 2), "all")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:opacity-90"
              >
                {copied === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
