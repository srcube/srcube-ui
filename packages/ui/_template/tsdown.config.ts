import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    style: 'src/style.ts',
    'mini/index': 'src/mini/index.ts',
    'react/index': 'src/react/index.tsx',
  },
  dts: true,
  sourcemap: true,
  fixedExtension: false,
});
