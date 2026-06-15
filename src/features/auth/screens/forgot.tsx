import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { z } from "zod";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";

import { useAuth } from "../contexts/AuthContext";

const schema = z.object({
  emailOrPhone: z.string().min(3, "Enter email or phone"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { emailOrPhone: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await forgotPassword({ emailOrPhone: values.emailOrPhone });
    router.replace("/auth/reset");
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Forgot Password
      </ThemedText>

      <View style={styles.field}>
        <ThemedText>Email or Phone</ThemedText>
        <View style={styles.inputStub} />
        {errors.emailOrPhone ? (
          <ThemedText type="small">{errors.emailOrPhone.message}</ThemedText>
        ) : null}
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
      >
        <ThemedText type="linkPrimary">
          {isSubmitting ? "Sending..." : "Send reset link"}
        </ThemedText>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <ThemedText type="link">Back</ThemedText>
      </Pressable>
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
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "#999",
    marginTop: Spacing.four,
  },
  backLink: { marginTop: Spacing.three, alignItems: "center" },
});
