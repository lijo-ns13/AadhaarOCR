import { OcrResultDTO } from "../../dtos/OcrDTO";

export interface IOcrService {
  process(frontBuffer: Buffer, backBuffer: Buffer): Promise<OcrResultDTO>;
}
