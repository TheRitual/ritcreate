import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import type { Theme } from "../src/theme-types";

const defaultTheme: Theme = {
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

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={defaultTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
