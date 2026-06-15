import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/contexts/AuthContext";

function ProtectedRoot() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/welcome");
    }
  }, [isLoading, user, router]);

  return <Slot />;
}

export default function ProtectedLayout() {
  return <ProtectedRoot />;
}
