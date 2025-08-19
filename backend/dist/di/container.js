"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/di/container.ts
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const OcrController_1 = require("../controllers/OcrController");
const OcrService_1 = require("../services/OcrService");
const ocrRepository_1 = require("../repositories/ocrRepository");
const container = new inversify_1.Container();
// Bind Controller
container.bind(types_1.TYPES.OcrController).to(OcrController_1.OcrController);
// Bind Service
container.bind(types_1.TYPES.OcrService).to(OcrService_1.OcrService);
// Bind Repository
container.bind(types_1.TYPES.OcrRepository).to(ocrRepository_1.OcrRepository);
exports.default = container;
//# sourceMappingURL=container.js.map