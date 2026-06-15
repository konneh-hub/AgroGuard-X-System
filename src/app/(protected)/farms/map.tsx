import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function FarmMapScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Farm Map</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Stub UI for Stage 2. Next: React Native Maps + OpenStreetMap + boundary
        polygon editor.
      </ThemedText>

      <ThemedText themeColor="textSecondary">
        Polygon boundary mapping will be implemented in the next iteration.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
});
