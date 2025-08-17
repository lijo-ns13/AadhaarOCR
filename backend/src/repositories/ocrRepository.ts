import Tesseract from "tesseract.js";
import { IOcrRepository } from "./IOcrRepository";

export class OcrRepository implements IOcrRepository {
  async extractText(filePath: string): Promise<string> {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng");
    return text;
  }
}
