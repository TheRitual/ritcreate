import { existsSync } from "node:fs";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { AppModule } from "./app.module.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const distProtoDir = join(__dirname, "proto");
const monorepoProtoDir = join(__dirname, "..", "..", "..", "packages", "protos", "proto");
const protoDir = existsSync(join(distProtoDir, "health.proto"))
  ? distProtoDir
  : monorepoProtoDir;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  const grpcHealthPort = Number(process.env["GRPC_HEALTH_PORT"]) || 50051;
  const grpcHelloPort = Number(process.env["GRPC_HELLO_PORT"]) || 50052;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "health",
      protoPath: join(protoDir, "health.proto"),
      url: `0.0.0.0:${grpcHealthPort}`,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "hello",
      protoPath: join(protoDir, "hello.proto"),
      url: `0.0.0.0:${grpcHelloPort}`,
    },
  });
  await app.startAllMicroservices();
  const port = Number(process.env["PORT"]) || 4000;
  await app.listen(port, "0.0.0.0");
}

bootstrap();
