import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import type { AuthRole } from "../types";

const roles: { role: AuthRole; label: string }[] = [
  { role: "FARMER", label: "Farmer" },
  { role: "AGRICULTURAL_EXPERT", label: "Agricultural Expert" },
  { role: "NGO_OFFICER", label: "NGO Officer" },
  {
    role: "FINANCIAL_INSTITUTION_OFFICER",
    label: "Financial Institution Officer",
  },
  { role: "GOVERNMENT_OFFICER", label: "Government Officer" },
  { role: "SUPER_ADMIN", label: "Super Admin" },
];

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Who are you?
      </ThemedText>

      <View style={styles.list}>
        {roles.map((r) => (
          <Pressable
            key={r.role}
            style={({ pressed }) => [styles.item, pressed && { opacity: 0.85 }]}
            onPress={() => router.push("/auth/login")}
          >
            <ThemedText>{r.label}</ThemedText>
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
