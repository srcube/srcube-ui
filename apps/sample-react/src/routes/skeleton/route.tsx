import { Button, Skeleton } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/skeleton')({
  component: SkeletonDemo,
});

type RadiusOption = {
  label: string;
  value: 'none' | 'sm' | 'md' | 'lg' | 'full';
};

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

function SkeletonDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCardLoaded, setIsCardLoaded] = useState(false);

  const radiusOptions = useMemo<RadiusOption[]>(
    () => [
      { label: 'none', value: 'none' },
      { label: 'sm', value: 'sm' },
      { label: 'md', value: 'md' },
      { label: 'lg', value: 'lg' },
      { label: 'full', value: 'full' },
    ],
    [],
  );

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Skeleton" tone={tone} />
      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
          <div className="flex gap-2">
            <Button
              size="sm"
              color={tone === 'default' ? 'primary' : 'default'}
              variant={tone === 'default' ? 'solid' : 'flat'}
              onTap={() => setTone('default')}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === 'dark' ? 'solid' : 'flat'}
              onTap={() => setTone('dark')}
            >
              dark
            </Button>
          </div>
        </Section>

        <Section
          title="Basic"
          description="isLoaded 控制占位层与内容切换"
          tone={tone}
        >
          <Button
            size="sm"
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="flat"
            color="primary"
            onTap={() => {
              setIsLoaded((prev) => !prev);
            }}
          >
            {isLoaded ? '显示骨架' : '显示内容'}
          </Button>

          <Skeleton
            tone={tone}
            isLoaded={isLoaded}
            className={[
              'mt-3 w-full rounded-2xl border p-4',
              tone === 'dark'
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div
              className={
                tone === 'dark'
                  ? 'text-sm font-semibold text-zinc-50'
                  : 'text-sm font-semibold text-slate-900'
              }
            >
              Skeleton Content
            </div>
            <div
              className={
                tone === 'dark'
                  ? 'mt-2 text-xs leading-5 text-zinc-300'
                  : 'mt-2 text-xs leading-5 text-slate-600'
              }
            >
              加载完成后展示真实内容，未完成时展示占位。
            </div>
          </Skeleton>
        </Section>

        <Section
          title="Radius"
          description="none / sm / md / lg / full"
          tone={tone}
        >
          <div className="flex flex-col gap-3">
            {radiusOptions.map((item) => (
              <div key={item.value} className="flex items-center gap-3">
                <div
                  className={
                    tone === 'dark'
                      ? 'w-12 shrink-0 text-xs text-zinc-400'
                      : 'w-12 shrink-0 text-xs text-slate-500'
                  }
                >
                  {item.label}
                </div>
                <Skeleton
                  tone={tone}
                  radius={item.value}
                  className="h-10 w-full"
                >
                  <div className="h-10 w-full" />
                </Skeleton>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Card" description="常见信息卡占位" tone={tone}>
          <Button
            size="sm"
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="flat"
            color="secondary"
            onTap={() => {
              setIsCardLoaded((prev) => !prev);
            }}
          >
            {isCardLoaded ? '重置为骨架' : '加载卡片'}
          </Button>

          <Skeleton
            isLoaded={isCardLoaded}
            tone={tone}
            radius="lg"
            className={[
              'mt-3 w-full rounded-2xl border p-4',
              tone === 'dark'
                ? 'border-zinc-800 bg-zinc-950'
                : 'border-slate-200 bg-white',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div
                className={
                  tone === 'dark'
                    ? 'h-10 w-10 rounded-full bg-zinc-800'
                    : 'h-10 w-10 rounded-full bg-slate-200'
                }
              />
              <div className="flex-1">
                <div
                  className={
                    tone === 'dark'
                      ? 'text-sm font-semibold text-zinc-50'
                      : 'text-sm font-semibold text-slate-900'
                  }
                >
                  Srcube UI
                </div>
                <div
                  className={
                    tone === 'dark'
                      ? 'mt-1 text-xs text-zinc-300'
                      : 'mt-1 text-xs text-slate-600'
                  }
                >
                  跨 React 与 Mini 的组件实现。
                </div>
              </div>
            </div>
          </Skeleton>
        </Section>
      </div>
    </main>
  );
}
