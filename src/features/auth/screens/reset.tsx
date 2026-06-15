import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import { useAuth } from '../contexts/AuthContext';

const schema = z.object({
  resetToken: z.string().min(4, 'Enter reset token'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { resetToken: '', newPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await resetPassword({ resetToken: values.resetToken, newPassword: values.newPassword });
    router.replace('/auth/login');
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Reset Password
      </ThemedText>

      <View style={styles.field}>
        <ThemedText>Reset token</ThemedText>
        <View style={styles.inputStub} />
        {errors.resetToken ? (
          <ThemedText type="small">{errors.resetToken.message}</ThemedText>
        ) : null}
      </View>

      <View style={styles.field}>
        <ThemedText>New password</ThemedText>
        <View style={styles.inputStub} />
        {errors.newPassword ? (
          <ThemedText type="small">{errors.newPassword.message}</ThemedText>
        ) : null}
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}
      >
        <ThemedText type="linkPrimary">{isSubmitting ? 'Resetting...' : 'Reset'}</ThemedText>
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.backLink}>
        <ThemedText type="link">Back</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four, justifyContent: 'center' },
  title: { marginBottom: Spacing.four },
  field: { marginBottom: Spacing.three, gap: Spacing.two },
  inputStub: {
    height: 48,
    borderRadius: Spacing.two,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#999',
  },
  button: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderColor: '#999',
    marginTop: Spacing.four,
  },
  backLink: { marginTop: Spacing.three, alignItems: 'center' },
});

