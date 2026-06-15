import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedTextButton } from "@/components/ui/ThemedTextButton";

export default function AiDoctorHome() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">AI Farm Doctor</ThemedText>
      <ThemedText themeColor="textSecondary">
        Upload or capture a crop photo to get disease, nutrient deficiency, water stress,
        and pest diagnosis.
      </ThemedText>

      <ThemedTextButton
        style={styles.button}
        onPress={() => router.push("/ai-doctor/camera")}
      >
        Capture Photo
      </ThemedTextButton>

      <ThemedTextButton
        style={[styles.button, { backgroundColor: "transparent", borderColor: "#666" }]}
        onPress={() => router.push("/ai-doctor/gallery")}
      >
        Upload from Gallery
      </ThemedTextButton>

      <ThemedTextButton
        style={[styles.button, { backgroundColor: "transparent", borderColor: "#666" }]}
        onPress={() => router.push("/ai-doctor/history")}
      >
        Diagnosis History
      </ThemedTextButton>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  button: {
    marginTop: 10,
  },
});

