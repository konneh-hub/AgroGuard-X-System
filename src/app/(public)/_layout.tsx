import React from 'react';
import { AuthProvider } from '@/features/auth/contexts/AuthContext';
import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}

