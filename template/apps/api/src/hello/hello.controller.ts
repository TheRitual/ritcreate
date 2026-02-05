import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type { HelloRequest, HelloResponse } from "@repo/protos/generated/hello";

@Controller()
export class HelloController {
  @GrpcMethod("Hello", "SayHello")
  sayHello(data: HelloRequest): HelloResponse {
    const name = data.name?.trim();
    const message = name ? `Hello ${name}` : "Hello World";
    return { message };
  }
}
