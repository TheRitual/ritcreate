import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const Container = styled.footer`
  margin-top: auto;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  h3,
  h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
  ul {
    list-style: none;
  }
  a {
    color: inherit;
    opacity: 0.9;
  }
  a:hover {
    opacity: 1;
  }
`;

const Bottom = styled.div`
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  opacity: 0.9;
`;

export function Footer() {
  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <Section>
          <h3>Dziki Kisz</h3>
          <p>{t("footer.tagline")}</p>
        </Section>
        <Section>
          <h4>{t("footer.quickLinks")}</h4>
          <ul>
            <li>
              <a href="/">{t("navigation.home")}</a>
            </li>
            <li>
              <a href="/products">{t("navigation.products")}</a>
            </li>
            <li>
              <a href="/about">{t("navigation.about")}</a>
            </li>
            <li>
              <a href="/contact">{t("navigation.contact")}</a>
            </li>
          </ul>
        </Section>
        <Section>
          <h4>{t("footer.contactInfo")}</h4>
          <p>Email: info{{SCOPE}}.com</p>
        </Section>
      </Content>
      <Bottom>
        <p>{t("footer.allRightsReserved")}</p>
      </Bottom>
    </Container>
  );
}
