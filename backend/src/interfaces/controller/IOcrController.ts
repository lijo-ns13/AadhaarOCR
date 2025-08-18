// src/interfaces/IOcrController.ts
import { Response } from "express";
import { AadhaarFilesRequest } from "../../types/express";

export interface IOcrController {
  generateOCRData(req: AadhaarFilesRequest, res: Response): Promise<void>;
}
