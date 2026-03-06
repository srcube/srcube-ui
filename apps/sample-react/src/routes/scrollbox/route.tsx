import { Scrollbox } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/scrollbox')({
  component: ScrollboxDemo,
});

type DemoItem = {
  id: number;
  label: string;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ScrollboxDemo() {
  const items = useMemo<DemoItem[]>(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        label: `Item ${index + 1}`,
      })),
    [],
  );

  const cards = useMemo<DemoItem[]>(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        id: index,
        label: `Card ${index + 1}`,
      })),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Scrollbox" />
      <div className="px-4 pb-8">
        <Section title="Vertical" description="orientation=y">
          <div className="h-56">
            <Scrollbox
              orientation="y"
              className="h-full rounded-2xl border border-slate-200 bg-white"
            >
              <div className="space-y-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center h-12 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </Scrollbox>
          </div>
        </Section>

        <Section title="Horizontal" description="orientation=x">
          <Scrollbox
            orientation="x"
            className="h-fit rounded-2xl border border-slate-200 bg-white"
          >
            <div className="flex gap-3 p-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="inline-flex h-16 w-32 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700"
                >
                  {card.label}
                </div>
              ))}
            </div>
          </Scrollbox>
        </Section>

        <Section title="Both (xy)" description="orientation=xy">
          <div className="h-48">
            <Scrollbox
              orientation="xy"
              className="h-full rounded-2xl border border-slate-200 bg-white"
            >
              <div className="grid w-[520px] h-[320px] grid-cols-4 gap-3 p-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-full items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    Tile {index + 1}
                  </div>
                ))}
              </div>
            </Scrollbox>
          </div>
        </Section>

        <Section title="Hide Masks" description="hideMasks=true">
          <div className="h-48">
            <Scrollbox
              hideMasks
              className="h-full rounded-2xl border border-slate-200 bg-white"
            >
              <div className="space-y-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center h-10 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </Scrollbox>
          </div>
        </Section>

        <Section title="Show Scrollbar" description="showScrollbar=true">
          <div className="h-48">
            <Scrollbox
              showScrollbar
              className="h-full rounded-2xl border border-slate-200 bg-white"
            >
              <div className="space-y-3 p-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center h-10 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700"
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </Scrollbox>
          </div>
        </Section>
      </div>
    </main>
  );
}
