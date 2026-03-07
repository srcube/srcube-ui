import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    '*': 'src/components/*/index.ts',
    '_shared/*': 'src/shared/*.ts',
  },
  skipNodeModulesBundle: true,
  splitting: false,
  dts: true,
  sourcemap: false,
  fixedExtension: false,
});
