#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiDir = join(__dirname, "..");

function run(name, args, opts) {
  return new Promise((resolve, reject) => {
    const proc = spawn(name, args, { cwd: apiDir, stdio: "inherit", shell: false });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${name} exited ${code}`))));
    proc.on("error", reject);
  });
}

async function main() {
  if (!existsSync(join(apiDir, "dist", "apps", "api", "src", "main.js"))) {
    await run("npx", ["nest", "build"]);
  }
  const envFile = join(apiDir, "..", "..", ".env");
  const args = [...(existsSync(envFile) ? ["--env-file=" + envFile] : []), "app.js"];
  const child = spawn(process.execPath, args, { cwd: apiDir, stdio: "inherit", shell: false });
  child.on("close", (code) => process.exit(code ?? 1));
  child.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
