import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    const [{ default: tailwindcss }, { default: react }] = await Promise.all([
      import('@tailwindcss/vite'),
      import('@vitejs/plugin-react'),
    ]);

    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@srcube-ui/react': fileURLToPath(
        new URL('../../../packages/react/src/index.ts', import.meta.url),
      ),
    };
    config.plugins = [...(config.plugins ?? []), tailwindcss(), react()];
    return config;
  },
};

export default config;
