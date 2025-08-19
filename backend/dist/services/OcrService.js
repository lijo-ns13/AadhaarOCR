"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
let OcrService = class OcrService {
    ocrRepository;
    constructor(ocrRepository) {
        this.ocrRepository = ocrRepository;
    }
    async process(frontBuffer, backBuffer) {
        const frontText = await this.ocrRepository.extractText(frontBuffer);
        const backText = await this.ocrRepository.extractText(backBuffer);
        const fullText = `${frontText}\n${backText}`;
        const result = {
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
        if (dobMatch)
            result.dob = dobMatch[0];
        // Gender
        if (/male/i.test(fullText))
            result.gender = "Male";
        else if (/female/i.test(fullText))
            result.gender = "Female";
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
        const addressMatch = backText.match(/Address[:\s]*(.+?)(?=\d{4}\s?\d{4}\s?\d{4}|help@uidai\.gov\.in|www\.uidai\.gov\.in)/is);
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
        const missingFields = [];
        if (!result.aadhaarNumber)
            missingFields.push("Aadhaar Number");
        if (!result.name)
            missingFields.push("Name");
        if (!result.dob)
            missingFields.push("DOB");
        if (!result.gender)
            missingFields.push("Gender");
        if (!result.address)
            missingFields.push("Address");
        if (missingFields.length > 0) {
            throw new Error(`Incomplete Aadhaar data detected (${missingFields.join(", ")}). Please provide proper Aadhaar card images.`);
        }
        return result;
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.OcrRepository)),
    __metadata("design:paramtypes", [Object])
], OcrService);
//# sourceMappingURL=OcrService.js.map