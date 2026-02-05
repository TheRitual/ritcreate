import { Button } from "@repo/ui/button";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

export function ExampleComponent() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <p style={{ marginBottom: "1rem" }}>{t("example.description")}</p>
      <Button type="button" onClick={() => window.alert(t("example.clicked"))}>
        {t("example.button")}
      </Button>
    </Wrapper>
  );
}
