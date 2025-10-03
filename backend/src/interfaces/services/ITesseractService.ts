export interface ITesseractService {
  extractText(buffer: Buffer): Promise<string>;
}
