// src/controllers/OcrController.ts
import { injectable, inject } from "inversify";
import { Response } from "express";

import { handleControllerError } from "../utils/errorHandler";

import { TYPES } from "../di/types";
import { AadhaarFilesRequest } from "../types/express";
import { IOcrService } from "../interfaces/services/IOcrService";
import { IOcrController } from "../interfaces/controller/IOcrController";

@injectable()
export class OcrController implements IOcrController {
  constructor(
    @inject(TYPES.OcrService) private readonly ocrService: IOcrService
  ) {}

  async generateOCRData(
    req: AadhaarFilesRequest,
    res: Response
  ): Promise<void> {
    try {
      const frontFile = req.files?.front?.[0];
      const backFile = req.files?.back?.[0];

      if (!frontFile || !backFile) {
        res.status(400).json({
          success: false,
          message: "Both front and back Aadhaar images are required",
        });
        return;
      }

      const result = await this.ocrService.process(
        frontFile.buffer,
        backFile.buffer
      );

      res.status(200).json({
        success: true,
        message: "OCR data extracted successfully",
        data: result,
      });
    } catch (error: any) {
      // handleControllerError(res, error, "Failed to generate OCR data");
      res.status(400).json({
        success: false,
        message: error.message || "Failed to generate OCR data",
      });
    }
  }
}
