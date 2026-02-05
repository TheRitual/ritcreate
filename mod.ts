import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const args =
  typeof Deno !== "undefined"
    ? Deno.args
    : typeof process !== "undefined"
      ? process.argv.slice(2)
      : [];

const projectName = args[0]?.trim();
if (!projectName) {
  console.error("Usage: ritcreate <monorepo-name> [directory]");
  console.error("  monorepo-name  Project/repository name (e.g. new-project)");
  console.error(
    "  directory      Optional output path (default: ./<monorepo-name>)",
  );
  (typeof Deno !== "undefined" ? Deno.exit(1) : process.exit(1)) as never;
}

const cwd =
  typeof Deno !== "undefined"
    ? Deno.cwd()
    : typeof process !== "undefined"
      ? process.cwd()
      : ".";

const defaultDir =
  args[1]?.trim() ? resolve(cwd, args[1]) : resolve(cwd, projectName);

const isFileUrl =
  typeof import.meta.url === "string" && import.meta.url.startsWith("file:");

if (isFileUrl && typeof process !== "undefined") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const scriptPath = resolve(__dirname, "create-project.mjs");
  const { spawn } = await import("node:child_process");
  const child = spawn("node", [scriptPath, projectName, defaultDir], {
    stdio: "inherit",
    shell: false,
    cwd: process.cwd(),
  });
  child.on("close", (code) => {
    process.exit(code ?? 1);
  });
  child.on("error", (err) => {
    console.error("Failed to run create script:", err.message);
    process.exit(1);
  });
} else {
  if (typeof Deno === "undefined") {
    console.error(
      "Running from a non-file URL is only supported in Deno. Use: npx jsr:@ritual/ritcreate",
    );
    process.exit(1);
  }
  const baseUrl = new URL(".", import.meta.url).href;
  const tmp = await Deno.makeTempDir({ prefix: "ritual-create-" });
  try {
    const mjsRes = await fetch(new URL("create-project.mjs", baseUrl).href);
    if (!mjsRes.ok) {
      throw new Error(`Failed to fetch create-project.mjs: ${mjsRes.status}`);
    }
    await Deno.writeTextFile(
      resolve(tmp, "create-project.mjs"),
      await mjsRes.text(),
    );
    const manifestRes = await fetch(
      new URL("template-manifest.json", baseUrl).href,
    );
    if (!manifestRes.ok) {
      throw new Error(
        `Failed to fetch template-manifest.json: ${manifestRes.status}`,
      );
    }
    const manifest: string[] = await manifestRes.json();
    for (const rel of manifest) {
      const fileUrl = new URL(rel, baseUrl).href;
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) continue;
      const outPath = resolve(tmp, rel);
      await Deno.mkdir(dirname(outPath), { recursive: true });
      const buf = await fileRes.arrayBuffer();
      await Deno.writeFile(outPath, new Uint8Array(buf));
    }
    const cmd = new Deno.Command("node", {
      args: ["create-project.mjs", projectName, defaultDir],
      cwd: tmp,
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });
    const status = await cmd.spawn().status;
    (status.success ? Deno.exit(0) : Deno.exit(status.code ?? 1)) as never;
  } finally {
    await Deno.remove(tmp, { recursive: true }).catch(() => {});
  }
}
