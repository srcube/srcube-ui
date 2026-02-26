import { Listbox } from '@srcube-ui/listbox';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/listbox')({
  component: ListboxDemo,
});

type DemoItem = {
  id: string | number;
  label: string;
  isDisabled?: boolean;
  isSticky?: boolean;
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

function createStickyVerticalItems() {
  const items: DemoItem[] = [];

  for (let sectionIndex = 0; sectionIndex < 20; sectionIndex += 1) {
    const sectionNo = sectionIndex + 1;

    items.push({
      id: `section-${sectionNo}`,
      label: `Section ${sectionNo}`,
      isSticky: true,
    });

    for (let row = 0; row < 40; row += 1) {
      const absoluteIndex = sectionIndex * 40 + row + 1;

      items.push({
        id: `item-${absoluteIndex}`,
        label: `Option ${absoluteIndex}`,
        isDisabled: absoluteIndex % 37 === 0,
      });
    }
  }

  return items;
}

function createStickyHorizontalItems() {
  const items: DemoItem[] = [];

  for (let groupIndex = 0; groupIndex < 10; groupIndex += 1) {
    const groupNo = groupIndex + 1;

    items.push({
      id: `group-${groupNo}`,
      label: `Group ${groupNo}`,
      isSticky: true,
    });

    for (let tab = 0; tab < 12; tab += 1) {
      const absoluteIndex = groupIndex * 12 + tab + 1;

      items.push({
        id: `tab-${absoluteIndex}`,
        label: `Tab ${absoluteIndex}`,
      });
    }
  }

  return items;
}

function ListboxDemo() {
  const [stickyPressed, setStickyPressed] = useState<string>('none');
  const [horizontalPressed, setHorizontalPressed] = useState<string>('none');
  const [plainPressed, setPlainPressed] = useState<string>('none');

  const stickyItems = useMemo<DemoItem[]>(
    () => createStickyVerticalItems(),
    [],
  );

  const horizontalStickyItems = useMemo<DemoItem[]>(
    () => createStickyHorizontalItems(),
    [],
  );

  const plainItems = useMemo<DemoItem[]>(
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
          title="Sticky Vertical"
          description="@tanstack/react-virtual + rangeExtractor (orientation=y)"
        >
          <Listbox
            className="h-80 rounded-2xl border border-slate-200"
            items={stickyItems}
            estimateSize={44}
            overscan={8}
            hasDivider
            onItemPress={(item) => {
              setStickyPressed(String(item.id));
            }}
          />
          <div className="mt-3 text-xs text-slate-500">
            Last Pressed: {stickyPressed}
          </div>
        </Section>

        <Section
          title="Sticky Horizontal"
          description="orientation=x + sticky section item"
        >
          <Listbox
            className="h-20 rounded-2xl border border-slate-200"
            orientation="x"
            items={horizontalStickyItems}
            estimateSize={120}
            overscan={8}
            onItemPress={(item) => {
              setHorizontalPressed(String(item.id));
            }}
          />
          <div className="mt-3 text-xs text-slate-500">
            Last Pressed: {horizontalPressed}
          </div>
        </Section>

        <Section title="Virtualized List" description="plain mode (1000 items)">
          <Listbox
            className="h-80 rounded-2xl border border-slate-200"
            items={plainItems}
            estimateSize={44}
            overscan={8}
            hasDivider
            onItemPress={(item) => {
              setPlainPressed(String(item.id));
            }}
          />
          <div className="mt-3 text-xs text-slate-500">
            Last Pressed: {plainPressed}
          </div>
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
