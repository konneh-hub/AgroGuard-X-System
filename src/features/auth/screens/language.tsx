import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const languages = [
  { key: "en", label: "English" },
  { key: "krio", label: "Krio" },
  { key: "mende", label: "Mende" },
  { key: "temne", label: "Temne" },
];

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Choose your language
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Select your preferred language to continue
          </ThemedText>
        </View>

        <View style={styles.list}>
          {languages.map((l) => (
            <Pressable
              key={l.key}
              style={({ pressed }) => [
                styles.item,
                { borderColor: theme.primary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push("/auth/register")}
            >
              <ThemedText style={styles.itemText}>{l.label}</ThemedText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four },
  scroll: { paddingVertical: Spacing.four, paddingBottom: 40 },
  header: { marginBottom: Spacing.four, gap: Spacing.two },
  title: { marginBottom: Spacing.one },
  list: { gap: Spacing.three },
  item: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  itemText: { fontWeight: "500", fontSize: 16 },
});
