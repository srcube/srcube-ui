import { Button } from '@srcube-ui/react';
import { Skeleton } from '@srcube-ui/react';
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

function SkeletonDemo() {
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
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Skeleton" />
      <div className="px-4 pb-8">
        <Section title="Basic" description="isLoaded 控制占位层与内容切换">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onTap={() => {
              setIsLoaded((prev) => !prev);
            }}
          >
            {isLoaded ? '显示骨架' : '显示内容'}
          </Button>

          <Skeleton
            isLoaded={isLoaded}
            className="mt-3 w-full rounded-2xl border border-slate-200 p-4"
          >
            <div className="text-sm font-semibold text-slate-900">
              Skeleton Content
            </div>
            <div className="mt-2 text-xs leading-5 text-slate-600">
              加载完成后展示真实内容，未完成时展示占位。
            </div>
          </Skeleton>
        </Section>

        <Section title="Radius" description="none / sm / md / lg / full">
          <div className="flex flex-col gap-3">
            {radiusOptions.map((item) => (
              <div key={item.value} className="flex items-center gap-3">
                <div className="w-12 shrink-0 text-xs text-slate-500">
                  {item.label}
                </div>
                <Skeleton radius={item.value} className="h-10 w-full">
                  <div className="h-10 w-full" />
                </Skeleton>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Card" description="常见信息卡占位">
          <Button
            size="sm"
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
            radius="lg"
            className="mt-3 w-full rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  Srcube UI
                </div>
                <div className="mt-1 text-xs text-slate-600">
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
