import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  platform: "node",
  clean: true,
  sourcemap: true,
  dts: true,
  bundle: true,
  splitting: false,
  external: ["chalk"],
});
