import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node18",
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  esbuildOptions(options) {
    options.banner = {
      js: "#!/usr/bin/env node",
    };
  },
});
