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
  emailOrPhone: z.string().min(3, "Enter email or phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const theme = useTheme();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { emailOrPhone: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (values) => {
    await signIn({
      emailOrPhone: values.emailOrPhone,
      password: values.password,
      rememberMe: false,
    });
    router.replace("/explore");
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
              Sign in
            </ThemedText>

            <View style={styles.field}>
              <ThemedText>Email or Phone</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.input }]}
                value={watch("emailOrPhone")}
                onChangeText={(t) => setValue("emailOrPhone", t)}
                placeholder="you@example.com or +232..."
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.emailOrPhone ? (
                <ThemedText type="small">
                  {errors.emailOrPhone.message}
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.field}>
              <ThemedText>Password</ThemedText>
              <TextInput
                style={[styles.input, { borderColor: theme.input }]}
                value={watch("password")}
                onChangeText={(t) => setValue("password", t)}
                placeholder="Password"
                secureTextEntry
              />
              {errors.password ? (
                <ThemedText type="small">{errors.password.message}</ThemedText>
              ) : null}
            </View>

            <Pressable
              onPress={onSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.9 },
                { borderColor: theme.primary, backgroundColor: theme.primary },
              ]}
            >
              <ThemedText
                style={{ color: theme.primaryForeground, fontWeight: "600" }}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </ThemedText>
            </Pressable>

            <View style={styles.actions}>
              <Pressable onPress={() => router.push("/auth/forgot")}>
                <ThemedText type="link">Forgot password?</ThemedText>
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
  title: { marginBottom: Spacing.four },
  field: { marginBottom: Spacing.three, gap: Spacing.two },
  input: {
    height: 48,
    borderRadius: Spacing.two,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  card: {
    maxWidth: 520,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.four,
    borderRadius: Spacing.four,
    backgroundColor: "transparent",
  },
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "transparent",
    marginTop: Spacing.four,
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.four,
  },
  scroll: { paddingBottom: 40 },
});
