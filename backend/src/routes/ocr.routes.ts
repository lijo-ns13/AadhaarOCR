import multer from "multer";
import { Router } from "express";
import { IOcrController } from "../interfaces/controller/IOcrController";
import { TYPES } from "../di/types";
import container from "../di/container";
import { AadhaarFilesRequest } from "../types/express";

const storage = multer.memoryStorage(); // Suitable for cloud uploads like S3

const ocrController = container.get<IOcrController>(TYPES.OcrController);
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
export const uploadAadhaarFiles = upload.fields([
  { name: "front", maxCount: 1 },
  { name: "back", maxCount: 1 },
]);

router.post(
  "/ocr",
  uploadAadhaarFiles,
  ocrController.generateOCRData.bind(ocrController)
);

export default router;
