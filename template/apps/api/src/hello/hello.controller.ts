import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type { HelloRequest, HelloResponse } from "@repo/protos/generated/hello";

function GrpcHelloSayHello(): MethodDecorator {
  return GrpcMethod("Hello", "SayHello") as MethodDecorator;
}

@Controller()
export class HelloController {
  @GrpcHelloSayHello()
  sayHello(data: HelloRequest): HelloResponse {
    const name = data.name?.trim();
    const message = name ? `Hello ${name}` : "Hello World";
    return { message };
  }
}
