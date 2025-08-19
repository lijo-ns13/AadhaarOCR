import axios from "axios";
import { handleApiError } from "../types/apiError";
export interface OcrResponse {
  name: string;
  dob: string;
  aadhaarNumber: string;
  gender: string;
  address: string;
  rawText: string;
}
export const OcrGenerate = async (FormData: FormData): Promise<OcrResponse> => {
  try {
    const response = await axios.post(
      `https://aadhaarocr-33do.onrender.com/ocr`,
      FormData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "create-image");
  }
};
