import { Button, ButtonGroup, Tabs } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/button')({
  component: ButtonDemo,
});

type DemoItem = {
  label: string;
  value: string;
};

function Section({
  title,
  description,
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: 'light' | 'dark';
  children: React.ReactNode;
}) {
  const isDark = tone === 'dark';

  return (
    <section
      className={[
        'mt-6 rounded-2xl p-4 shadow-sm',
        isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900',
      ].join(' ')}
    >
      <div className="text-sm font-semibold">{title}</div>
      {description ? (
        <div
          className={[
            'mt-1 text-xs',
            isDark ? 'text-zinc-300' : 'text-slate-500',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function ButtonDemo() {
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const isDark = tone === 'dark';

  const colors = useMemo<DemoItem[]>(
    () => [
      { label: 'Default', value: 'default' },
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Danger', value: 'danger' },
    ],
    [],
  );

  const toneItems = useMemo(
    () => [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
    ],
    [],
  );

  const variants = useMemo<DemoItem[]>(
    () => [
      { label: 'Solid', value: 'solid' },
      { label: 'Outline', value: 'outline' },
      { label: 'Flat', value: 'flat' },
      { label: 'Text', value: 'text' },
    ],
    [],
  );

  const sizes = useMemo<DemoItem[]>(
    () => [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
    [],
  );

  const radii = useMemo<DemoItem[]>(
    () => [
      { label: 'None', value: 'none' },
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
      { label: 'Full', value: 'full' },
    ],
    [],
  );

  return (
    <main
      className={[
        'min-h-screen pb-24',
        isDark ? 'bg-zinc-900 text-white' : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Button" />
      <div className="px-4 pb-8">
        <Section
          title="Tone"
          description="使用 tabs 切换所有样例的 tone"
          tone={tone}
        >
          <div className="w-full">
            <Tabs
              items={toneItems}
              value={tone}
              onValueChange={(value) => {
                setTone(value as 'light' | 'dark');
              }}
            />
          </div>
        </Section>

        <Section
          title="Colors"
          description={`color + variant=solid + tone=${tone}`}
          tone={tone}
        >
          {colors.map((item) => (
            <Button key={item.value} color={item.value as never} tone={tone}>
              {item.label}
            </Button>
          ))}
        </Section>

        <Section
          title="Variants"
          description={`color=default + tone=${tone}`}
          tone={tone}
        >
          {variants.map((item) => (
            <Button key={item.value} variant={item.value as never} tone={tone}>
              {item.label}
            </Button>
          ))}
        </Section>

        <Section title="Sizes" description={`color=default + tone=${tone}`} tone={tone}>
          {sizes.map((item) => (
            <Button key={item.value} size={item.value as never} tone={tone}>
              {item.label}
            </Button>
          ))}
        </Section>

        <Section title="Radius" description={`color=default + tone=${tone}`} tone={tone}>
          {radii.map((item) => (
            <Button key={item.value} radius={item.value as never} tone={tone}>
              {item.label}
            </Button>
          ))}
        </Section>

        <Section title="States" description={`color=default + tone=${tone}`} tone={tone}>
          <Button tone={tone}>Normal</Button>
          <Button isDisabled tone={tone}>
            Disabled
          </Button>
          <Button isLoading tone={tone}>
            Loading
          </Button>
          <Button
            tone={tone}
            isLoading="auto"
            onTap={async () => {
              await new Promise((resolve) => setTimeout(resolve, 800));
            }}
          >
            Auto Loading
          </Button>
        </Section>

        <Section title="Icon" description={`color=default + tone=${tone}`} tone={tone}>
          <Button isIcon tone={tone} aria-label="Add">
            <span className="icon-[mdi--plus] text-lg" aria-hidden />
          </Button>
          <Button tone={tone}>
            <span className="icon-[mdi--star-outline] text-lg" aria-hidden />
            <span>Star</span>
          </Button>
        </Section>

        <section
          className={[
            'mt-6 rounded-2xl p-4 shadow-sm',
            isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900',
          ].join(' ')}
        >
          <div className="text-sm font-semibold">Block</div>
          <div
            className={[
              'mt-1 text-xs',
              isDark ? 'text-zinc-300' : 'text-slate-500',
            ].join(' ')}
          >
            color=default + tone={tone}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button isBlock tone={tone}>
              Block Button
            </Button>
            <Button isBlock variant="outline" tone={tone}>
              Outline Block
            </Button>
          </div>
        </section>

        <section
          className={[
            'mt-6 rounded-2xl p-4 shadow-sm',
            isDark ? 'bg-zinc-800 text-white' : 'bg-white text-slate-900',
          ].join(' ')}
        >
          <div className="text-sm font-semibold">ButtonGroup</div>
          <div
            className={[
              'mt-1 text-xs',
              isDark ? 'text-zinc-300' : 'text-slate-500',
            ].join(' ')}
          >
            group tone = {tone}
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <ButtonGroup tone={tone}>
              <Button>Left</Button>
              <Button>Middle</Button>
              <Button>Right</Button>
            </ButtonGroup>
            <ButtonGroup tone={tone} isBlock>
              <Button>Yes</Button>
              <Button variant="outline">No</Button>
            </ButtonGroup>
            <ButtonGroup color="primary" tone={tone} isBlock>
              <Button>Accept</Button>
              <Button variant="outline">Later</Button>
            </ButtonGroup>
          </div>
        </section>
      </div>
    </main>
  );
}
