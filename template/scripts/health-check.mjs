import { createConnection } from "node:net";
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

const apiPort = Number(process.env["PORT"]) || 4000;
const grpcHealthPort = Number(process.env["GRPC_HEALTH_PORT"]) || 50051;
const baseUrl = process.env["API_BASE_URL"] || `http://127.0.0.1:${apiPort}`;
const grpcHost = process.env["GRPC_HEALTH_HOST"] || "127.0.0.1";

function log(msg, isErr = false) {
  const out = isErr ? process.stderr : process.stdout;
  out.write(msg + "\n");
}

function checkTcp(host, port) {
  return new Promise((resolvePromise) => {
    const socket = createConnection(
      { host, port },
      () => {
        socket.destroy();
        resolvePromise(true);
      }
    );
    socket.setTimeout(2000);
    socket.on("error", () => resolvePromise(false));
    socket.on("timeout", () => {
      socket.destroy();
      resolvePromise(false);
    });
  });
}

function checkHttp(url) {
  return new Promise((resolvePromise) => {
    const parsed = new URL(url);
    const get = parsed.protocol === "https:" ? httpsGet : httpGet;
    const req = get(url, { timeout: 5000 }, (res) => {
      res.resume();
      resolvePromise(res.statusCode === 200);
    });
    req.on("error", () => resolvePromise(false));
    req.on("timeout", () => {
      req.destroy();
      resolvePromise(false);
    });
  });
}

async function checkGrpcHealth() {
  const protoPath = join(root, "packages", "protos", "proto", "health.proto");
  try {
    const packageDefinition = loadSync(protoPath, { keepCase: true });
    const pkg = loadPackageDefinition(packageDefinition);
    const client = new pkg.health.Health(
      `${grpcHost}:${grpcHealthPort}`,
      credentials.createInsecure()
    );
    return new Promise((resolvePromise) => {
      const deadline = new Date();
      deadline.setSeconds(deadline.getSeconds() + 3);
      client.check(
        { service: "" },
        { deadline: deadline.getTime() },
        (err, response) => {
          if (err) {
            resolvePromise(false);
            return;
          }
          resolvePromise(response?.status === 1);
        }
      );
    });
  } catch (e) {
    log("gRPC health check failed (load/call): " + (e?.message ?? e), true);
    return false;
  }
}

async function main() {
  let failed = false;

  const tcpOk = await checkTcp(grpcHost, grpcHealthPort);
  if (!tcpOk) {
    log(`gRPC port ${grpcHealthPort} not reachable`);
    failed = true;
  } else {
    log(`gRPC port ${grpcHealthPort} reachable`);
  }

  const httpOk = await checkHttp(`${baseUrl}/health`);
  if (!httpOk) {
    log(`HTTP /health not OK: ${baseUrl}/health`);
    failed = true;
  } else {
    log("HTTP /health OK");
  }

  const grpcOk = await checkGrpcHealth();
  if (!grpcOk) {
    log("gRPC Health.Check not OK");
    failed = true;
  } else {
    log("gRPC Health.Check OK");
  }

  process.exit(failed ? 1 : 0);
}

main();
