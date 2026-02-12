import { Button, ButtonGroup } from '@srcube-ui/button';
import { Pickbox, type PickboxValue } from '@srcube-ui/pickbox';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/pickbox')({
  component: PickboxDemo,
});

const pickboxColorGroups = [
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

type PickboxColor = (typeof pickboxColorGroups)[number][number]['value'];

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

function PickboxDemo() {
  const columns = useMemo(
    () => [
      {
        id: 'year',
        items: Array.from({ length: 36 }, (_, index) => {
          const year = 1990 + index;
          return { id: year, label: `${year} 年` };
        }),
      },
      {
        id: 'month',
        items: Array.from({ length: 12 }, (_, index) => ({
          id: index + 1,
          label: `${index + 1} 月`,
        })),
      },
      {
        id: 'day',
        items: Array.from({ length: 31 }, (_, index) => ({
          id: index + 1,
          label: `${index + 1} 日`,
        })),
      },
    ],
    [],
  );

  const [value, setValue] = useState<PickboxValue>([2000, 1, 1]);
  const [activeColor, setActiveColor] = useState<PickboxColor>('default');
  const [colorValue, setColorValue] = useState<PickboxValue>([2000, 1, 1]);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Pickbox" />
      <div className="px-4 pb-8">
        <Section
          title="Multi Column Picker"
          description="多列虚拟列表 + 中心指示器 + 滚动结束自动对齐"
        >
          <Pickbox
            className="h-72 rounded-2xl border border-slate-200"
            columns={columns}
            value={value}
            onValueChange={setValue}
            indicatorHeight={44}
          />
          <div className="mt-3 text-xs text-slate-500">
            Selected: {value.filter((item) => item != null).join(' / ')}
          </div>
        </Section>

        <Section
          title="Colors"
          description="使用 2 组 sm ButtonGroup 切换颜色（default=100，语义色=50）"
        >
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {pickboxColorGroups.map((group, groupIndex) => (
                <ButtonGroup
                  key={`color-group-${groupIndex}`}
                  size="sm"
                  variant="outline"
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

            <Pickbox
              className="mt-3 h-52 rounded-2xl border border-slate-200"
              color={activeColor}
              columns={columns}
              value={colorValue}
              onValueChange={setColorValue}
            />

            <div className="mt-2 text-xs text-slate-500">
              Color: {activeColor} / Selected:{' '}
              {colorValue.filter((item) => item != null).join(' / ')}
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
