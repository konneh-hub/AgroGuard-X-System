import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import type { DiagnosisResult } from "../types/analysis";

export function DiagnosisResultCard({ result }: { result: DiagnosisResult }) {
  return (
    <View style={styles.card}>
      <ThemedText type="subtitle">{result.issueName}</ThemedText>
      <ThemedText themeColor="textSecondary">
        Issue Type: {result.issueType}
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        Confidence: {(result.confidenceScore * 100).toFixed(1)}%
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        Severity: {result.severityLevel}
      </ThemedText>

      <View style={{ height: 12 }} />

      <ThemedText type="subtitle">Recommended Treatment</ThemedText>
      <ThemedText>{result.recommendedTreatment}</ThemedText>

      <View style={{ height: 12 }} />

      <ThemedText type="subtitle">Prevention Tips</ThemedText>
      {result.preventionTips.map((t, idx) => (
        <ThemedText key={idx} themeColor="textSecondary">
          • {t}
        </ThemedText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: "rgba(46,125,50,0.08)",
    gap: 6,
  },
});
