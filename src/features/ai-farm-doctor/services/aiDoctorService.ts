import type { DiagnosisInput, DiagnosisResult, ProcessingStage } from "../types/analysis";

import { compressImageToJpegBase64 } from "../utils/imageCompression";
import { diagnoseImage } from "../repository/aiDoctorRepository";

export type AiDoctorProgress = {
  stage: ProcessingStage;
  progress: number; // 0..1
  message?: string;
};

export type DiagnoseFromUriParams = {
  imageUri: string;
  fileName?: string;
  cropType?: string;
  locationHint?: string;
  onProgress?: (p: AiDoctorProgress) => void;
};

export async function diagnoseFromImageUri(
  params: DiagnoseFromUriParams,
): Promise<DiagnosisResult> {
  const { imageUri, fileName, cropType, locationHint, onProgress } = params;

  onProgress?.({ stage: "compressing", progress: 0.15, message: "Compressing image" });

  const compressed = await compressImageToJpegBase64({ uri: imageUri, fileName });

  onProgress?.({ stage: "uploading", progress: 0.35, message: "Preparing AI request" });

  const input: DiagnosisInput = {
    cropImageBase64: compressed.base64,
    fileName,
    mimeType: compressed.mimeType,
    cropType,
    locationHint,
  };

  onProgress?.({ stage: "analyzing", progress: 0.6, message: "Analyzing with AI" });

  const result = await diagnoseImage(input);

  onProgress?.({ stage: "complete", progress: 1, message: "Diagnosis complete" });

  return result;
}

