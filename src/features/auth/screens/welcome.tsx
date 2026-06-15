import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/agroguardx.jpeg")}
        style={styles.logo}
      />
      <ThemedText type="title" style={styles.title}>
        Welcome to AgroGuard X
      </ThemedText>
      <ThemedText style={styles.subtitle} themeColor="textSecondary">
        Your AI-powered farm operating system.
      </ThemedText>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
            { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}
          onPress={() => router.push("/auth/language")}
        >
          <ThemedText
            style={{ color: theme.primaryForeground, fontWeight: "600" }}
          >
            Get Started
          </ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
            { borderColor: theme.primary, backgroundColor: "transparent" },
          ]}
          onPress={() => router.push("/auth/login")}
        >
          <ThemedText style={{ color: theme.primary }}>Login</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: "center" },
  title: { marginBottom: Spacing.three },
  subtitle: { marginBottom: Spacing.four },
  actions: { gap: Spacing.two },
  button: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  pressed: {
    opacity: 0.85,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginBottom: Spacing.four,
    borderRadius: Spacing.four,
  },
});
