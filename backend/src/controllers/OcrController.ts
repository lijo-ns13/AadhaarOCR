import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IOcrController } from "../interfaces/IOcrController";
import { handleControllerError } from "../utils/errorHandler";
import { IOcrService } from "../services/IOcrService"; // service interface
import TYPES from "../constants/types";

@injectable()
export class OcrController implements IOcrController {
  constructor(
    @inject(TYPES.OcrService) private readonly ocrService: IOcrService
  ) {}

  async generateOCRData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.ocrService.process(req.file); // assuming multer upload
      res.status(200).json({
        success: true,
        message: "OCR data generated successfully",
        data: result,
      });
    } catch (error) {
      handleControllerError(res, error, "Failed to generate OCR data");
    }
  }
}
