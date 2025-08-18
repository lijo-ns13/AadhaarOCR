import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IOcrRepository } from "../interfaces/repositories/IOcrRepository";
import { IOcrService } from "../interfaces/services/IOcrService";
import { OcrResultDTO } from "../dtos/OcrDTO";

@injectable()
export class OcrService implements IOcrService {
  constructor(
    @inject(TYPES.OcrRepository) private readonly ocrRepository: IOcrRepository
  ) {}

  async process(
    frontBuffer: Buffer,
    backBuffer: Buffer
  ): Promise<OcrResultDTO> {
    const frontText = await this.ocrRepository.extractText(frontBuffer);
    const backText = await this.ocrRepository.extractText(backBuffer);

    const fullText = `${frontText}\n${backText}`;
    const result: OcrResultDTO = {
      name: null,
      dob: null,
      aadhaarNumber: null,
      gender: null,
      address: null,
      rawText: fullText,
    };

    // ✅ Aadhaar Number (Full, normalized)
    const aadhaarMatch = fullText.match(/\d{4}\s?\d{4}\s?\d{4}/);
    if (aadhaarMatch) {
      result.aadhaarNumber = aadhaarMatch[0].replace(/\s+/g, " ");
    }

    // ✅ DOB
    const dobMatch = fullText.match(/\d{2}\/\d{2}\/\d{4}/);
    if (dobMatch) {
      result.dob = dobMatch[0];
    }

    // ✅ Gender
    if (/male/i.test(fullText)) {
      result.gender = "Male";
    } else if (/female/i.test(fullText)) {
      result.gender = "Female";
    }

    // ✅ Name (take line before DOB on front side)
    const lines = frontText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 2);

    const dobIndex = lines.findIndex((l) => /\d{2}\/\d{2}\/\d{4}/.test(l));
    // ✅ Name (take line before DOB on front side)
    if (dobIndex > 0) {
      let rawName = lines[dobIndex - 1];

      let cleanedName = rawName
        .replace(/[^a-zA-Z\s.]/g, "") // remove junk
        .replace(/([a-z])([A-Z][a-z])/g, "$1 $2") // split when Capital followed by lowercase (word start)
        .replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2") // split big blocks of caps
        .replace(/(.)\1{2,}/g, "$1") // collapse repeated chars
        .replace(/\s{2,}/g, " ") // trim extra spaces
        .trim();

      // Convert to Title Case
      cleanedName = cleanedName
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      result.name = cleanedName;
    }

    // ✅ Address extraction (back side)
    const addressMatch = backText.match(
      /Address[:\s]*(.+?)(?=\d{4}\s?\d{4}\s?\d{4}|help@uidai\.gov\.in|www\.uidai\.gov\.in)/is
    );

    if (addressMatch) {
      let cleaned = addressMatch[1]
        .replace(/[\|\=«»;:]/g, " ") // remove junk symbols
        .replace(/\s{2,}/g, " ") // collapse multiple spaces
        .replace(/\n+/g, ", ") // newlines → commas
        .replace(/,\s*,/g, ",") // fix double commas
        .replace(/\s+,/g, ",") // trim space before commas
        .trim();

      // ✅ Stop at first valid 6-digit PINCODE
      const pinMatch = cleaned.match(/\b\d{6}\b/);
      if (pinMatch) {
        const pinIndex = cleaned.indexOf(pinMatch[0]);
        cleaned = cleaned.substring(0, pinIndex + 6).trim();
      }

      // ✅ Fix common OCR mistakes
      cleaned = cleaned
        .replace(/\bne\s?\d?\b/gi, "Near")
        .replace(/\bT\s?P\s?/gi, "TP ")
        .replace(/\ba Gin gates\b/gi, "")
        .replace(/\s{2,}/g, " ") // clean extra spaces again
        .trim();

      result.address = cleaned;
    }

    // ✅ Validation
    if (!result.aadhaarNumber) {
      throw new Error("Uploaded document is not a valid Aadhaar card");
    }

    return result;
  }
}
