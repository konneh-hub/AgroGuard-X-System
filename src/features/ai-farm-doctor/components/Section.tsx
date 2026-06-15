import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
});

