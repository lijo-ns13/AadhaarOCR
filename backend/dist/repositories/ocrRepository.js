"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrRepository = void 0;
// src/repositories/OcrRepository.ts
const tesseract_js_1 = __importDefault(require("tesseract.js"));
class OcrRepository {
    async extractText(buffer) {
        const { data: { text }, } = await tesseract_js_1.default.recognize(buffer, "eng");
        return text;
    }
}
exports.OcrRepository = OcrRepository;
//# sourceMappingURL=ocrRepository.js.map