import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ProtectedExplore() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Farm Insights</ThemedText>
      <ThemedText themeColor="textSecondary">
        Explore your active alerts, device health, and farm performance metrics.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
