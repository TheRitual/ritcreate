import type { Preview } from "@storybook/react";
import { ThemeProvider } from "@emotion/react";
import type { Theme } from "../src/theme-types";

const defaultTheme: Theme = {
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
