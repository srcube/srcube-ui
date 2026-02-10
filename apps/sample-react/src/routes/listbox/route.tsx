import type React from 'react';
import { Listbox } from '@srcube-ui/listbox';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/listbox')({
  component: ListboxDemo,
});

type DemoItem = {
  id: number;
  label: string;
  isDisabled?: boolean;
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

function ListboxDemo() {
  const [selectedKeys, setSelectedKeys] = useState<Array<string | number>>([2]);

  const items = useMemo<DemoItem[]>(
    () =>
      Array.from({ length: 1000 }, (_, index) => ({
        id: index,
        label: `Option ${index + 1}`,
        isDisabled: index % 37 === 0,
      })),
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Listbox" />
      <div className="px-4 pb-8">
        <Section
          title="Virtualized List"
          description="@tanstack/react-virtual (1000 items)"
        >
          <Listbox
            className="h-80 rounded-2xl border border-slate-200"
            items={items}
            estimateSize={44}
            overscan={8}
            hasDivider
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          />
          <div className="mt-3 text-xs text-slate-500">
            Selected: {selectedKeys.join(', ') || 'none'}
          </div>
        </Section>

        <Section title="Horizontal" description="orientation=x">
          <Listbox
            className="h-20 rounded-2xl border border-slate-200"
            orientation="x"
            items={items.slice(0, 80)}
            estimateSize={120}
            defaultSelectedKeys={[1]}
          />
        </Section>

        <Section title="Empty" description="locale=zh-CN">
          <Listbox
            className="h-32 rounded-2xl border border-slate-200"
            items={[]}
            estimateSize={44}
            locale="zh-CN"
          />
        </Section>
      </div>
    </main>
  );
}
