import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(root, "../..");
const protoDir = path.join(root, "proto");
const outDir = path.join(root, "generated");

const protocFromRoot = path.join(root, "node_modules", ".bin", "grpc_tools_node_protoc");
const protocFromWorkspace = path.join(workspaceRoot, "node_modules", ".bin", "grpc_tools_node_protoc");
const protoc = fs.existsSync(protocFromRoot) ? protocFromRoot : protocFromWorkspace;

if (!fs.existsSync(protoDir)) {
  console.error("Proto directory not found:", protoDir);
  process.exit(1);
}

const protoFiles = fs.readdirSync(protoDir).filter((f) => f.endsWith(".proto"));
if (protoFiles.length === 0) {
  console.error("No .proto files in", protoDir);
  process.exit(1);
}

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(protoc)) {
  if (!fs.existsSync(path.join(outDir, "index.ts"))) {
    fs.writeFileSync(path.join(outDir, "index.ts"), 'export * from "./health.js";\n');
  }
  process.exit(0);
}

const pluginRoot = fs.existsSync(path.join(root, "node_modules", ".bin", "protoc-gen-ts_proto")) ? root : workspaceRoot;
const plugin = path.join(pluginRoot, "node_modules", ".bin", "protoc-gen-ts_proto");
const protoPaths = protoFiles.map((f) => path.join(protoDir, f));
const pluginPath = process.platform === "win32" ? plugin + ".cmd" : plugin;

const args = [
  `-I${protoDir}`,
  `--plugin=protoc-gen-ts_proto=${pluginPath}`,
  `--ts_proto_out=${outDir}`,
  "--ts_proto_opt=outputServices=grpc-js,esModuleInterop=true",
  ...protoPaths,
];

try {
  execSync([protoc, ...args].join(" "), {
    stdio: "inherit",
    cwd: root,
    shell: true,
  });
} catch {
  process.exit(1);
}

const baseNames = protoFiles.map((f) => path.basename(f, ".proto"));
const indexLines =
  baseNames.length === 1
    ? baseNames.map((b) => `export * from "./${b}.js";`).join("\n")
    : baseNames.map((b) => `export * from "./${b}.js";`).join("\n");
fs.writeFileSync(path.join(outDir, "index.ts"), indexLines + "\n");

const outDirWeb = path.join(root, "generated-web");
if (!fs.existsSync(outDirWeb)) {
  fs.mkdirSync(outDirWeb, { recursive: true });
}
const argsWeb = [
  `-I${protoDir}`,
  `--plugin=protoc-gen-ts_proto=${pluginPath}`,
  `--ts_proto_out=${outDirWeb}`,
  "--ts_proto_opt=outputClientImpl=grpc-web,esModuleInterop=true",
  ...protoPaths,
];
try {
  execSync([protoc, ...argsWeb].join(" "), {
    stdio: "inherit",
    cwd: root,
    shell: true,
  });
} catch {
  process.exit(1);
}
const indexLinesWeb = baseNames.map((b) => `export * from "./${b}.js";`).join("\n");
fs.writeFileSync(path.join(outDirWeb, "index.ts"), indexLinesWeb + "\n");
