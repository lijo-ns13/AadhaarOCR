import AadhaarUpload from "../components/AadhaarUpload";

export default function AadhaarPage() {
  const handleUpload = async (frontFile: File, backFile: File) => {
    const formData = new FormData();
    formData.append("aadhaarFront", frontFile);
    formData.append("aadhaarBack", backFile);

    try {
      const res = await fetch("http://localhost:5000/upload-aadhaar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Server response:", data);
      alert("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AadhaarUpload onSubmit={handleUpload} />
    </div>
  );
}
