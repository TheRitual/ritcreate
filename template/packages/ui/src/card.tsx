import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "./theme-types";

const StyledCard = styled.div<{ theme: Theme }>`
  background: ${(p) =>
    p.theme?.colors?.glass?.light ?? "rgba(255,255,255,0.4)"};
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(p) => p.theme?.colors?.glass?.medium ?? "rgba(255,255,255,0.5)"};
  border-radius: ${(p) => p.theme?.borderRadius?.["2xl"] ?? "1.5rem"};
  box-shadow: ${(p) => p.theme?.shadows?.glass ?? "0 8px 32px rgba(0,0,0,0.1)"};
  padding: 1.5rem;
  color: ${(p) => p.theme?.colors?.text?.primary ?? "#1f2937"};
`;

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  const theme = useTheme() as Theme | undefined;
  return (
    <StyledCard theme={theme ?? ({} as Theme)} className={className}>
      {children}
    </StyledCard>
  );
}
