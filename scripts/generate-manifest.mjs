#!/usr/bin/env node

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const templateDir = join(root, "template");

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

const files = collectFiles(templateDir, "template").sort();
const manifestPath = join(root, "template-manifest.json");
writeFileSync(manifestPath, JSON.stringify(files, null, 2) + "\n", "utf-8");

console.log(`Generated template-manifest.json with ${files.length} files.`);
