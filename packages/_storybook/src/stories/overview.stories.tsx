import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Overview/Getting Started',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Intro: Story = {
  render: () => (
    <main className="min-h-full bg-slate-50 px-4 py-6 text-slate-900">
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.24em] text-sky-600">
            Srcube UI
          </div>
          <h1 className="mt-3 text-2xl font-semibold">Storybook</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            React Web components playground for @srcube-ui/react. Browse the sidebar,
            inspect props, and validate mobile-first states while building components.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold">Live component states</div>
            <div className="mt-2 text-sm text-slate-600">
              Variants, sizes, loading, disabled, and layout combinations.
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold">React-first workspace</div>
            <div className="mt-2 text-sm text-slate-600">
              Stories resolve directly against source files for fast iteration.
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold">Ready to expand</div>
            <div className="mt-2 text-sm text-slate-600">
              Add one story per component under `src/stories` as the library grows.
            </div>
          </div>
        </div>
      </div>
    </main>
  ),
};
