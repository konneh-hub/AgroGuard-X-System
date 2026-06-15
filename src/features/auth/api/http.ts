import axios from 'axios';

const getBaseUrl = () => {
  // For Expo, env vars are often injected at build time. Keep this as a safe fallback.
  // Users can set EXPO_PUBLIC_API_BASE_URL.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyProcess = process as any;
  const envBase = anyProcess?.env?.EXPO_PUBLIC_API_BASE_URL;
  return envBase || 'https://example.com';
};

export const http = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

