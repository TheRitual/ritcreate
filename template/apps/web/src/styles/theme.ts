import type { Theme as UITheme } from "@repo/ui/theme-types";

const base = {
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
  },
  shadows: { glass: "0 8px 32px rgba(0,0,0,0.1)" },
  typography: {
    fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
    fontWeight: { bold: "700", medium: "500" },
  },
};

export const lightTheme: UITheme = {
  ...base,
  colors: {
    primary: { 500: "#6b5b95", 600: "#5a4a7d" },
    accent: { 500: "#e091ad", 600: "#d47a9b" },
    neutral: { 300: "#c4c8d4" },
    text: { primary: "#2d3142", muted: "#6b7280" },
    background: "#eef1f6",
    glass: {
      light: "rgba(255,255,255,0.5)",
      medium: "rgba(255,255,255,0.6)",
      dark: "rgba(107,91,149,0.08)",
    },
  },
};

export const darkTheme: UITheme = {
  ...base,
  colors: {
    primary: { 500: "#8b7bb5", 600: "#7a6aa3" },
    accent: { 500: "#e8a0b8", 600: "#e091ad" },
    neutral: { 300: "#4a4d5a" },
    text: { primary: "#e8eaf0", muted: "#9ca3b4" },
    background: "#1a1d26",
    glass: {
      light: "rgba(45,49,66,0.4)",
      medium: "rgba(45,49,66,0.5)",
      dark: "rgba(139,123,181,0.12)",
    },
  },
};
