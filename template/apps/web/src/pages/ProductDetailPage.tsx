import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { productApi } from "../utils/api";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productApi
      .getById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !product) {
    return <p>{t("common.loading")}</p>;
  }

  const handleAdd = () => {
    addToCart(product, 1);
  };

  return (
    <Wrapper>
      <PageTitle>{product.name}</PageTitle>
      <Card>
        <p>{product.description}</p>
        <p>
          {t("common.price")}: ${product.price.toFixed(2)}
        </p>
        <p>
          {t("productDetail.spiceLevelOutOf", {
            level: product.spiceLevel ?? 0,
          })}
        </p>
        {product.inStock !== false ? (
          <Button onClick={handleAdd}>{t("common.addToCart")}</Button>
        ) : (
          <p>{t("productDetail.thisProductOutOfStock")}</p>
        )}
      </Card>
    </Wrapper>
  );
}
