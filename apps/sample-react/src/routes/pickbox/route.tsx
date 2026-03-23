import {
  Button,
  ButtonGroup,
  Pickbox,
  type PickboxValue,
} from '@srcube-ui/react';
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
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: 'default' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'mt-6 rounded-2xl p-4 shadow-sm transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-900 text-zinc-50 shadow-black/20'
          : 'bg-white text-slate-900',
      ].join(' ')}
    >
      <div className="text-sm font-semibold">{title}</div>
      {description ? (
        <div
          className={[
            'mt-1 text-xs',
            tone === 'dark' ? 'text-zinc-400' : 'text-slate-500',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PickboxDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
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
  const buttonTone = tone === 'dark' ? 'dark' : 'light';
  const borderClassName =
    tone === 'dark' ? 'border-zinc-800' : 'border-slate-200';

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Pickbox" tone={tone} />
      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
          <div className="flex gap-2">
            <Button
              size="sm"
              color={tone === 'default' ? 'primary' : 'default'}
              variant={tone === 'default' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('default');
              }}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === 'dark' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('dark');
              }}
            >
              dark
            </Button>
          </div>
        </Section>

        <Section
          title="Multi Column Picker"
          description="多列虚拟列表 + 中心指示器 + 滚动结束自动对齐"
          tone={tone}
        >
          <Pickbox
            className={`h-72 rounded-2xl border ${borderClassName}`}
            columns={columns}
            tone={tone}
            value={value}
            onValueChange={setValue}
            indicatorHeight={44}
          />
          <div
            className={
              tone === 'dark'
                ? 'mt-3 text-xs text-zinc-400'
                : 'mt-3 text-xs text-slate-500'
            }
          >
            Selected: {value.filter((item) => item != null).join(' / ')}
          </div>
        </Section>

        <Section
          title="Colors"
          description="使用 2 组 sm ButtonGroup 切换颜色（default=100，语义色=50）"
          tone={tone}
        >
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {pickboxColorGroups.map((group, groupIndex) => (
                <ButtonGroup
                  key={`color-group-${groupIndex}`}
                  size="sm"
                  tone={buttonTone}
                  variant="outline"
                  isBlock
                >
                  {group.map((item) => (
                    <Button
                      key={item.value}
                      tone={buttonTone}
                      color={
                        activeColor === item.value ? item.value : 'default'
                      }
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
              className={`mt-3 h-52 rounded-2xl border ${borderClassName}`}
              color={activeColor}
              tone={tone}
              columns={columns}
              value={colorValue}
              onValueChange={setColorValue}
            />

            <div
              className={
                tone === 'dark'
                  ? 'mt-2 text-xs text-zinc-400'
                  : 'mt-2 text-xs text-slate-500'
              }
            >
              Color: {activeColor} / Selected:{' '}
              {colorValue.filter((item) => item != null).join(' / ')}
            </div>
          </div>
        </Section>

        <Section
          title="Sizes"
          description="sm / md / lg 高度由 size 决定（不额外覆盖 height）"
          tone={tone}
        >
          <div className="space-y-4">
            <div>
              <div
                className={
                  tone === 'dark'
                    ? 'mb-2 text-xs font-medium text-zinc-400'
                    : 'mb-2 text-xs font-medium text-slate-500'
                }
              >
                size = sm
              </div>
              <Pickbox
                className={`rounded-2xl border ${borderClassName}`}
                size="sm"
                tone={tone}
                columns={columns}
                defaultValue={[2000, 1, 1]}
              />
            </div>

            <div>
              <div
                className={
                  tone === 'dark'
                    ? 'mb-2 text-xs font-medium text-zinc-400'
                    : 'mb-2 text-xs font-medium text-slate-500'
                }
              >
                size = md
              </div>
              <Pickbox
                className={`rounded-2xl border ${borderClassName}`}
                size="md"
                tone={tone}
                columns={columns}
                defaultValue={[2000, 1, 1]}
              />
            </div>

            <div>
              <div
                className={
                  tone === 'dark'
                    ? 'mb-2 text-xs font-medium text-zinc-400'
                    : 'mb-2 text-xs font-medium text-slate-500'
                }
              >
                size = lg
              </div>
              <Pickbox
                className={`rounded-2xl border ${borderClassName}`}
                size="lg"
                tone={tone}
                columns={columns}
                defaultValue={[2000, 1, 1]}
              />
            </div>
          </div>
        </Section>
      </div>
    </main>
  );
}
