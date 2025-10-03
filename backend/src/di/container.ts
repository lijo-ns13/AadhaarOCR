import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import { IOcrController } from "../interfaces/controller/IOcrController";
import { OcrController } from "../controllers/OcrController";
import { OcrService } from "../services/OcrService";
import { IOcrService } from "../interfaces/services/IOcrService";
import { TesseractService } from "../services/TesseractService";
import { ITesseractService } from "../interfaces/services/ITesseractService";

const container = new Container();

container.bind<IOcrController>(TYPES.OcrController).to(OcrController);

container.bind<IOcrService>(TYPES.OcrService).to(OcrService);

container.bind<ITesseractService>(TYPES.TesseractService).to(TesseractService);

export default container;
