import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");
const jsrJsonPath = resolve(process.cwd(), "jsr.json");

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const jsrJson = JSON.parse(readFileSync(jsrJsonPath, "utf-8"));

jsrJson.version = packageJson.version;

writeFileSync(jsrJsonPath, JSON.stringify(jsrJson, null, 2) + "\n", "utf-8");

console.log(`Updated jsr.json version to ${packageJson.version}`);
