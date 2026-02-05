import { defineConfig } from "vitest/config";
import base from "@repo/typescript-config/base.json";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: base.compilerOptions?.paths as Record<string, string[]>,
  },
});
