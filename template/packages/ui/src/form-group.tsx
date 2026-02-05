import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "./theme-types";

const StyledFormGroup = styled.div<{ theme: Theme }>`
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: ${(p) => p.theme?.typography?.fontWeight?.bold ?? "700"};
    color: ${(p) => p.theme?.colors?.text?.primary ?? "#1f2937"};
  }
`;

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormGroup({
  label,
  htmlFor,
  children,
  className,
}: FormGroupProps) {
  const theme = useTheme() as Theme | undefined;
  return (
    <StyledFormGroup theme={theme ?? ({} as Theme)} className={className}>
      {label != null && <label htmlFor={htmlFor}>{label}</label>}
      {children}
    </StyledFormGroup>
  );
}
