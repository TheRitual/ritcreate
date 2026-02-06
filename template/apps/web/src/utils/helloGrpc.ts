import {
  HelloClientImpl,
  GrpcWebImpl,
  type HelloResponse,
} from "@repo/protos/generated-web/hello";

function getGrpcHost(): string {
  if (import.meta.env.VITE_GRPC_WEB_URL) {
    return import.meta.env.VITE_GRPC_WEB_URL as string;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/grpc`;
  }
  return "/grpc";
}

const rpc = new GrpcWebImpl(getGrpcHost(), {});
const client = new HelloClientImpl(rpc);

export interface GetHelloMessageResult {
  message: string;
}

export async function getHelloMessage(
  name?: string,
): Promise<GetHelloMessageResult> {
  const response: HelloResponse = await client.SayHello({ name: name ?? "" });
  return { message: response.message };
}

export interface GetAddResult {
  sum: number;
}

export async function getAdd(a: number, b: number): Promise<GetAddResult> {
  const response = await client.Add({ a, b });
  return { sum: response.sum ?? 0 };
}
