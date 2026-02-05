import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = join(__dirname, "dist");
const port = Number(process.env.PORT) || 3000;

const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};

createServer(async (req, res) => {
  const pathname = req.url?.split("?")[0] ?? "/";
  const pathSegments =
    pathname === "/"
      ? ["index.html"]
      : pathname.slice(1).split("/").filter(Boolean);
  const safePath = join(distDir, ...pathSegments);
  if (!safePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const content = await readFile(safePath);
    const ext = extname(safePath);
    res.setHeader("Content-Type", mime[ext] ?? "application/octet-stream");
    res.end(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      try {
        const index = await readFile(join(distDir, "index.html"));
        res.setHeader("Content-Type", "text/html");
        res.end(index);
      } catch {
        res.writeHead(404);
        res.end();
      }
    } else {
      res.writeHead(500);
      res.end();
    }
  }
}).listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
