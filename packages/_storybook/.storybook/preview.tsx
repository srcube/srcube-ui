import type { Preview } from '@storybook/react';
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
    (Story) => (
      <div className="min-h-dvh w-full bg-slate-100 px-4 py-8 text-slate-900">
        <div className="mx-auto w-full max-w-[430px] rounded-[28px] bg-slate-50 p-4 shadow-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default preview;
