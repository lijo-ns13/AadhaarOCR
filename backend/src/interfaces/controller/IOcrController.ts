import { Request, Response } from "express";

export interface IOcrController {
  generateOCRData(req: Request, res: Response): Promise<void>;
}
