import { Global, css } from "@emotion/react";
import { useTheme } from "@emotion/react";
import type { Theme } from "@repo/ui/theme-types";

export function GlobalStyles() {
  const theme = useTheme() as Theme;
  const fontFamily =
    theme?.typography?.fontFamily?.sans?.join(", ") ?? "system-ui, sans-serif";
  const bg = theme?.colors?.background ?? "#eef1f6";

  return (
    <Global
      styles={css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: ${fontFamily};
          line-height: 1.6;
          color: ${theme?.colors?.text?.primary ?? "#1f2937"};
          background: ${bg};
          min-height: 100vh;
        }
        a {
          text-decoration: inherit;
          color: inherit;
        }
      `}
    />
  );
}
