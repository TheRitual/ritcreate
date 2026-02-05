export interface ThemeColors {
  primary: Record<string, string>;
  neutral: Record<string, string>;
  text: { primary: string; muted: string };
  glass: { light: string; medium: string; dark: string };
}

export interface Theme {
  colors: ThemeColors;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  typography: {
    fontFamily: { sans: string[] };
    fontWeight: Record<string, string>;
  };
}
