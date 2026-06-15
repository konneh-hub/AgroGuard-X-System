export type CropIssueType =
  | "disease"
  | "nutrient_deficiency"
  | "water_stress"
  | "pest_damage";

export type DiagnosisInput = {
  cropImageBase64: string;
  fileName?: string;
  mimeType?: string;
  // Optional context for better accuracy.
  cropType?: string;
  locationHint?: string;
};

export type DiagnosisResult = {
  issueType: CropIssueType;
  issueName: string;
  confidenceScore: number; // 0..1
  severityLevel: "low" | "medium" | "high";
  recommendedTreatment: string;
  preventionTips: string[];
};

export type ProcessingStage =
  | "idle"
  | "compressing"
  | "uploading"
  | "analyzing"
  | "saving"
  | "complete"
  | "error";
