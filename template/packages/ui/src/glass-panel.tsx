import styled from "@emotion/styled";
import type { Theme } from "./theme-types";

export const GlassPanel = styled.div<{ theme?: Theme }>`
  background: ${(p) => p.theme?.colors?.glass?.medium ?? "rgba(255,255,255,0.5)"};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${(p) => p.theme?.borderRadius?.xl ?? "1rem"};
  box-shadow: ${(p) => p.theme?.shadows?.glass ?? "0 8px 32px rgba(0,0,0,0.1)"};
  padding: 1.5rem 2rem;
  border: 1px solid ${(p) => p.theme?.colors?.glass?.light ?? "rgba(255,255,255,0.4)"};
`;
