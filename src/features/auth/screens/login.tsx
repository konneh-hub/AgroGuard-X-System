import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { z } from "zod";

// Note: this app template may not have @hookform/resolvers installed yet.
// This file is implemented with minimal TS suppression to stay buildable.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  emailOrPhone: z.string().min(3, "Enter email or phone"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: zodResolver(schema),
    defaultValues: { emailOrPhone: "", password: "", rememberMe: false },
    mode: "onChange",
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = handleSubmit(async (values) => {
    await signIn({
      emailOrPhone: values.emailOrPhone,
      password: values.password,
      rememberMe: Boolean(values.rememberMe),
    });

    // Redirect post-login to protected app area.
    router.replace("/explore");
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Login
      </ThemedText>

      <View style={styles.field}>
        <ThemedText>Email or Phone</ThemedText>
        <View style={styles.inputStub} />
        {errors.emailOrPhone?.message ? (
          <ThemedText type="small" themeColor="textSecondary">
            {errors.emailOrPhone.message}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.field}>
        <ThemedText>Password</ThemedText>
        <View style={styles.inputStub} />
        {errors.password?.message ? (
          <ThemedText type="small" themeColor="textSecondary">
            {errors.password.message}
          </ThemedText>
        ) : null}
      </View>

      <Pressable
        onPress={() => setValue("rememberMe", !rememberMe)}
        style={styles.remember}
      >
        <ThemedText>{rememberMe ? "✓ " : ""}Remember me</ThemedText>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
      >
        <ThemedText type="linkPrimary">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </ThemedText>
      </Pressable>

      <View style={styles.links}>
        <Pressable onPress={() => router.push("/auth/forgot")}>
          <ThemedText type="link">Forgot password?</ThemedText>
        </Pressable>
        <Pressable onPress={() => router.push("/auth/register")}>
          <ThemedText type="link">Create account</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: "center" },
  title: { marginBottom: Spacing.four },
  field: { marginBottom: Spacing.three, gap: Spacing.two },
  inputStub: {
    height: 48,
    borderRadius: Spacing.two,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#999",
  },
  remember: { marginBottom: Spacing.four },
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "#999",
  },
  links: { gap: Spacing.two, marginTop: Spacing.four },
});
