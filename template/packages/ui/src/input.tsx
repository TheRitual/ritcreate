import { forwardRef } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "./theme-types";

const StyledInput = styled.input<{ theme: Theme }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${(p) =>
    p.theme?.colors?.glass?.light ?? "rgba(255,255,255,0.4)"};
  border: 1px solid ${(p) => p.theme?.colors?.neutral?.[300] ?? "#d4d4d4"};
  border-radius: ${(p) => p.theme?.borderRadius?.lg ?? "0.75rem"};
  font-size: 1rem;
  font-family: inherit;
  color: ${(p) => p.theme?.colors?.text?.primary ?? "#1f2937"};
  transition: all 0.3s ease;
  &::placeholder {
    color: ${(p) => p.theme?.colors?.text?.muted ?? "#6b7280"};
  }
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme?.colors?.primary?.[500] ?? "#ef4444"};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function Input(props, ref) {
  const theme = useTheme() as Theme | undefined;
  return <StyledInput ref={ref} theme={theme ?? ({} as Theme)} {...props} />;
});
