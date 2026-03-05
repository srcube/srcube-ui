import type { Plugin } from 'rolldown';
import path from 'node:path';
import { defineConfig } from 'tsdown';

/**
 * Miniprogram alias plugin
 * Redirects tv-web imports to tv-mini for miniprogram builds
 */
const tvMiniAliasPlugin: Plugin = {
  name: 'srcube-tv-mini-alias',
  resolveId(source) {
    if (source === './tv-web' || source === './tv-web.ts') {
      return path.resolve(import.meta.dirname, 'src/shared/tv-mini.ts');
    }
    return null;
  },
};

const baseConfig = {
  skipNodeModulesBundle: true,
  dts: true,
  sourcemap: false,
  fixedExtension: false,
};

export default defineConfig([
  // Web build → dist/
  {
    ...baseConfig,
    entry: ['src/**/*.ts', '!src/shared/tv-mini.ts'],
    outDir: 'dist',
    copy: [{ from: 'theme/**/*', to: 'dist', flatten: false }],
  },
  // Miniprogram build → dist/@mini/
  {
    ...baseConfig,
    entry: ['src/**/*.ts', '!src/shared/tv-web.ts'],
    outDir: 'dist/@mini',
    format: 'cjs',
    target: 'es2015',
    outExtensions: () => ({
      js: '.js',
      dts: '.d.ts',
    }),
    plugins: [tvMiniAliasPlugin],
    copy: [{ from: 'theme/**/*', to: 'dist/@mini', flatten: false }],
  },
]);
