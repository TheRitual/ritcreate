import { forwardRef } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "./theme-types";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  round?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  round: boolean;
  theme: Theme;
}>`
  font-family: ${(p) =>
    p.theme?.typography?.fontFamily?.sans?.join(", ") ?? "inherit"};
  font-weight: ${(p) => p.theme?.typography?.fontWeight?.bold ?? "700"};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: ${(p) =>
    p.round ? "9999px" : (p.theme?.borderRadius?.lg ?? "0.75rem")};
  width: ${(p) => (p.fullWidth ? "100%" : "auto")};
  padding: ${(p) =>
    p.size === "sm"
      ? "0.5rem 1rem"
      : p.size === "lg"
        ? "1rem 2rem"
        : "0.75rem 1.5rem"};
  font-size: ${(p) =>
    p.size === "sm" ? "0.875rem" : p.size === "lg" ? "1.125rem" : "1rem"};
  background: ${(p) =>
    p.variant === "primary"
      ? (p.theme?.colors?.primary?.[500] ?? "#ef4444")
      : p.variant === "outline"
        ? "transparent"
        : (p.theme?.colors?.glass?.light ?? "rgba(255,255,255,0.4)")};
  border: 2px solid
    ${(p) =>
      p.variant === "outline"
        ? (p.theme?.colors?.primary?.[500] ?? "#ef4444")
        : "transparent"};
  color: ${(p) =>
    p.variant === "primary"
      ? "#fff"
      : (p.theme?.colors?.text?.primary ?? "#1f2937")};
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      round = false,
      children,
      ...props
    },
    ref
  ) {
    const theme = useTheme() as Theme | undefined;
    return (
      <StyledButton
        ref={ref}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        round={round}
        theme={theme ?? ({} as Theme)}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);
