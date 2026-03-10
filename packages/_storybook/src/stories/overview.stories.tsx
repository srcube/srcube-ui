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
    <main className="min-h-dvh bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[32px] bg-white p-8 shadow-sm">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.24em] text-sky-600">
            Srcube UI
          </div>
          <h1 className="mt-3 text-3xl font-semibold">Storybook</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            React Web components playground for @srcube-ui/react. Use the left
            sidebar to browse components, inspect props, and validate visual
            states before wiring them into the sample apps.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
