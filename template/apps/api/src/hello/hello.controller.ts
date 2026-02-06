import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import type {
  AddRequest,
  AddResponse,
  HelloRequest,
  HelloResponse,
} from "@repo/protos/generated/hello";

function GrpcHelloSayHello(): MethodDecorator {
  return GrpcMethod("Hello", "SayHello") as MethodDecorator;
}

function GrpcHelloAdd(): MethodDecorator {
  return GrpcMethod("Hello", "Add") as MethodDecorator;
}

@Controller()
export class HelloController {
  @GrpcHelloSayHello()
  sayHello(data: HelloRequest): HelloResponse {
    const name = data.name?.trim();
    const message = name ? `Hello ${name}` : "Hello World";
    return { message };
  }

  @GrpcHelloAdd()
  add(data: AddRequest): AddResponse {
    const a = Number(data.a) || 0;
    const b = Number(data.b) || 0;
    return { sum: a + b };
  }
}
