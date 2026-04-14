import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bin/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  platform: "node",
  clean: true,
  sourcemap: true,
  dts: false,
  bundle: true,
  splitting: false,
  external: [
    "commander",
    "prompts",
    "@buaich/cli-service",
    "@buaich/cli-shared-utils",
  ],
  esbuildOptions(options) {
    options.banner = {
      js: "#!/usr/bin/env node\n",
    };
  },
});
