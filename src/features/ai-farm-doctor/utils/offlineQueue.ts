import type { DiagnosisInput } from "../types/analysis";

export type AiDoctorQueueItemStatus = "queued" | "processing" | "failed" | "done";

export type AiDoctorQueueItem = {
  id: string;
  createdAt: string; // ISO
  updatedAt?: string;
  status: AiDoctorQueueItemStatus;
  attempts: number;
  lastError?: string;
  // Store minimal data to re-run analysis offline.
  payload: DiagnosisInput;
};

