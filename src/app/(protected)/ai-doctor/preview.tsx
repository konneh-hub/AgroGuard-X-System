import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AiDoctorPreview() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri?: string }>();
  const uri = params.uri ?? "";

  const canProceed = useMemo(() => uri.length > 0, [uri]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Image Preview</ThemedText>
      <ThemedText themeColor="textSecondary">Confirm the photo before analysis.</ThemedText>

      <View style={{ height: 16 }} />

      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      ) : (
        <ThemedText themeColor="textSecondary">Missing image uri</ThemedText>
      )}

      <View style={{ height: 16 }} />

      <TouchableOpacity
        style={[styles.button, !canProceed ? { opacity: 0.5 } : undefined]}
        disabled={!canProceed}
        onPress={() =>
          router.push({
            pathname: "/ai-doctor/processing",
            params: { uri },
          })
        }
      >
        <ThemedText style={styles.buttonText}>Start Diagnosis</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => router.back()}>
        <ThemedText style={styles.secondaryText}>Back</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  image: {
    width: "100%",
    height: 360,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
    borderWidth: 1,
    borderColor: "#1b5e20",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "white", fontWeight: "800" },
  secondary: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  secondaryText: { fontWeight: "700" },
});

