import { Button, Timeline } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/timeline')({
  component: TimelineDemo,
});

const productTimeline = [
  {
    title: 'Kickoff',
    time: '09:00',
    description: 'Align scope with product and design',
    icon: (
      <span aria-hidden className="icon-[mingcute--check-line] text-[12px]" />
    ),
    color: 'success' as const,
  },
  {
    title: 'Implementation',
    time: '10:20',
    description: 'Build core components',
    icon: (
      <span
        aria-hidden
        className="icon-[mingcute--settings-3-line] text-[12px]"
      />
    ),
    color: 'primary' as const,
  },
  {
    title: 'Release',
    time: 'Pending',
    description: 'Waiting QA sign-off',
    icon: (
      <span aria-hidden className="icon-[mingcute--more-1-line] text-[12px]" />
    ),
    isPending: true,
  },
];

const customIconTimeline = [
  {
    title: 'Default Icon',
    time: '09:00',
    description: 'Custom icon on default node',
    icon: (
      <span aria-hidden className="icon-[mingcute--dot-line] text-[12px]" />
    ),
  },
  {
    title: 'Primary Icon',
    time: '09:30',
    description: 'Custom icon on primary node',
    icon: (
      <span
        aria-hidden
        className="icon-[mingcute--information-line] text-[12px]"
      />
    ),
    color: 'primary' as const,
  },
  {
    title: 'Warning Icon',
    time: '10:00',
    description: 'Custom icon on warning node',
    icon: (
      <span aria-hidden className="icon-[mingcute--warning-line] text-[12px]" />
    ),
    color: 'warning' as const,
  },
  {
    title: 'Danger Icon',
    time: '10:30',
    description: 'Custom icon on danger node',
    icon: (
      <span aria-hidden className="icon-[mingcute--close-line] text-[12px]" />
    ),
    color: 'danger' as const,
  },
];

type TimelineTone = 'default' | 'dark';

function Card({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: TimelineTone;
}) {
  return (
    <section
      className={[
        'rounded-2xl p-4 shadow-sm transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-900 text-zinc-50 shadow-black/20'
          : 'bg-white text-slate-900',
      ].join(' ')}
    >
      {children}
    </section>
  );
}

function TimelineDemo() {
  const [tone, setTone] = useState<TimelineTone>('default');
  const descriptionClassName =
    tone === 'dark'
      ? 'mt-1 text-xs text-zinc-400'
      : 'mt-1 text-xs text-slate-500';

  return (
    <main
      className={[
        'min-h-screen pb-safe-4 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Timeline" tone={tone} />

      <div className="space-y-6 p-4">
        <Card tone={tone}>
          <div className="text-sm font-semibold">Tone</div>
          <div className="mt-3 flex gap-2">
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
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Default</div>
          <div className={descriptionClassName}>
            default timeline tokens should remain legible on both light and dark
            surfaces
          </div>
          <div className="mt-3">
            <Timeline tone={tone} items={productTimeline} />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Dashed / Small</div>
          <div className={descriptionClassName}>
            dashed connectors and pending states should keep enough contrast in
            dark mode
          </div>
          <div className="mt-3">
            <Timeline
              tone={tone}
              size="sm"
              lineStyle="dashed"
              items={[
                {
                  title: 'Draft',
                  time: '08:00',
                  description: 'Write initial brief',
                },
                {
                  title: 'Review',
                  time: '09:30',
                  description: 'Collect feedback',
                  color: 'warning',
                },
                {
                  title: 'Publish',
                  time: '10:40',
                  description: 'Ship docs',
                  color: 'danger',
                },
              ]}
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Custom Icons</div>
          <div className={descriptionClassName}>
            semantic title colors should step up to lighter ramps on dark tone
          </div>
          <div className="mt-3">
            <Timeline tone={tone} items={customIconTimeline} />
          </div>
        </Card>
      </div>
    </main>
  );
}
