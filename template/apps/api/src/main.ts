import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { AppModule } from "./app.module.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const protoPath = join(__dirname, "proto", "health.proto");
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: "health",
      protoPath,
      url: "0.0.0.0:50051",
    },
  });
  await app.startAllMicroservices();
  const port = Number(process.env["PORT"]) || 4000;
  await app.listen(port);
}

bootstrap();
