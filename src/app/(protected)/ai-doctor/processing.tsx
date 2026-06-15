import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { useAiDoctorUpload } from "@/features/ai-farm-doctor/state/useAiDoctorUpload";

export default function AiDoctorProcessing() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri?: string }>();
  const uri = params.uri ?? "";

  const { stage, progress, error, result, upload } = useAiDoctorUpload();
  useEffect(() => {
    if (!uri) return;

    upload({ imageUri: uri }).then((r) => {
      if (r.result) {
        router.replace({
          pathname: "/ai-doctor/result",
          params: {
            result: JSON.stringify(r.result),
          },
        });
      }
    });
  }, [uri, upload, router]);


  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Processing</ThemedText>
      <ThemedText themeColor="textSecondary">
        {error ? "An error occurred" : `Stage: ${stage}`}
      </ThemedText>

      <View style={{ height: 18 }} />

      <View style={styles.progressBarOuter}>
        <View style={[styles.progressBarInner, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <View style={{ height: 18 }} />

      {error ? (
        <>
          <ThemedText style={{ color: "#b00020" }} themeColor="textSecondary">
            {error}
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={() => router.replace("/ai-doctor/gallery")}>
            <ThemedText style={styles.buttonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <ThemedText themeColor="textSecondary">Please wait while we diagnose your crop…</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  progressBarOuter: {
    width: "100%",
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    backgroundColor: "#2e7d32",
    borderRadius: 999,
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

