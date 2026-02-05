import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useThemeMode } from "../../context/ThemeContext";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { Logo } from "../Logo";
import { Button } from "@repo/ui/button";
import styled from "@emotion/styled";

const HeaderStyled = styled.header`
  background: rgba(220, 38, 38, 0.9);
  backdrop-filter: blur(20px);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: white;
  font-weight: 500;
  &:hover {
    opacity: 0.9;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
`;

const CartLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  color: white;
  font-weight: 600;
  text-decoration: none;
`;

export function Header() {
  const { t } = useTranslation();
  const { cart } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <HeaderStyled>
      <Container>
        <Logo />
        <Nav>
          <StyledLink to="/">{t("navigation.home")}</StyledLink>
          <StyledLink to="/products">{t("navigation.products")}</StyledLink>
          <StyledLink to="/about">{t("navigation.about")}</StyledLink>
          <StyledLink to="/contact">{t("navigation.contact")}</StyledLink>
        </Nav>
        <Right>
          <ThemeBtn
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {mode === "light" ? "🌙" : "☀️"}
          </ThemeBtn>
          <LanguageSwitcher />
          {isAuthenticated && (
            <>
              <span style={{ color: "white" }}>
                {t("auth.welcome")}, {user?.firstName ?? user?.email}!
              </span>
              {isAdmin && (
                <StyledLink to="/admin">{t("auth.adminPanel")}</StyledLink>
              )}
              <Button
                variant="outline"
                size="sm"
                round
                onClick={() => logout()}
              >
                {t("auth.logout")}
              </Button>
            </>
          )}
          <CartLink to="/cart">
            <span>{cart.itemCount}</span>
            <span>${cart.total.toFixed(2)}</span>
          </CartLink>
        </Right>
      </Container>
    </HeaderStyled>
  );
}
