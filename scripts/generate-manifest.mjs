#!/usr/bin/env node

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const templateDir = join(root, "template");
const libDir = join(root, "lib");

const IGNORED = new Set(["node_modules", "dist", ".turbo", ".git", "package-lock.json"]);

function collectFiles(dir, base) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (IGNORED.has(entry)) continue;
    const fullPath = join(dir, entry);
    const relPath = join(base, entry);
    if (statSync(fullPath).isDirectory()) {
      results.push(...collectFiles(fullPath, relPath));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

const rootFiles = ["create-project.mjs", "jsr.json", "package.json"];
const libFiles = collectFiles(libDir, "lib").sort();
const templateFiles = collectFiles(templateDir, "template").sort();

const allFiles = [...rootFiles, ...libFiles, ...templateFiles];
const manifestPath = join(root, "template-manifest.json");
writeFileSync(manifestPath, JSON.stringify(allFiles, null, 2) + "\n", "utf-8");

console.log(
  `Generated template-manifest.json with ${allFiles.length} files (${rootFiles.length} root, ${libFiles.length} lib, ${templateFiles.length} template).`
);
