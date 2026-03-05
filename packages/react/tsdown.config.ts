import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/button/index': 'src/components/button/index.ts',
    'components/checkbox/index': 'src/components/checkbox/index.ts',
    'components/radio/index': 'src/components/radio/index.ts',
    'components/switch/index': 'src/components/switch/index.ts',
  },
  external: [/^@srcube-ui\/styles(\/.*)?$/, 'react', 'react-dom', 'react-aria-components', 'tailwind-variants'],
  skipNodeModulesBundle: true,
  inlineOnly: false,
  dts: true,
  sourcemap: false,
  fixedExtension: false,
});
