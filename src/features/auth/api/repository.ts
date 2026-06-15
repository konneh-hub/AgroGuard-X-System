import { http } from "@/features/auth/api/http";
import type { AuthRole, TokenPair } from "@/features/auth/types";

export type LoginRequest = {
  emailOrPhone: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  phone: string;
  password: string;
  fullName: string;
};

export type RegisterProfileRequest = RegisterRequest & {
  role: AuthRole;
  district?: string;
  chiefdom?: string;
  country?: string;
};

export type VerifyOtpRequest = {
  otp: string;
  verificationToken: string;
  channel: "email" | "phone";
};

export type ForgotPasswordRequest = {
  emailOrPhone: string;
};

export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

// Repository pattern: encapsulate request/response mapping.
export function createAuthRepository() {
  return {
    async login(req: LoginRequest): Promise<TokenPair> {
      const res = await http.post("/auth/login", req);
      return res.data as TokenPair;
    },

    async register(
      req: RegisterProfileRequest,
    ): Promise<{ verificationToken: string }> {
      const res = await http.post("/auth/register", req);
      return res.data as { verificationToken: string };
    },

    async verifyOtp(req: VerifyOtpRequest): Promise<TokenPair> {
      // Expect access+refresh on success.
      const res = await http.post("/auth/verify-otp", req);
      return res.data as TokenPair;
    },

    async forgotPassword(
      req: ForgotPasswordRequest,
    ): Promise<{ resetToken: string }> {
      const res = await http.post("/auth/forgot-password", req);
      return res.data as { resetToken: string };
    },

    async resetPassword(req: ResetPasswordRequest): Promise<void> {
      await http.post("/auth/reset-password", req);
    },

    async refresh(refreshToken: string): Promise<TokenPair | null> {
      try {
        const res = await http.post("/auth/refresh", { refreshToken });
        return res.data as TokenPair;
      } catch {
        return null;
      }
    },

    // Role selection and other flows can be added as separate repository methods.
    async selectRole(_role: AuthRole): Promise<void> {
      // placeholder for future endpoint integration
    },
  };
}
