// src/repositories/IOcrRepository.ts
export interface IOcrRepository {
  extractText(buffer: Buffer): Promise<string>;
}
