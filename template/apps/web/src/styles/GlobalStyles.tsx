import { Global, css } from "@emotion/react";
import { useTheme } from "@emotion/react";
import type { Theme } from "@repo/ui/theme-types";

export function GlobalStyles() {
  const theme = useTheme() as Theme;
  const fontFamily =
    theme?.typography?.fontFamily?.sans?.join(", ") ?? "system-ui, sans-serif";
  const bg =
    theme?.colors?.text?.primary === "#f5f5f5"
      ? "linear-gradient(135deg, #171717 0%, #262626 100%)"
      : "linear-gradient(135deg, #ffffff 0%, #fef3e7 50%, #fde68a 100%)";

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
          background-attachment: fixed;
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
