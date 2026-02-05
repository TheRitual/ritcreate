import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const protoDir = path.join(root, "proto");
const outDir = path.join(root, "generated");

const protoc = path.join(root, "node_modules", "grpc-tools", "bin", "grpc_tools_node_protoc");

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

const plugin = path.join(root, "node_modules", ".bin", "protoc-gen-ts_proto");
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
const indexLines = baseNames.map((b) => `export * from "./${b}.js";`).join("\n");
fs.writeFileSync(path.join(outDir, "index.ts"), indexLines + "\n");
