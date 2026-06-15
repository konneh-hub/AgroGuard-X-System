import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Image, View } from "react-native";

import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";

import { useAuth } from "../contexts/AuthContext";

export default function SplashScreenRoute() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch {
        // ignore
      }

      // Wait for auth provider to load.
      // When not authenticated -> language/welcome.
      // When authenticated -> role selection/home.
      if (!mounted) return;
      if (!isLoading) {
        await SplashScreen.hideAsync().catch(() => undefined);
        router.replace(user ? "/explore" : "/auth/welcome");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoading, router, user]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <Image
        source={require("@/assets/images/agroguardx.jpeg")}
        style={{ width: 160, height: 160, borderRadius: 20 }}
      />
      <ThemedText type="title">AgroGuard X</ThemedText>
    </View>
  );
}
