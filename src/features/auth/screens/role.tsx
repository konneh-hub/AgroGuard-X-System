import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { AuthRole } from "../types";

const roles: { role: AuthRole; label: string; description: string }[] = [
  {
    role: "FARMER",
    label: "Farmer",
    description: "Manage your farm and crops",
  },
  {
    role: "AGRICULTURAL_EXPERT",
    label: "Agricultural Expert",
    description: "Provide agricultural guidance",
  },
  {
    role: "NGO_OFFICER",
    label: "NGO Officer",
    description: "Represent an NGO organization",
  },
  {
    role: "FINANCIAL_INSTITUTION_OFFICER",
    label: "Financial Institution Officer",
    description: "Manage financial services",
  },
  {
    role: "GOVERNMENT_OFFICER",
    label: "Government Officer",
    description: "Government agricultural programs",
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Who are you?
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Select your role to create an account
          </ThemedText>
        </View>

        <View style={styles.list}>
          {roles.map((r) => (
            <Pressable
              key={r.role}
              style={({ pressed }) => [
                styles.item,
                { borderColor: theme.primary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => router.push("/auth/register")}
            >
              <ThemedText style={styles.roleLabel}>{r.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {r.description}
              </ThemedText>
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
    gap: Spacing.one,
  },
  roleLabel: { fontWeight: "600", fontSize: 16 },
});
