import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useCart } from "../context/CartContext";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Empty = styled(Card)`
  text-align: center;
  padding: 3rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export function CartPage() {
  const { t } = useTranslation();
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <Wrapper>
        <PageTitle>{t("cart.title")}</PageTitle>
        <Empty>
          <h3>{t("cart.emptyTitle")}</h3>
          <p>{t("cart.emptyText")}</p>
          <Link to="/products">
            <Button style={{ marginTop: "1rem" }}>
              {t("cart.continueShopping")}
            </Button>
          </Link>
        </Empty>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageTitle>{t("cart.title")}</PageTitle>
      <Card>
        {cart.items.map((item) => (
          <Row key={item.product.id}>
            <div>
              <strong>{item.product.name}</strong>
              <span style={{ marginLeft: "0.5rem" }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity - 1)
                }
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
              >
                +
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromCart(item.product.id)}
              >
                {t("cart.remove")}
              </Button>
            </div>
          </Row>
        ))}
        <Row>
          <strong>{t("cart.total")}</strong>
          <strong>${cart.total.toFixed(2)}</strong>
        </Row>
        <Actions>
          <Link to="/products">
            <Button variant="outline">{t("cart.continueShopping")}</Button>
          </Link>
          <Button>{t("cart.checkout")}</Button>
        </Actions>
      </Card>
    </Wrapper>
  );
}
