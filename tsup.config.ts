import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  platform: "browser",
  external: ["solid-js", "@tanstack/hotkeys"],
  treeshake: true,
});
