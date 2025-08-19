import { useState } from "react";
import { OcrGenerate, type OcrResponse } from "./services/OcrService";

export default function App() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [data, setData] = useState<OcrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
        className="mb-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBackFile(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
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
