import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Section } from "@/features/ai-farm-doctor/components/Section";
import type { DiagnosisResult } from "@/features/ai-farm-doctor/types/analysis";

export default function AiDoctorRecommendation() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result?: string }>();

  const result = useMemo<DiagnosisResult | null>(() => {
    try {
      if (!params.result) return null;
      return JSON.parse(params.result) as DiagnosisResult;
    } catch {
      return null;
    }
  }, [params.result]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Recommendation</ThemedText>

      {result ? (
        <>
          <Section title="Treatment">
            <ThemedText>{result.recommendedTreatment}</ThemedText>
          </Section>

          <View style={{ height: 14 }} />

          <Section title="Prevention Tips">
            {result.preventionTips.map((t, idx) => (
              <ThemedText key={idx} themeColor="textSecondary">
                • {t}
              </ThemedText>
            ))}
          </Section>

          <View style={{ height: 14 }} />

          <ThemedText themeColor="textSecondary">
            Tip: take another photo after treatment to track progress.
          </ThemedText>
        </>
      ) : (
        <ThemedText themeColor="textSecondary">
          No recommendation available.
        </ThemedText>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace({ pathname: "/ai-doctor/home" } as any)}
      >
        <ThemedText style={styles.buttonText}>Back Home</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
    borderWidth: 1,
    borderColor: "#1b5e20",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "900" },
});
