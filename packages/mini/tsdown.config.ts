import { defineConfig } from 'tsdown';

export default defineConfig({
  cwd: 'src',
  entry: {
    '*': 'components/**/*.ts',
    '_shared/*': 'shared/**/*.ts',
  },
  format: 'cjs',
  target: 'es2015',
  outExtensions: () => ({
    js: '.js',
    dts: '.d.ts',
  }),
  outDir: '../dist',
  copy: [
    {
      from: 'components/**/*.{wxml,wxss,json,wxs}',
      to: '../dist',
      flatten: false,
    },
  ],
  skipNodeModulesBundle: true,
  dts: true,
  sourcemap: false,
  fixedExtension: false,
});
