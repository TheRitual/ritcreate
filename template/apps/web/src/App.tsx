import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContextProvider } from "./context/ThemeContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import { HomePage } from "./pages/HomePage";
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
      <GlobalStyles />
      <Router>
        <AppContainer>
          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Main>
        </AppContainer>
      </Router>
    </ThemeContextProvider>
  );
}

export default App;
