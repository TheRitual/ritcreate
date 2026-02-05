import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { FormGroup } from "@repo/ui/form-group";
import { Card } from "@repo/ui/card";
import { PageTitle } from "@repo/ui/page-title";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

export function AdminPage() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, login, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
    } catch {
      setError(t("auth.loginError"));
    }
  };

  if (isLoading) {
    return <p>{t("common.loading")}</p>;
  }

  if (!isAuthenticated) {
    return (
      <Wrapper>
        <PageTitle>{t("auth.login")}</PageTitle>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormGroup label={t("common.email")}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup label={t("auth.password")}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            {error && (
              <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
            )}
            <Button type="submit">{t("auth.login")}</Button>
          </form>
        </Card>
      </Wrapper>
    );
  }

  if (!isAdmin) {
    return (
      <Wrapper>
        <Card>
          <p>{t("auth.adminPanel")} – access only for admins.</p>
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageTitle>{t("auth.adminPanel")}</PageTitle>
      <Card>
        <p>
          Admin panel content (translations, products, etc.) can be added here.
        </p>
      </Card>
    </Wrapper>
  );
}
