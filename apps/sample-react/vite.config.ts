import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@srcube-ui/button': fileURLToPath(
        new URL('../../packages/react/src/components/button/index.ts', import.meta.url),
      ),
      '@srcube-ui/styles/components/button': fileURLToPath(
        new URL('../../packages/styles/src/components/button/index.ts', import.meta.url),
      ),
    },
  },
  plugins: [
    tanstackRouter(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact(),
  ],
});

export default config;
