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

    // Aadhaar Number
    const aadhaarMatch = fullText.match(/\d{4}\s?\d{4}\s?\d{4}/);
    if (aadhaarMatch)
      result.aadhaarNumber = aadhaarMatch[0].replace(/\s+/g, " ");

    // DOB
    const dobMatch = fullText.match(/\d{2}\/\d{2}\/\d{4}/);
    if (dobMatch) result.dob = dobMatch[0];

    // Gender
    if (/male/i.test(fullText)) result.gender = "Male";
    else if (/female/i.test(fullText)) result.gender = "Female";

    // Name (line before DOB on front side)
    const lines = frontText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
    const dobIndex = lines.findIndex((l) => /\d{2}\/\d{2}\/\d{4}/.test(l));
    if (dobIndex > 0) {
      let rawName = lines[dobIndex - 1];
      let cleanedName = rawName
        .replace(/[^a-zA-Z\s.]/g, "")
        .replace(/([a-z])([A-Z][a-z])/g, "$1 $2")
        .replace(/([A-Z]{2,})([A-Z][a-z])/g, "$1 $2")
        .replace(/(.)\1{2,}/g, "$1")
        .replace(/\s{2,}/g, " ")
        .trim();

      cleanedName = cleanedName
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      result.name = cleanedName;
    }

    // Address (back side)
    const addressMatch = backText.match(
      /Address[:\s]*(.+?)(?=\d{4}\s?\d{4}\s?\d{4}|help@uidai\.gov\.in|www\.uidai\.gov\.in)/is
    );
    if (addressMatch) {
      let cleaned = addressMatch[1]
        .replace(/[\|\=«»;:]/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/\n+/g, ", ")
        .replace(/,\s*,/g, ",")
        .replace(/\s+,/g, ",")
        .trim();

      const pinMatch = cleaned.match(/\b\d{6}\b/);
      if (pinMatch) {
        const pinIndex = cleaned.indexOf(pinMatch[0]);
        cleaned = cleaned.substring(0, pinIndex + 6).trim();
      }

      cleaned = cleaned
        .replace(/\bne\s?\d?\b/gi, "Near")
        .replace(/\bT\s?P\s?/gi, "TP ")
        .replace(/\ba Gin gates\b/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();

      result.address = cleaned;
    }

    // ✅ Validation: throw error if any key field is missing
    const missingFields: string[] = [];
    if (!result.aadhaarNumber) missingFields.push("Aadhaar Number");
    if (!result.name) missingFields.push("Name");
    if (!result.dob) missingFields.push("DOB");
    if (!result.gender) missingFields.push("Gender");
    if (!result.address) missingFields.push("Address");

    if (missingFields.length > 0) {
      throw new Error(
        `Incomplete Aadhaar data detected (${missingFields.join(
          ", "
        )}). Please provide proper Aadhaar card images.`
      );
    }

    return result;
  }
}
