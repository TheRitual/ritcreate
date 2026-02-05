import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { Header } from "./components/Layout/Header";
import { Footer } from "./components/Layout/Footer";
import { GlobalStyles } from "./styles/GlobalStyles";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import styled from "@emotion/styled";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartProvider>
          <GlobalStyles />
          <Router>
            <AppContainer>
              <Header />
              <Main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </Main>
              <Footer />
            </AppContainer>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
