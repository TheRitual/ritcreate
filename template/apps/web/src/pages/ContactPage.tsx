import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Textarea } from "@repo/ui/textarea";
import { FormGroup } from "@repo/ui/form-group";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const StyledInput = Input;
const StyledTextarea = Textarea;

export function ContactPage() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <Wrapper>
        <PageTitle>{t("contact.title")}</PageTitle>
        <Card>
          <p>{t("contact.thankYouMessage")}</p>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageTitle>{t("contact.title")}</PageTitle>
      <Card>
        <h3>{t("contact.getInTouch")}</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup label={t("common.name")}>
            <StyledInput type="text" name="name" required />
          </FormGroup>
          <FormGroup label={t("common.email")}>
            <StyledInput type="email" name="email" required />
          </FormGroup>
          <FormGroup label={t("common.subject")}>
            <StyledInput type="text" name="subject" />
          </FormGroup>
          <FormGroup label={t("common.message")}>
            <StyledTextarea name="message" rows={5} />
          </FormGroup>
          <Button type="submit">{t("common.sendMessage")}</Button>
        </form>
      </Card>
    </Wrapper>
  );
}
