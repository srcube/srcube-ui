import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'tinyglobby';
import { defineConfig } from 'tsdown';

const STATIC_GLOB = 'components/**/*.{wxml,wxss,json,wxs}';
const SRC_DIR = 'src';
const OUT_DIR = 'dist';

async function copyStaticFiles() {
  const files = await glob(STATIC_GLOB, { cwd: SRC_DIR });
  await Promise.all(
    files.map(async (file) => {
      const rel = file.replace(/^components\//, '');
      const dest = path.join(OUT_DIR, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      await copyFile(path.join(SRC_DIR, file), dest);
    }),
  );
}

export default defineConfig({
  cwd: SRC_DIR,
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
  outDir: `../${OUT_DIR}`,
  skipNodeModulesBundle: true,
  dts: true,
  sourcemap: false,
  fixedExtension: false,
  plugins: [
    {
      name: 'watch-static',
      async buildStart() {
        const files = await glob(STATIC_GLOB, { cwd: SRC_DIR });
        for (const file of files) this.addWatchFile(`${SRC_DIR}/${file}`);
      },
    },
  ],
  hooks: {
    'build:done': copyStaticFiles,
  },
});
