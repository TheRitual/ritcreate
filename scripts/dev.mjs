#!/usr/bin/env node

import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const createScript = join(root, "create-project.mjs");
const devProjectPath = join(root, ".ritcreate-dev");

const node = process.execPath;

function run(name, args, opts) {
  return new Promise((resolve, reject) => {
    const proc = spawn(name, args, {
      ...opts,
      stdio: "inherit",
      shell: false,
    });
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`${name} exited ${code}`))));
    proc.on("error", reject);
  });
}

async function main() {
  const hasProject = existsSync(join(devProjectPath, "package.json"));

  if (!hasProject) {
    console.log("Creating project with --yes into .ritcreate-dev...\n");
    await run(node, [createScript, "ritcreate-dev", devProjectPath, "--yes"], { cwd: root });
  } else {
    console.log("Using existing .ritcreate-dev. Starting dev stack...\n");
  }

  console.log("Starting full dev stack (Docker + API + Web). Press Ctrl+C to stop.\n");
  await run("npm", ["run", "dev"], { cwd: devProjectPath });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
