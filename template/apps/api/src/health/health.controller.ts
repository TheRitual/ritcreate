import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type {
  HealthCheckRequest,
  HealthCheckResponse,
} from "@repo/protos/generated";

function GrpcHealthCheck(): MethodDecorator {
  return GrpcMethod("Health", "Check") as MethodDecorator;
}

@Controller()
export class HealthController {
  @GrpcHealthCheck()
  check(_data: HealthCheckRequest): HealthCheckResponse {
    return { status: 1 };
  }
}
