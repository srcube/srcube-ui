import { Button, ButtonGroup } from '@srcube-ui/button';
import { TabPanel, Tabs } from '@srcube-ui/tabs';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/tabs')({
  component: TabsDemo,
});

type DemoTabValue = string;

type DemoTabItem = {
  value: DemoTabValue;
  label: string;
  isDisabled?: boolean;
};

const tabsColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type TabsColor = (typeof tabsColorGroups)[number][number]['value'];

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

function TabsDemo() {
  const basicItems = useMemo<DemoTabItem[]>(
    () => [
      { value: 'tab-1', label: 'Tab 1' },
      { value: 'tab-2', label: 'Tab 2' },
      { value: 'tab-3', label: 'Tab 3' },
    ],
    [],
  );

  const verticalItems = useMemo<DemoTabItem[]>(
    () => [
      { value: 'tab-a', label: 'Tab A' },
      { value: 'tab-b', label: 'Tab B' },
      { value: 'tab-c', label: 'Tab C', isDisabled: true },
    ],
    [],
  );

  const colorItems = basicItems;
  const customPanelItems = basicItems;
  const longItems = useMemo<DemoTabItem[]>(
    () =>
      Array.from({ length: 36 }, (_, index) => ({
        value: `long-${index + 1}`,
        label: `Tab ${index + 1}`,
      })),
    [],
  );

  const [basicValue, setBasicValue] = useState<DemoTabValue>('tab-1');
  const [verticalValue, setVerticalValue] = useState<DemoTabValue>('tab-a');
  const [activeColor, setActiveColor] = useState<TabsColor>('default');
  const [colorValue, setColorValue] = useState<DemoTabValue>('tab-1');
  const [customValue, setCustomValue] = useState<DemoTabValue>('tab-1');
  const [longValue, setLongValue] = useState<DemoTabValue>('long-1');

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Tabs" />
      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="horizontal + panel (size=md radius=full)"
        >
          <Tabs
            items={basicItems}
            value={basicValue}
            size="md"
            radius="full"
            onValueChange={(next: string | number) => {
              setBasicValue(next as DemoTabValue);
            }}
          >
            <TabPanel
              value="tab-1"
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              Panel for Tab 1
            </TabPanel>
            <TabPanel
              value="tab-2"
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              Panel for Tab 2
            </TabPanel>
            <TabPanel
              value="tab-3"
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              Panel for Tab 3
            </TabPanel>
          </Tabs>
        </Section>

        <Section
          title="Vertical"
          description="orientation=y + panel (size=sm radius=lg)"
        >
          <Tabs
            className="h-44"
            items={verticalItems}
            value={verticalValue}
            orientation="y"
            size="sm"
            radius="lg"
            onValueChange={(next: string | number) => {
              setVerticalValue(next as DemoTabValue);
            }}
          >
            <TabPanel
              value="tab-a"
              className="h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm"
            >
              Panel for Tab A
            </TabPanel>
            <TabPanel
              value="tab-b"
              className="h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm"
            >
              Panel for Tab B
            </TabPanel>
            <TabPanel
              value="tab-c"
              className="h-full rounded-2xl border border-slate-200 bg-white p-4 text-sm"
            >
              Panel for Tab C (disabled tab)
            </TabPanel>
          </Tabs>
        </Section>

        <Section
          title="Colors"
          description="use 2 sm ButtonGroup to switch color"
        >
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {tabsColorGroups.map((group, groupIndex) => (
                <ButtonGroup
                  key={`tabs-color-group-${groupIndex}`}
                  size="sm"
                  isBlock
                >
                  {group.map((item) => (
                    <Button
                      key={item.value}
                      color={activeColor === item.value ? item.value : 'default'}
                      variant={activeColor === item.value ? 'solid' : 'flat'}
                      onTap={() => {
                        setActiveColor(item.value);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </ButtonGroup>
              ))}
            </div>

            <Tabs
              className="mt-3"
              items={colorItems}
              value={colorValue}
              color={activeColor}
              onValueChange={(next: string | number) => {
                setColorValue(next as DemoTabValue);
              }}
            />

            <div className="mt-2 text-xs text-slate-500">
              Color: {activeColor} / Selected: {colorValue}
            </div>
          </div>
        </Section>

        <Section
          title="Tabs Only"
          description="external custom panel (e.g. swiper / business container)"
        >
          <Tabs
            items={customPanelItems}
            value={customValue}
            onValueChange={(next: string | number) => {
              setCustomValue(next as DemoTabValue);
            }}
          />

          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            {customValue === 'tab-1'
              ? 'External Panel: Tab 1'
              : customValue === 'tab-2'
                ? 'External Panel: Tab 2'
                : 'External Panel: Tab 3'}
          </div>
        </Section>

        <Section
          title="Long List"
          description="virtualized tabs + edge tap auto shift"
        >
          <Tabs
            className="w-full"
            items={longItems}
            value={longValue}
            radius="full"
            estimateSize={88}
            onValueChange={(next: string | number) => {
              setLongValue(String(next));
            }}
          />

          <div className="mt-2 text-xs text-slate-500">
            Selected: {longValue}
          </div>
        </Section>
      </div>
    </main>
  );
}
