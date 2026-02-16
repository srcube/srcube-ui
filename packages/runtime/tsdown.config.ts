import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    react: 'src/react/index.ts',
    mini: 'src/mini/index.ts',
  },
  dts: true,
  sourcemap: true,
  fixedExtension: false,
});
