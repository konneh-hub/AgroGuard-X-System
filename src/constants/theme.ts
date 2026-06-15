/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#212121",
    background: "#F5F5F5",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#757575",
    card: "#FFFFFF",
    cardForeground: "#212121",
    popover: "#FFFFFF",
    muted: "#f0f2f5",
    mutedForeground: "#9098a3",
    border: "#e5e7eb",
    input: "#e5e7eb",
    primary: "#2E7D32",
    primaryForeground: "#ffffff",
    secondary: "#795548",
    secondaryForeground: "#ffffff",
    accent: "#f5c116",
    accentForeground: "#0d1a2e",
    ring: "#388e3c",
    sidebarBackground: "#ffffff",
    sidebarForeground: "#212121",
    sidebarPrimary: "#2E7D32",
    sidebarAccent: "#f1f5f9",
    sidebarBorder: "#e5e7eb",
    chart1: "#388e3c",
    chart2: "#f08010",
    chart3: "#f5c116",
    chart4: "#2b9db8",
    chart5: "#d63b3b",
    destructive: "#cc2929",
    destructiveForeground: "#ffffff",
  },
  dark: {
    text: "#e8edf5",
    background: "#0d1a2e",
    backgroundElement: "#112038",
    backgroundSelected: "#1c2e47",
    textSecondary: "#7f93ab",
    card: "#112038",
    cardForeground: "#e8edf5",
    popover: "#0f1c30",
    muted: "#1c2e47",
    mutedForeground: "#7f93ab",
    border: "#233247",
    input: "#233247",
    primary: "#2e7d32",
    primaryForeground: "#ffffff",
    secondary: "#e87b0a",
    secondaryForeground: "#ffffff",
    accent: "#f5c116",
    accentForeground: "#0d1a2e",
    ring: "#388e3c",
    sidebarBackground: "#0a1626",
    sidebarForeground: "#d4dce9",
    sidebarPrimary: "#2e7d32",
    sidebarAccent: "#192e47",
    sidebarBorder: "#1c2a3d",
    chart1: "#388e3c",
    chart2: "#f08010",
    chart3: "#f5c116",
    chart4: "#2b9db8",
    chart5: "#d63b3b",
    destructive: "#cc2929",
    destructiveForeground: "#ffffff",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
