import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LangButton = styled.button<{ active: boolean }>`
  background: ${(p) => (p.active ? "rgba(255,255,255,0.3)" : "transparent")};
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
`;

const LANGUAGES = ["en", "pl"] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) ?? "en";

  return (
    <Wrapper>
      {LANGUAGES.map((lng) => (
        <LangButton
          key={lng}
          type="button"
          active={current === lng}
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
        </LangButton>
      ))}
    </Wrapper>
  );
}
