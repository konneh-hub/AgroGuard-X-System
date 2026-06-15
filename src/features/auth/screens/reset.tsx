import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function ForgotPasswordSuccessScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedView type="card" style={styles.card}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>✓</ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            Check your email
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.message}
          >
            We've sent a password reset link to your email address. Click the
            link in the email to create a new password.
          </ThemedText>

          <ThemedText
            type="small"
            themeColor="textSecondary"
            style={styles.tip}
          >
            💡 If you don't see the email, check your spam folder.
          </ThemedText>

          <View style={styles.actions}>
            <Pressable
              onPress={() => router.replace("/auth/login")}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.9 },
                {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: theme.primaryForeground,
                  fontWeight: "600",
                }}
              >
                Back to login
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/auth/login")}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.9 },
              ]}
            >
              <ThemedText style={{ color: theme.primary }}>
                Didn't receive email?
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: "center" },
  scroll: { paddingBottom: 40 },
  card: {
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.four,
  },
  icon: {
    fontSize: 48,
    color: "#2e7d32",
  },
  title: { marginBottom: Spacing.two, textAlign: "center" },
  message: {
    textAlign: "center",
    marginBottom: Spacing.four,
    lineHeight: 22,
  },
  tip: {
    textAlign: "center",
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.two,
    lineHeight: 20,
  },
  actions: { width: "100%", gap: Spacing.two },
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    width: "100%",
  },
  secondaryButton: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    width: "100%",
  },
});
