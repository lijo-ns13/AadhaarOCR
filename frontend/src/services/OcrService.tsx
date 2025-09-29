import { handleApiError } from "../types/apiError";
import apiClient from "../utils/axiosInstance";
import type { OcrResponse } from "../types/OcrReponse";

export const OcrGenerate = async (FormData: FormData): Promise<OcrResponse> => {
  try {
    const response = await apiClient.post("/ocr", FormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // const response = await axios.post(
    //   `https://aadhaarocr-33do.onrender.com/ocr`,
    //   FormData,
    //   {
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "create-image");
  }
};
