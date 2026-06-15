import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AddFarmScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add Farm</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Stub UI for Stage 2. Next: implement farm creation form, offline drafts,
        images, and boundary mapping.
      </ThemedText>

      <View style={{ flex: 1 }} />

      <ThemedText themeColor="textSecondary">
        Map + polygon editor will be added in later step.
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
