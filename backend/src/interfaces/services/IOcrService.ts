import { OcrResultDTO } from "../../dtos/OcrDTO";

export interface IOcrService {
  preprocess(buffer: Buffer): Promise<Buffer>;
  process(frontBuffer: Buffer, backBuffer: Buffer): Promise<OcrResultDTO>;
}
