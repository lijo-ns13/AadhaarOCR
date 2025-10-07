# 🪪 Aadhaar OCR Data Extractor (MERN + TypeScript)

A full-stack **MERN (MongoDB, Express, React, Node.js)** application for extracting and displaying **Aadhaar card details** from uploaded images using **OCR (Optical Character Recognition)** technology.

---

## 🚀 Features

- 🖼️ Upload Aadhaar front & back images  
- ✂️ Image cropping before OCR for better accuracy  
- 🤖 OCR text extraction (UUID, Name, DOB, Gender, Address, etc.)  
- ⚡ Fast processing using optimized OCR pipeline  
- 💾 Secure backend with Express + TypeScript  
- 🎨 Responsive React frontend with smooth user experience  
- ✅ Error handling & validation for image uploads  
- 📦 Ready-to-deploy structure for production

---

## 🧩 Tech Stack

### **Frontend**
- React (with TypeScript)
- React Image Crop (`react-image-crop`)
- Axios (for API calls)
]

### **Backend**
- Node.js + Express.js (TypeScript)
- Tesseract.js (OCR extraction)
- Multer (for file uploads)
- CORS, dotenv (for configuration)

---

## 📁 Project Structure

aadhar-ocr-extractor/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── types/
│ │ └── app.ts
│ ├── uploads/ # temporary file uploads
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── services/
│ │ ├── utils/
│ │ └── App.tsx
│ ├── public/
│ ├── package.json
│ └── tsconfig.json
│
└── README.md




---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/aadhar-ocr-extractor.git
cd aadhar-ocr-extractor


cd backend
npm install



cd ../frontend
npm install


.env
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

🧪 Running the App
Start backend server:
cd backend
npm run dev

Start frontend:
cd ../frontend
npm run dev


example response
{
  "success": true,
  "message": "OCR extraction successful",
  "data": {
    "aadhaarNumber": "1234 5678 9012",
    "name": "RAHUL KUMAR",
    "dob": "14/05/1997",
    "gender": "MALE",
    "address": "NEW DELHI, INDIA"
  }
}

