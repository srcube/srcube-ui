import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    style: "src/style.ts",
    tv: "src/tv.ts",
    "tv-mini": "src/tv-mini.ts",
    "tv-web": "src/tv-web.ts",
  },
  css: {
    splitting: false,
    fileName: "index.css",
  },
  dts: true,
  sourcemap: true,
  fixedExtension: false,
});
