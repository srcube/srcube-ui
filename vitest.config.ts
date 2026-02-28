import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { preview } from '@vitest/browser-preview';
import { defineConfig } from 'vitest/config';

const setupFile = fileURLToPath(new URL('./tests/setup.ts', import.meta.url));
const commonExclude = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.turbo/**',
];

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: [setupFile],
          include: [
            'packages/**/__tests__/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.{test,spec}.{ts,tsx}',
          ],
          exclude: [
            ...commonExclude,
            'tests/browser/**/*',
            'tests/**/*.browser.{test,spec}.{ts,tsx}',
          ],
        },
      },
      {
        test: {
          name: 'browser',
          globals: true,
          include: [
            'tests/browser/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.browser.{test,spec}.{ts,tsx}',
          ],
          exclude: [...commonExclude],
          browser: {
            provider: preview(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
