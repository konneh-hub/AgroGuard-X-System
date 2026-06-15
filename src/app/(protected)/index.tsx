import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function ProtectedHome() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">AgroGuard X Dashboard</ThemedText>
      <ThemedText themeColor="textSecondary">
        Access your secure farm operations and analytics.
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
