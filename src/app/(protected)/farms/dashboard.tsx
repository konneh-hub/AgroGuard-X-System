import { StyleSheet, View } from "react-native";



import { ThemedText } from "@/components/themed-text";

import { ThemedView } from "@/components/themed-view";

export default function FarmsDashboard() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Farm Dashboard</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.subtitle}>
        Overview of your farms and quick actions.
      </ThemedText>

      <View style={styles.actions}>
        <ThemedText style={styles.button}>
          <ThemedText style={styles.buttonText}>
            My Farms (route stub)
          </ThemedText>
        </ThemedText>

        <ThemedText style={styles.button}>
          <ThemedText style={styles.buttonText}>
            Add Farm (route stub)
          </ThemedText>
        </ThemedText>

        <ThemedText style={styles.button}>
          <ThemedText style={styles.buttonText}>
            Farm Map (route stub)
          </ThemedText>
        </ThemedText>

        <View style={{ height: 12 }} />

        <ThemedText
          style={[
            styles.button,
            { backgroundColor: "transparent", borderColor: "#666" },
          ]}
        >
          <ThemedText style={styles.buttonText}>
            Farm History (route stub)
          </ThemedText>
        </ThemedText>


        <View style={{ height: 12 }} />

        <ThemedText themeColor="textSecondary">
          Stub UI for Stage 2. Next: implement list + stats + boundary mapping.
        </ThemedText>
      </View>
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
  actions: {
    gap: 12,
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
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
