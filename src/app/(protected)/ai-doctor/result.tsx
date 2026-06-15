import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DiagnosisResultCard } from "@/features/ai-farm-doctor/components/DiagnosisResultCard";

import type { DiagnosisResult } from "@/features/ai-farm-doctor/types/analysis";

export default function AiDoctorResult() {
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
      <ThemedText type="title">Diagnosis Result</ThemedText>

      {result ? (
        <DiagnosisResultCard result={result} />
      ) : (
        <ThemedText themeColor="textSecondary">No result provided.</ThemedText>
      )}

      <View style={{ height: 12 }} />

      <TouchableOpacity
        style={styles.button}
        disabled={!result}
        onPress={() => router.push({ pathname: "/ai-doctor/recommendation", params: { result: params.result ?? "" } })}
      >
        <ThemedText style={styles.buttonText}>View Recommendation</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => router.push("/ai-doctor/history")}>
        <ThemedText style={styles.secondaryText}>Diagnosis History</ThemedText>
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
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
    borderWidth: 1,
    borderColor: "#1b5e20",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "900" },
  secondary: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  secondaryText: { fontWeight: "800" },
});

