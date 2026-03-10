import type { Preview } from '@storybook/react';
import { MobilePreviewFrame } from '../src/lib/mobile-preview';
import '../src/styles.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Overview', 'Components'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const storyTitle = context.title?.split('/').at(-1) || context.name;

      return (
        <MobilePreviewFrame title={storyTitle}>
          <Story />
        </MobilePreviewFrame>
      );
    },
  ],
};

export default preview;
