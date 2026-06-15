import type { CropIssueType, DiagnosisResult } from "../types/analysis";

// Expected AI API output is intentionally flexible for Stage 3.
// We normalize into a single domain result.
export type AiDoctorApiResponse = {
  issueType?: string;
  issueName?: string;
  confidence?: number; // 0..1
  confidenceScore?: number;
  severity?: string;
  recommendedTreatment?: string;
  preventionTips?: string[];
};

function normalizeIssueType(v?: string): CropIssueType {
  const s = (v ?? "").toLowerCase();
  if (s.includes("disease")) return "disease";
  if (s.includes("nutrient")) return "nutrient_deficiency";
  if (s.includes("water")) return "water_stress";
  if (s.includes("pest")) return "pest_damage";
  return "disease";
}

function normalizeSeverity(
  v?: string,
  confidence?: number,
): DiagnosisResult["severityLevel"] {
  const s = (v ?? "").toLowerCase();
  if (s.includes("high")) return "high";
  if (s.includes("medium")) return "medium";
  if (s.includes("low")) return "low";
  if (typeof confidence === "number") {
    if (confidence >= 0.75) return "high";
    if (confidence >= 0.45) return "medium";
  }
  return "low";
}

export function parseAiDoctorResponse(
  res: AiDoctorApiResponse,
): DiagnosisResult {
  const confidenceScore =
    typeof res.confidenceScore === "number"
      ? res.confidenceScore
      : typeof res.confidence === "number"
        ? res.confidence
        : 0.5;

  const issueType = normalizeIssueType(res.issueType);

  const issueName = res.issueName ?? "Unknown crop issue";

  const severityLevel = normalizeSeverity(res.severity, confidenceScore);

  const recommendedTreatment =
    res.recommendedTreatment ??
    "Follow local agronomy best practices and consider a targeted treatment based on lab/field verification.";

  const preventionTips = Array.isArray(res.preventionTips)
    ? res.preventionTips
    : [
        "Use crop rotation and maintain field hygiene.",
        "Monitor the crop regularly for early symptoms.",
      ];

  return {
    issueType,
    issueName,
    confidenceScore: Math.max(0, Math.min(1, confidenceScore)),
    severityLevel,
    recommendedTreatment,
    preventionTips,
  };
}
