# AgroGuard X - Auth Module Task TODO

## Plan confirmation

- Build production-ready **frontend auth module** (screens + guards + state + navigation) for AgroGuard X.
- No backend mocking; implement request calls as real API layer but keep base URL configurable via env.

## Steps

1. Inspect current routing setup (expo-router tabs/layout) and decide integration points.
2. Create auth feature folder structure under `src/features/auth/`.
   - ✅ Added initial scaffolding files (types + utils + feature README)
3. Add AuthContext + token/session management (SecureStore, refresh logic, remember-me).
4. Implement API service layer + repository pattern (axios instance).
5. Create all requested screens:
   - Splash, Welcome, Language Selection
   - Login, Register
   - OTP Verification
   - Forgot Password, Reset Password
   - Role Selection
6. Add reusable UI components (inputs, buttons, loading/error).
7. Add authentication guard + protected route redirection.
8. Integrate AuthProvider and guarded navigation into `src/app/_layout.tsx` (and/or tab layout).
9. Ensure TypeScript types compile.
10. Install any missing npm dependencies.
11. Run `npm run lint` and `npm start` to verify flow.
