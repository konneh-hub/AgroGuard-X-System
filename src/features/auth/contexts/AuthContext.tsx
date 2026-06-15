import { deleteItem, getItem, setItem } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

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
  }) => Promise<{ signedIn: boolean }>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMeEnabled, setRememberMeEnabled] = useState(false);

  // Helps avoid multiple concurrent refresh calls.
  const refreshPromiseRef = useRef<Promise<TokenPair | null> | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const access = await getItem(ACCESS_KEY);
      const refresh = await getItem(REFRESH_KEY);

      const payload = access ? decodeJwtPayload(access) : null;
      if (access && payload && !isTokenExpired(access)) {
        setUser({ id: payload.sub, role: payload.role });
        setAccessToken(access);
      } else if (refresh) {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refresh,
        });

        if (error) {
          console.warn("Supabase refresh session failed", error.message);
        } else if (data.session) {
          const nextPayload = decodeJwtPayload(data.session.access_token);
          if (nextPayload) {
            setUser({ id: nextPayload.sub, role: nextPayload.role });
            setAccessToken(data.session.access_token);

            if (rememberMeEnabled) {
              await setItem(REFRESH_KEY, data.session.refresh_token);
            } else {
              await deleteItem(REFRESH_KEY);
            }
          }
        }
      }

      setRememberMeEnabled(Boolean(refresh));
    } finally {
      setIsLoading(false);
    }
  }, [rememberMeEnabled]);

  useEffect(() => {
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestRefresh = useCallback(async (): Promise<TokenPair | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
      try {
        const refresh = await getItem(REFRESH_KEY);
        if (!refresh) return null;

        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refresh,
        });

        if (error || !data.session) return null;

        const payload = decodeJwtPayload(data.session.access_token);
        if (payload) {
          setUser({ id: payload.sub, role: payload.role });
          setAccessToken(data.session.access_token);
        }

        if (rememberMeEnabled) {
          await setItem(REFRESH_KEY, data.session.refresh_token);
        } else {
          await deleteItem(REFRESH_KEY);
        }

        return {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
        };
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [rememberMeEnabled]);

  const signIn = useCallback(
    async (params: {
      emailOrPhone: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const { rememberMe = false } = params;
      const isPhone = params.emailOrPhone.trim().startsWith("+");
      const credentials = isPhone
        ? { phone: params.emailOrPhone.trim(), password: params.password }
        : { email: params.emailOrPhone.trim(), password: params.password };

      const { data, error } = await supabase.auth.signInWithPassword(
        credentials as any,
      );

      if (error || !data.session) {
        throw (
          error ??
          new Error("Unable to sign in. Please check your credentials.")
        );
      }

      const payload = decodeJwtPayload(data.session.access_token);
      if (!payload) throw new Error("Invalid access token payload");

      setUser({ id: payload.sub, role: payload.role });
      setAccessToken(data.session.access_token);

      await setItem(ACCESS_KEY, data.session.access_token);
      setRememberMeEnabled(rememberMe);

      if (rememberMe) {
        await setItem(REFRESH_KEY, data.session.refresh_token);
      } else {
        await deleteItem(REFRESH_KEY);
      }
    },
    [],
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
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            fullName: params.fullName,
            phone: params.phone,
            role: params.role,
            district: params.district,
            chiefdom: params.chiefdom,
            country: params.country,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        const payload = decodeJwtPayload(data.session.access_token);
        if (!payload) throw new Error("Invalid access token payload");

        setUser({ id: payload.sub, role: payload.role });
        setAccessToken(data.session.access_token);
        await setItem(ACCESS_KEY, data.session.access_token);
        await setItem(REFRESH_KEY, data.session.refresh_token);

        return { signedIn: true };
      }

      return { signedIn: false };
    },
    [],
  );

  const verifyOtp = useCallback(
    async (params: {
      otp: string;
      verificationToken: string;
      channel: "email" | "phone";
    }) => {
      const verifyPayload: Record<string, string> = {
        token: params.otp,
        type: params.channel === "email" ? "email" : "sms",
      };

      if (params.channel === "email") {
        verifyPayload.email = params.verificationToken;
      } else {
        verifyPayload.phone = params.verificationToken;
      }

      const { data, error } = await supabase.auth.verifyOtp(
        verifyPayload as any,
      );

      if (error || !data.session) {
        throw error ?? new Error("OTP verification failed.");
      }

      const payload = decodeJwtPayload(data.session.access_token);
      if (!payload) throw new Error("Invalid access token payload");

      setUser({ id: payload.sub, role: payload.role });
      setAccessToken(data.session.access_token);
      await setItem(ACCESS_KEY, data.session.access_token);

      if (rememberMeEnabled) {
        await setItem(REFRESH_KEY, data.session.refresh_token);
      }
    },
    [rememberMeEnabled],
  );

  const forgotPassword = useCallback(
    async (params: { emailOrPhone: string }): Promise<void> => {
      if (params.emailOrPhone.trim().startsWith("+")) {
        throw new Error(
          "Password recovery by phone is not supported. Use an email address.",
        );
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(
        params.emailOrPhone.trim(),
      );

      if (error) {
        throw error;
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (params: { resetToken: string; newPassword: string }) => {
      throw new Error(
        "Reset password via token is not supported in-app. Use the reset link received by email.",
      );
    },
    [],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
      await deleteItem(ACCESS_KEY);
      await deleteItem(REFRESH_KEY);
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
