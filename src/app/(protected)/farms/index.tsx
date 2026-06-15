import { useEffect } from "react";

import { useRouter } from "expo-router";

export default function FarmsIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/farms/dashboard");
  }, [router]);

  return null;
}
