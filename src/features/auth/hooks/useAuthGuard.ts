import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/contexts/AuthContext';

export function useAuthGuard(redirectTo: any = '/auth/login') {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace(redirectTo);
  }, [user, isLoading, router, redirectTo]);
}

