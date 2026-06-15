import * as SecureStore from "expo-secure-store";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { createAuthRepository } from "@/features/auth/api";
import type { AuthRole, TokenPair } from "@/features/auth/types";
import { decodeJwtPayload, isTokenExpired } from "@/features/auth/utils/token";

const ACCESS_KEY = "agroguardx_accessToken";
const REFRESH_KEY = "agroguardx_refreshToken";

export type AuthUser = {
  id: string;
  role: AuthRole;
};

export type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: (params: {
    emailOrPhone: string;
    password: string;
    rememberMe?: boolean;
  }) => Promise<void>;
  signUp: (params: {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    role: AuthRole;
    district?: string;
    chiefdom?: string;
    country?: string;
  }) => Promise<{ verificationToken: string }>;
  verifyOtp: (params: {
    otp: string;
    verificationToken: string;
    channel: "email" | "phone";
  }) => Promise<void>;
  forgotPassword: (params: { emailOrPhone: string }) => Promise<void>;
  resetPassword: (params: {
    resetToken: string;
    newPassword: string;
  }) => Promise<void>;
  requestRefresh: () => Promise<TokenPair | null>;
  signOut: () => Promise<void>;
  rememberMeEnabled: boolean;
  setRememberMeEnabled: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const repository = useMemo(() => createAuthRepository(), []);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMeEnabled, setRememberMeEnabled] = useState(false);

  // Helps avoid multiple concurrent refresh calls.
  const refreshPromiseRef = useRef<Promise<TokenPair | null> | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const access = await SecureStore.getItemAsync(ACCESS_KEY);
      const refresh = await SecureStore.getItemAsync(REFRESH_KEY);

      const payload = access ? decodeJwtPayload(access) : null;
      if (access && payload && !isTokenExpired(access)) {
        setUser({ id: payload.sub, role: payload.role });
        setAccessToken(access);
      } else if (refresh) {
        // Try refreshing.
        const pair = await repository.refresh(refresh);
        if (pair?.accessToken) {
          const nextPayload = decodeJwtPayload(pair.accessToken);
          if (nextPayload) {
            setUser({ id: nextPayload.sub, role: nextPayload.role });
            setAccessToken(pair.accessToken);

            // Only persist refresh token if remember me is enabled.
            const persistRefresh = rememberMeEnabled;
            if (persistRefresh) {
              await SecureStore.setItemAsync(REFRESH_KEY, pair.refreshToken);
            }
          }
        }
      }

      // Determine remember-me based on whether refresh token exists in secure storage.
      const storedRefresh = refresh;
      setRememberMeEnabled(Boolean(storedRefresh));
    } finally {
      setIsLoading(false);
    }
  }, [repository, rememberMeEnabled]);

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestRefresh = useCallback(async (): Promise<TokenPair | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
      try {
        const refresh = await SecureStore.getItemAsync(REFRESH_KEY);
        if (!refresh) return null;

        const pair = await repository.refresh(refresh);
        if (!pair) return null;

        const payload = decodeJwtPayload(pair.accessToken);
        if (payload) {
          setUser({ id: payload.sub, role: payload.role });
          setAccessToken(pair.accessToken);
        }

        if (rememberMeEnabled) {
          await SecureStore.setItemAsync(REFRESH_KEY, pair.refreshToken);
        } else {
          await SecureStore.deleteItemAsync(REFRESH_KEY);
        }

        return pair;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [repository, rememberMeEnabled]);

  const signIn = useCallback(
    async (params: {
      emailOrPhone: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const { rememberMe = false } = params;
      const pair = await repository.login({
        emailOrPhone: params.emailOrPhone,
        password: params.password,
      });

      const payload = decodeJwtPayload(pair.accessToken);
      if (!payload) throw new Error("Invalid access token payload");

      setUser({ id: payload.sub, role: payload.role });
      setAccessToken(pair.accessToken);

      await SecureStore.setItemAsync(ACCESS_KEY, pair.accessToken);
      setRememberMeEnabled(rememberMe);

      if (rememberMe) {
        await SecureStore.setItemAsync(REFRESH_KEY, pair.refreshToken);
      } else {
        await SecureStore.deleteItemAsync(REFRESH_KEY);
      }
    },
    [repository],
  );

  const signUp = useCallback(
    async (params: {
      email: string;
      phone: string;
      password: string;
      fullName: string;
      role: AuthRole;
      district?: string;
      chiefdom?: string;
      country?: string;
    }) => {
      const res = await repository.register(params as any);
      return res as { verificationToken: string };
    },
    [repository],
  );

  const verifyOtp = useCallback(
    async (params: {
      otp: string;
      verificationToken: string;
      channel: "email" | "phone";
    }) => {
      const pair = await repository.verifyOtp(params);
      const payload = decodeJwtPayload(pair.accessToken);
      if (!payload) throw new Error("Invalid access token payload");

      setUser({ id: payload.sub, role: payload.role });
      setAccessToken(pair.accessToken);

      await SecureStore.setItemAsync(ACCESS_KEY, pair.accessToken);

      if (rememberMeEnabled) {
        await SecureStore.setItemAsync(REFRESH_KEY, pair.refreshToken);
      }
    },
    [repository, rememberMeEnabled],
  );

  const forgotPassword = useCallback(
    async (params: { emailOrPhone: string }) => {
      await repository.forgotPassword(params);
    },
    [repository],
  );

  const resetPassword = useCallback(
    async (params: { resetToken: string; newPassword: string }) => {
      await repository.resetPassword(params);
    },
    [repository],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    setIsLoading(true);

    try {
      await SecureStore.deleteItemAsync(ACCESS_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      setRememberMeEnabled(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      signIn,
      signUp,
      verifyOtp,
      forgotPassword,
      resetPassword,
      requestRefresh,
      signOut,
      rememberMeEnabled,
      setRememberMeEnabled,
    }),
    [
      user,
      accessToken,
      isLoading,
      signIn,
      signUp,
      verifyOtp,
      forgotPassword,
      resetPassword,
      requestRefresh,
      signOut,
      rememberMeEnabled,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
