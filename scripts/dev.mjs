#!/usr/bin/env node

import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, rmSync } from "node:fs";
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

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  if (existsSync(devProjectPath)) {
    console.log("Removing existing .ritcreate-dev...\n");
    rmSync(devProjectPath, { recursive: true });
  }

  console.log("Creating project with --yes into .ritcreate-dev...\n");
  await run(node, [createScript, "ritcreate-dev", devProjectPath, "--yes"], { cwd: root });

  const turboCache = join(devProjectPath, "node_modules", ".cache", "turbo");
  if (existsSync(turboCache)) {
    rmSync(turboCache, { recursive: true });
  }
  console.log("\nBuilding project (so dist/ exists before dev)...\n");
  await run("npm", ["run", "build"], { cwd: devProjectPath });

  console.log("\nStarting dev stack in 3 seconds...");
  await delay(3000);

  if (existsSync(turboCache)) {
    rmSync(turboCache, { recursive: true });
  }
  console.log("\nStarting full dev stack. Press Ctrl+C to stop.\n");
  await run("npm", ["run", "dev"], { cwd: devProjectPath });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
