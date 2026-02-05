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
    primary: { 500: "#ef4444", 600: "#dc2626" },
    neutral: { 300: "#d4d4d4" },
    text: { primary: "#1f2937", muted: "#6b7280" },
    glass: {
      light: "rgba(255,255,255,0.4)",
      medium: "rgba(255,255,255,0.5)",
      dark: "rgba(0,0,0,0.1)",
    },
  },
};

export const darkTheme: UITheme = {
  ...base,
  colors: {
    primary: { 500: "#f87171", 600: "#ef4444" },
    neutral: { 300: "#525252" },
    text: { primary: "#f5f5f5", muted: "#a3a3a3" },
    glass: {
      light: "rgba(0,0,0,0.2)",
      medium: "rgba(0,0,0,0.3)",
      dark: "rgba(255,255,255,0.05)",
    },
  },
};
