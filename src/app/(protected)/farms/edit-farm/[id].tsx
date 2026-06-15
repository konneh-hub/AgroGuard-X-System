import { StyleSheet, View } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function EditFarmScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? "";

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Edit Farm</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Farm ID: {id || "(missing)"}
      </ThemedText>

      <View style={{ flex: 1 }} />

      <ThemedText themeColor="textSecondary">
        Stub UI for Stage 2. Next: load farm, resume offline draft, edit boundary and images.
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

