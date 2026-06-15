import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

import { useAuth } from "../contexts/AuthContext";

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyOtp } = useAuth();
  const theme = useTheme();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = (params as any)?.verificationToken as string | undefined;

  const onSubmit = async () => {
    if (!otp || !token) return;
    setIsSubmitting(true);
    try {
      await verifyOtp({ otp, verificationToken: token, channel: "email" });
      // After verify, user should be signed in; go to protected area.
      router.replace("/explore");
    } catch (e) {
      // TODO: show error UI
      console.warn("OTP verify failed", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Verify account
      </ThemedText>

      <View style={styles.field}>
        <ThemedText>Verification code</ThemedText>
        <TextInput
          value={otp}
          onChangeText={setOtp}
          style={[styles.input, { borderColor: theme.input }]}
          keyboardType="number-pad"
          placeholder="Enter code"
        />
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.button, { borderColor: theme.input }]}
      >
        <ThemedText type="linkPrimary">
          {isSubmitting ? "Verifying..." : "Verify"}
        </ThemedText>
      </Pressable>
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
  button: {
    paddingVertical: Spacing.three,
    alignItems: "center",
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: "transparent",
    marginTop: Spacing.four,
  },
});
