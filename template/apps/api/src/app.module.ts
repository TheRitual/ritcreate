import { Module } from "@nestjs/common";
import { HealthController } from "./health/health.controller.js";
import { HelloController } from "./hello/hello.controller.js";

@Module({
  imports: [],
  controllers: [HealthController, HelloController],
})
export class AppModule {}
