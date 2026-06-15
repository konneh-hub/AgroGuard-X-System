import type { CropIssueType, DiagnosisResult } from "./analysis";

export type DiagnosisHistoryRecord = {
  id: string;
  createdAt: string; // ISO
  imageDataRef: {
    // For offline/local: store base64 (small demos) or a blob ref.
    base64: string;
    mimeType?: string;
    fileName?: string;
  };
  result: DiagnosisResult;
};

export type HistoryFilter = {
  issueType?: CropIssueType;
  limit?: number;
};
