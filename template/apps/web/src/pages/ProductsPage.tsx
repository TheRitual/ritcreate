import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageTitle } from "@repo/ui/page-title";
import { Input } from "@repo/ui/input";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { productApi } from "../utils/api";
import type { Product } from "../types";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Search = styled.div`
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    productApi
      .getAll({ search: search || undefined })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <Wrapper>
      <PageTitle>{t("products.title")}</PageTitle>
      <Search>
        <Input
          placeholder={t("products.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Search>
      {loading && <p>{t("common.loading")}</p>}
      {!loading && products.length === 0 && (
        <p>{t("products.noProductsFound")}</p>
      )}
      {!loading && products.length > 0 && (
        <Grid>
          {products.map((p) => (
            <ProductCard key={p.id}>
              <h3>{p.name}</h3>
              <p style={{ flex: 1, fontSize: "0.9rem" }}>
                {p.description?.slice(0, 80)}…
              </p>
              <p>
                {t("common.price")}: ${p.price.toFixed(2)}
              </p>
              <Link to={`/products/${p.id}`}>
                <Button variant="outline" size="sm" fullWidth>
                  {t("common.viewDetails")}
                </Button>
              </Link>
            </ProductCard>
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}
