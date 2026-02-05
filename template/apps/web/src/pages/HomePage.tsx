import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { ExampleComponent } from "../components/ExampleComponent";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export function HomePage() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <PageTitle>{t("home.title")}</PageTitle>
      <ExampleComponent />
    </Wrapper>
  );
}
