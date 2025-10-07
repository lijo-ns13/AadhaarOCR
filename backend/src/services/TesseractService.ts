import { injectable } from "inversify";
import Tesseract from "tesseract.js";
import { ITesseractService } from "../interfaces/services/ITesseractService";

@injectable()
export class TesseractService implements ITesseractService {
  async extractText(buffer: Buffer): Promise<string> {
    const { data } = await Tesseract.recognize(buffer, "eng", {
      logger: (m) => console.log(m), // optional: shows OCR progress
    });

    return data.text
      .replace(/\r\n|\r/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }
}
