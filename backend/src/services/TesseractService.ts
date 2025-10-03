import { injectable } from "inversify";
import Tesseract from "tesseract.js";
import { ITesseractService } from "../interfaces/services/ITesseractService";

@injectable()
export class TesseractService implements ITesseractService {
  constructor() {}
  async extractText(buffer: Buffer): Promise<string> {
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");
    return text;
  }
}
