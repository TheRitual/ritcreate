import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type {
  HealthCheckRequest,
  HealthCheckResponse,
} from "@repo/protos/generated";

@Controller()
export class HealthController {
  // @ts-expect-error Nest GrpcMethod decorator type mismatch with TS 5
  @GrpcMethod("Health", "Check")
  check(_data: HealthCheckRequest): HealthCheckResponse {
    return { status: 1 };
  }
}
