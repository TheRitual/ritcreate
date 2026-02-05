import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1.75rem;
`;

const Text = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

export function Logo() {
  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <Container>
        <Icon>🐗</Icon>
        <Text>DzikiKisz</Text>
      </Container>
    </Link>
  );
}
