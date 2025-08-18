// src/di/container.ts
import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import { IOcrController } from "../interfaces/controller/IOcrController";
import { OcrController } from "../controllers/OcrController";
import { OcrService } from "../services/OcrService";
import { OcrRepository } from "../repositories/ocrRepository";
import { IOcrRepository } from "../interfaces/repositories/IOcrRepository";
import { IOcrService } from "../interfaces/services/IOcrService";

const container = new Container();

// Bind Controller
container.bind<IOcrController>(TYPES.OcrController).to(OcrController);

// Bind Service
container.bind<IOcrService>(TYPES.OcrService).to(OcrService);

// Bind Repository
container.bind<IOcrRepository>(TYPES.OcrRepository).to(OcrRepository);

export default container;
