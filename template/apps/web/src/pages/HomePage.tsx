import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

export function HomePage() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <PageTitle>{t("home.title")}</PageTitle>
      <Subtitle>{t("home.subtitle")}</Subtitle>
      <Card>
        <p style={{ marginBottom: "1rem" }}>{t("home.featuredProducts")}</p>
        <Actions>
          <Link to="/products">
            <Button>{t("home.shopNow")}</Button>
          </Link>
        </Actions>
      </Card>
    </Wrapper>
  );
}
