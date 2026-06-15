import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

const languages = [
  { key: "en", label: "English" },
  { key: "krio", label: "Krio" },
  { key: "mende", label: "Mende" },
  { key: "temne", label: "Temne" },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Choose your language
      </ThemedText>

      <View style={styles.list}>
        {languages.map((l) => (
          <Pressable
            key={l.key}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}
            onPress={() => router.push("/auth/role")}
          >
            <ThemedText>{l.label}</ThemedText>
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: "center" },
  title: { marginBottom: Spacing.four },
  list: { gap: Spacing.two },
  item: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: "transparent",
  },
});
