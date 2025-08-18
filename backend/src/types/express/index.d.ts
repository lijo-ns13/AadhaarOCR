// src/types/express/index.d.ts
import { Request } from "express";
import { File } from "multer";

export interface MulterFile extends File {
  buffer: Buffer; // since memoryStorage
}

export interface AadhaarFilesRequest extends Request {
  files?: {
    front?: Express.Multer.File[];
    back?: Express.Multer.File[];
  };
}
