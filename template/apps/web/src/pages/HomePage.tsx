import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { GlassPanel } from "@repo/ui/glass-panel";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import type { Theme } from "@repo/ui/theme-types";
import { getHelloMessage } from "../utils/helloGrpc.js";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  min-width: 20rem;
`;

const Message = styled.p<{ theme?: Theme }>`
  color: ${(p) => p.theme?.colors?.text?.primary ?? "#18181b"};
  font-size: 1rem;
`;

const ErrorMessage = styled.p<{ theme?: Theme }>`
  color: ${(p) => p.theme?.colors?.accent?.[500] ?? "#e091ad"};
  font-size: 0.9375rem;
`;

type GrpcState = "idle" | "loading" | "success" | "error";

export function HomePage() {
  const theme = useTheme() as Theme | undefined;
  const [name, setName] = useState<string>("Developer");
  const [grpcState, setGrpcState] = useState<GrpcState>("idle");
  const [grpcMessage, setGrpcMessage] = useState<string>("");
  const [grpcError, setGrpcError] = useState<string>("");

  const fetchGrpcMessage = () => {
    setGrpcState("loading");
    setGrpcError("");
    setGrpcMessage("");
    getHelloMessage(name)
      .then((res) => {
        setGrpcMessage(res.message);
        setGrpcState("success");
      })
      .catch((err) => {
        setGrpcError(err instanceof Error ? err.message : String(err));
        setGrpcState("error");
      });
  };

  return (
    <GlassPanel>
      <Wrapper>
        <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        disabled={grpcState === "loading"}
      />
      <Button
        variant="primary"
        onClick={fetchGrpcMessage}
        disabled={grpcState === "loading"}
      >
        {grpcState === "loading" ? "Loading…" : "Fetch gRPC message"}
      </Button>
      {grpcState === "success" && grpcMessage && (
        <Message theme={theme}>{grpcMessage}</Message>
      )}
      {grpcState === "error" && (
        <ErrorMessage theme={theme}>
          gRPC: {grpcError}
        </ErrorMessage>
      )}
      </Wrapper>
    </GlassPanel>
  );
}
