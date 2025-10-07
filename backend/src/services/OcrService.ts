import { injectable, inject } from "inversify";
import { TYPES } from "../di/types";
import { IOcrService } from "../interfaces/services/IOcrService";
import { OcrResultDTO } from "../dtos/OcrDTO";
import { ITesseractService } from "../interfaces/services/ITesseractService";
import sharp from "sharp";

@injectable()
export class OcrService implements IOcrService {
  constructor(
    @inject(TYPES.TesseractService)
    private readonly _tesseractService: ITesseractService
  ) {}

  async preprocess(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .grayscale()
      .normalize() // improves contrast
      .threshold(150) // makes text sharper
      .toBuffer();
  }
  async process(
    frontBuffer: Buffer,
    backBuffer: Buffer
  ): Promise<OcrResultDTO> {
    // Extract raw text
    const frontText = await this._tesseractService.extractText(
      await this.preprocess(frontBuffer)
    );
    const backText = await this._tesseractService.extractText(
      await this.preprocess(backBuffer)
    );

    console.log("frontxt", frontText, "backtext", backText);
    // Aadhaar number regex
    const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    const frontAadhaar = frontText
      .match(aadhaarRegex)?.[0]
      ?.replace(/\s+/g, " ");
    const backAadhaar = backText.match(aadhaarRegex)?.[0]?.replace(/\s+/g, " ");
    console.log("aaahdrfront", frontAadhaar, "back", backAadhaar);
    if (!frontAadhaar || !backAadhaar || frontAadhaar !== backAadhaar) {
      throw new Error(
        "Aadhaar numbers do not match or not found on both sides."
      );
    }

    const fullText = frontText + "\n" + backText;

    const result: OcrResultDTO = {
      aadhaarNumber: frontAadhaar,
      name: null,
      dob: null,
      gender: null,
      address: null,
      rawText: fullText,
    };

    // Extract DOB
    const dobMatch = frontText.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
    if (dobMatch) result.dob = dobMatch[0];

    // Extract Gender
    if (/\bfemale\b/i.test(frontText)) result.gender = "Female";
    else if (/\bmale\b/i.test(frontText)) result.gender = "Male";

    // Extract Name (line before DOB or line with all uppercase letters)
    const lines = frontText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    let nameCandidate = "";
    if (dobMatch) {
      const dobIndex = lines.findIndex((l) => l.includes(result.dob!));
      if (dobIndex > 0) nameCandidate = lines[dobIndex - 1];
    }

    // Fallback: look for line with uppercase letters and letters only
    if (!nameCandidate) {
      const upperLines = lines.filter(
        (l) => /^[A-Z\s.]+$/.test(l) && l.length > 2
      );
      if (upperLines.length) nameCandidate = upperLines[0];
    }

    // Clean name
    if (nameCandidate) {
      result.name = nameCandidate
        .replace(/[^a-zA-Z\s.]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Extract Address from back side
    const addrMatch = backText.match(
      /Address[:\s]*(.+?)(?=\d{4}\s?\d{4}\s?\d{4}|help@uidai\.gov\.in|www\.uidai\.gov\.in)/is
    );
    if (addrMatch) {
      let addr = addrMatch[1]
        .replace(/[\|\=«»;:]/g, " ")
        .replace(/\s{2,}/g, " ")
        .replace(/\n+/g, ", ")
        .replace(/,\s*,/g, ",")
        .trim();

      // Keep pin code in address
      const pinMatch = addr.match(/\b\d{6}\b/);
      if (pinMatch) {
        const pinIndex = addr.indexOf(pinMatch[0]);
        addr = addr.substring(0, pinIndex + 6).trim();
      }

      result.address = addr;
    }

    // Validation
    const missingFields: string[] = [];
    if (!result.name) missingFields.push("Name");
    if (!result.dob) missingFields.push("DOB");
    if (!result.gender) missingFields.push("Gender");
    if (!result.address) missingFields.push("Address");

    if (missingFields.length) {
      console.warn("OCR Warning: Missing fields", missingFields.join(", "));
    }

    return result;
  }
}
