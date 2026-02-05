import { ThemeContextProvider } from "./context/ThemeContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import { HomePage } from "./pages/HomePage";
import styled from "@emotion/styled";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

function App() {
  return (
    <ThemeContextProvider>
      <GlobalStyles />
      <AppContainer>
        <HomePage />
      </AppContainer>
    </ThemeContextProvider>
  );
}

export default App;
