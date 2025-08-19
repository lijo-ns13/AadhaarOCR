"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAadhaarFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const types_1 = require("../di/types");
const container_1 = __importDefault(require("../di/container"));
const storage = multer_1.default.memoryStorage(); // Suitable for cloud uploads like S3
const ocrController = container_1.default.get(types_1.TYPES.OcrController);
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
exports.uploadAadhaarFiles = upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
]);
router.post("/ocr", exports.uploadAadhaarFiles, ocrController.generateOCRData.bind(ocrController));
exports.default = router;
//# sourceMappingURL=ocr.routes.js.map