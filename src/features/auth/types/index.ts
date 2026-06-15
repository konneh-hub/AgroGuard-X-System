export type AuthRole =
  | "FARMER"
  | "AGRICULTURAL_EXPERT"
  | "NGO_OFFICER"
  | "FINANCIAL_INSTITUTION_OFFICER"
  | "GOVERNMENT_OFFICER"
  | "SUPER_ADMIN";

export type JwtPayload = {
  sub: string;
  role: AuthRole;
  exp?: number;
  iat?: number;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
