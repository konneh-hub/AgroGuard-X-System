import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AiDoctorCamera() {
  const router = useRouter();
  const cameraRef = useRef<any | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isTaking, setIsTaking] = useState(false);

  if (!permission) return <ThemedView />;

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Camera permission required</ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Allow Camera</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.cameraWrap}>
        <CameraView
          ref={(r: any) => {
            cameraRef.current = r;
          }}
          style={styles.camera}
          facing="back"
        />

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.capture, isTaking ? { opacity: 0.6 } : undefined]}
            disabled={isTaking}
            onPress={async () => {
              try {
                setIsTaking(true);
                const photo = await cameraRef.current?.takePictureAsync?.({
                  quality: 0.7,
                });
                if (!photo?.uri) throw new Error("Unable to capture photo");
                router.push({
                  pathname: "/ai-doctor/preview",
                  params: { uri: photo.uri },
                });
              } finally {
                setIsTaking(false);
              }
            }}
          >
            <ThemedText style={styles.captureText}>Capture</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondary}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.secondaryText}>Back</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraWrap: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    gap: 12,
    alignItems: "center",
  },
  capture: {
    width: 220,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1b5e20",
  },
  captureText: { color: "white", fontWeight: "700" },
  secondary: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderWidth: 1,
    borderColor: "#666",
    alignItems: "center",
  },
  secondaryText: { fontWeight: "600" },
  button: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#2e7d32",
  },
  buttonText: { color: "white", fontWeight: "700" },
});
