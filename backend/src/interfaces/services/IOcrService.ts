import { OcrResultDTO } from "../dtos/OcrDTO";

export interface IOcrService {
  process(
    frontImage: Express.Multer.File,
    backImage: Express.Multer.File
  ): Promise<OcrResultDTO>;
}
