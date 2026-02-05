#!/usr/bin/env node

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  existsSync,
  readdirSync,
  statSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { rmSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMP_DIR = join(
  process.env.TEMP || process.env.TMPDIR || "/tmp",
  "ritcreate-verify"
);

function replaceInFile(filePath, replacements) {
  let content = readFileSync(filePath, "utf-8");
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(
      new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      value
    );
  }
  writeFileSync(filePath, content, "utf-8");
}

function copyDirectory(src, dest, replacements = {}) {
  if (statSync(src).isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const entries = readdirSync(src);
    for (const entry of entries) {
      if (
        entry === "node_modules" ||
        entry === "dist" ||
        entry === ".turbo" ||
        entry === ".git"
      ) {
        continue;
      }
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);
      copyDirectory(srcPath, destPath, replacements);
    }
  } else {
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    cpSync(src, dest);
    if (Object.keys(replacements).length > 0) {
      replaceInFile(dest, replacements);
    }
  }
}

function processAllFiles(dir, replacements) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir);
  const ext = [
    ".json",
    ".ts",
    ".tsx",
    ".js",
    ".mjs",
    ".yml",
    ".yaml",
    ".md",
    ".example",
    ".proto",
    ".config.ts",
    ".config.js",
    ".sql",
  ];
  for (const entry of entries) {
    if (
      entry === "node_modules" ||
      entry === ".git" ||
      entry === ".turbo"
    ) {
      continue;
    }
    const entryPath = join(dir, entry);
    const stat = statSync(entryPath);
    if (stat.isDirectory()) {
      processAllFiles(entryPath, replacements);
    } else if (ext.some((e) => entry.endsWith(e))) {
      replaceInFile(entryPath, replacements);
    }
  }
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, stdio: "inherit", shell: false });
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`Exit ${code}`))
    );
    proc.on("error", reject);
  });
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
}

const repoName = "ritcreate-verify";
const scope = "@repo";

const replacements = {
  "{{REPO_NAME}}": toKebabCase(repoName),
  "{{REPO_NAME_PASCAL}}": toPascalCase(repoName),
  "{{REPO_NAME_SNAKE}}": toSnakeCase(repoName),
  "{{SCOPE}}": scope,
  "{{SCOPE_API}}": `${scope}/api`,
  "{{SCOPE_WEB}}": `${scope}/web`,
};

const templateDir = join(__dirname, "..", "template");

async function main() {
  console.log("Verifying template...\n");

  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true });
  }
  mkdirSync(TEMP_DIR, { recursive: true });

  console.log("Copying template with placeholders replaced...");
  copyDirectory(templateDir, TEMP_DIR, replacements);
  processAllFiles(TEMP_DIR, replacements);

  const gitignorePath = join(TEMP_DIR, ".gitignore");
  if (existsSync(gitignorePath)) {
    let gitignore = readFileSync(gitignorePath, "utf-8");
    if (!gitignore.includes("deploy-api")) {
      gitignore += "\n# Deploy directories\ndeploy-api\ndeploy-web\n";
    }
    writeFileSync(gitignorePath, gitignore);
  }

  console.log("Installing dependencies...");
  await run("npm", ["install", "--no-audit", "--loglevel=error"], TEMP_DIR);

  console.log("Running unit tests...");
  await run("npm", ["run", "test"], TEMP_DIR);

  console.log("Installing Playwright browsers...");
  await run("npx", ["playwright", "install", "chromium"], TEMP_DIR);

  console.log("Running e2e tests (Playwright will start the web app)...");
  await run("npm", ["run", "test:e2e"], TEMP_DIR);

  console.log("\nTemplate verification passed.");
  rmSync(TEMP_DIR, { recursive: true });
}

main().catch((err) => {
  console.error("\nVerification failed:", err.message);
  if (existsSync(TEMP_DIR)) {
    console.error(`Left project at ${TEMP_DIR} for inspection.`);
  }
  process.exit(1);
});
