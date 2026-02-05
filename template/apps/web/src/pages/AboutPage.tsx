import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Card } from "@repo/ui/card";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Section = styled(Card)`
  margin-bottom: 1.5rem;
`;

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <PageTitle>{t("about.title")}</PageTitle>
      <Section>
        <h3>{t("about.ourStory")}</h3>
        <p>{t("about.ourStoryText")}</p>
      </Section>
      <Section>
        <h3>{t("about.ourMission")}</h3>
        <p>{t("about.ourMissionText")}</p>
      </Section>
      <Section>
        <h3>{t("about.ourProducts")}</h3>
        <p>{t("about.ourProductsText")}</p>
      </Section>
      <Section>
        <h3>{t("about.qualityPromise")}</h3>
        <p>{t("about.title")}</p>
      </Section>
    </Wrapper>
  );
}
