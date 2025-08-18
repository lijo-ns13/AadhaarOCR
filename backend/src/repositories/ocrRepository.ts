// src/repositories/OcrRepository.ts
import Tesseract from "tesseract.js";
import { IOcrRepository } from "../interfaces/repositories/IOcrRepository";

export class OcrRepository implements IOcrRepository {
  async extractText(buffer: Buffer): Promise<string> {
    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");
    return text;
  }
}
