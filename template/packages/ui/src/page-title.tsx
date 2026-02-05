import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "./theme-types";

const StyledPageTitle = styled.h1<{ theme: Theme }>`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${(p) => p.theme?.colors?.text?.primary ?? "#1f2937"};
  text-align: center;
  font-weight: ${(p) => p.theme?.typography?.fontWeight?.bold ?? "700"};
`;

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  const theme = useTheme() as Theme | undefined;
  return (
    <StyledPageTitle theme={theme ?? ({} as Theme)} className={className}>
      {children}
    </StyledPageTitle>
  );
}
