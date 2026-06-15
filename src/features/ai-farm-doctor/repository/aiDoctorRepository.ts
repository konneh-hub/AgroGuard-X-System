import axios from "axios";

import type { DiagnosisInput, DiagnosisResult } from "../types/analysis";
import { parseAiDoctorResponse } from "../utils/resultParser";

const DEFAULT_ENDPOINT = "https://example.com/diagnose";

export type DiagnoseRequest = DiagnosisInput;

export async function diagnoseImage(
  req: DiagnoseRequest,
): Promise<DiagnosisResult> {
  const endpoint =
    (process as any)?.env?.EXPO_PUBLIC_AI_DOCTOR_ENDPOINT ?? DEFAULT_ENDPOINT;

  // Stage 3: send base64 directly. Backend can adapt.
  const payload = {
    image_base64: req.cropImageBase64,
    file_name: req.fileName,
    mime_type: req.mimeType,
    crop_type: req.cropType,
    location_hint: req.locationHint,
  };

  const resp = await axios.post(endpoint, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 60000,
  });

  // Accept either { data: ... } or direct object.
  const data = resp?.data?.data ?? resp?.data;

  return parseAiDoctorResponse(data as any);
}
