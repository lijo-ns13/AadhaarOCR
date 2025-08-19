import { Request } from "express";
import { File } from "multer";

type AadhaarFiles = {
  front?: File[];
  back?: File[];
};

export type AadhaarFilesRequest = Request & {
  files?: AadhaarFiles;
};
