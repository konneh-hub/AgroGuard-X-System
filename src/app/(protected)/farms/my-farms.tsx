import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function MyFarmsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Farms</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Stub screen for Stage 2. Next: implement farms list from backend + offline cache.
      </ThemedText>

      <View style={{ flex: 1 }} />
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

