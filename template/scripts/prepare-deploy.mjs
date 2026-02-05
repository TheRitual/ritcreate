import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(import.meta.url), "..", "..");

function prepareApi() {
  const out = join(root, "deploy-api");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(root, "apps", "api", "dist"), join(out, "dist"), { recursive: true });
  cpSync(join(root, "apps", "api", "app.js"), join(out, "app.js"));
  cpSync(join(root, "apps", "api", "package.json"), join(out, "package.json"));
  cpSync(join(root, "node_modules"), join(out, "node_modules"), { recursive: true });
  mkdirSync(join(out, "node_modules", "@repo"), { recursive: true });
  rmSync(join(out, "node_modules", "@repo", "protos"), { recursive: true, force: true });
  cpSync(join(root, "packages", "protos"), join(out, "node_modules", "@repo", "protos"), {
    recursive: true,
  });
}

function prepareWeb() {
  const out = join(root, "deploy-web");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(root, "apps", "web", "dist"), join(out, "dist"), { recursive: true });
  cpSync(join(root, "apps", "web", "app.js"), join(out, "app.js"));
  const minimalPkg = {
    name: "{{SCOPE}}/web",
    type: "module",
  };
  writeFileSync(join(out, "package.json"), JSON.stringify(minimalPkg, null, 2));
}

prepareApi();
prepareWeb();
