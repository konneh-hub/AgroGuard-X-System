import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { z } from "zod";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const theme = useTheme();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await forgotPassword({ emailOrPhone: values.email });
      router.replace("/auth/reset");
    } catch (error) {
      console.warn("Forgot password error", error);
    }
  });

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedView type="card" style={styles.card}>
            <ThemedText type="title" style={styles.title}>
              Forgot Password?
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={styles.subtitle}
            >
              Enter your email address and we'll send you a link to reset your
              password.
            </ThemedText>

            <View style={styles.field}>
              <ThemedText>Email Address</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.input }]}
                value={watch("email")}
                onChangeText={(t) => setValue("email", t)}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              {errors.email ? (
                <ThemedText type="small" style={{ color: theme.destructive }}>
                  {errors.email.message}
                </ThemedText>
              ) : null}
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={isSubmitting}
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
                {isSubmitting ? "Sending..." : "Send reset link"}
              </ThemedText>
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.actions}>
              <Pressable onPress={() => router.back()}>
                <ThemedText type="link">Back to login</ThemedText>
              </Pressable>
              <Pressable onPress={() => router.push("/auth/register")}>
                <ThemedText type="linkPrimary">Create account</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  title: { marginBottom: Spacing.two },
  subtitle: {
    marginBottom: Spacing.four,
    lineHeight: 20,
  },
  field: { marginBottom: Spacing.three, gap: Spacing.two },
  input: {
    height: 48,
    borderRadius: Spacing.two,
    backgroundColor: "transparent",
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    marginTop: Spacing.four,
    width: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: Spacing.four,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
