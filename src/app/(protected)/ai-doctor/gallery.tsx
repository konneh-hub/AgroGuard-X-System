import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AiDoctorGallery() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload Crop Photo</ThemedText>
      <ThemedText themeColor="textSecondary">
        Choose a photo from your gallery to get analysis.
      </ThemedText>

      {error ? (
        <ThemedText themeColor="textSecondary" style={{ color: "#b00020" }}>
          {error}
        </ThemedText>
      ) : null}

      <View style={{ height: 16 }} />

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          try {
            setError(null);
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) throw new Error("Media library permission denied");

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
              quality: 0.8,
              base64: false,
            });

            if (result.canceled) return;
            const asset = result.assets[0];
            if (!asset?.uri) throw new Error("No image selected");

            router.push({
              pathname: "/ai-doctor/preview",
              params: { uri: asset.uri },
            });
          } catch (e: any) {
            setError(e?.message ?? String(e));
          }
        }}
      >
        <ThemedText style={styles.buttonText}>Pick from Gallery</ThemedText>
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
    justifyContent: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
    borderWidth: 1,
    borderColor: "#1b5e20",
    alignItems: "center",
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

