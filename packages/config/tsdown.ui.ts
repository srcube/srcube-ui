import { defineConfig } from "tsdown";

type CopyEntry = {
  from: string;
  to?: string;
  flatten?: boolean;
};

type UIBuildOptions = {
  miniEntries?: Record<string, string>;
  miniCopy?: CopyEntry[];
  miniAlias?: Record<string, string>;
};

export function createUIBuildConfig(options: UIBuildOptions = {}) {
  const { miniEntries = {}, miniCopy = [], miniAlias = {} } = options;

  return defineConfig([
    {
      entry: {
        index: "src/index.ts",
        style: "src/style.ts",
        "react/index": "src/react/index.tsx",
      },
      dts: { build: true },
      sourcemap: true,
      fixedExtension: false,
    },
    {
      entry: {
        index: "src/mini/index.ts",
        ...miniEntries,
      },
      outDir: "dist/mini",
      alias: {
        "@srcube-ui/theme/tv": "@srcube-ui/theme/tv-mini",
        ...miniAlias,
      },
      plugins: [{
        name: "srcube-mini-tv-alias",
        resolveId(source) {
          if (source === "@srcube-ui/theme/tv") {
            return { id: "@srcube-ui/theme/tv-mini", external: true };
          }
          return null;
        },
      }],
      noExternal: ["@srcube-ui/theme/tv"],
      dts: { build: true },
      sourcemap: true,
      fixedExtension: false,
      copy: [
        {
          from: "src/mini/index.{wxml,wxss,json,wxs}",
          to: "dist/mini",
          flatten: true,
        },
        ...miniCopy,
      ],
    },
  ]);
}
