import { Timeline } from '@srcube-ui/timeline';
import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/timeline')({
  component: TimelineDemo,
});

const productTimeline = [
  {
    title: 'Kickoff',
    time: '09:00',
    description: 'Align scope with product and design',
    icon: '✓',
    color: 'success' as const,
  },
  {
    title: 'Implementation',
    time: '10:20',
    description: 'Build core components',
    icon: '⚙',
    color: 'primary' as const,
  },
  {
    title: 'Release',
    time: 'Pending',
    description: 'Waiting QA sign-off',
    icon: '…',
    isPending: true,
  },
];

const customIconTimeline = [
  {
    title: 'Default Icon',
    time: '09:00',
    description: 'Custom icon on default node',
    icon: '•',
  },
  {
    title: 'Primary Icon',
    time: '09:30',
    description: 'Custom icon on primary node',
    icon: 'i',
    color: 'primary' as const,
  },
  {
    title: 'Warning Icon',
    time: '10:00',
    description: 'Custom icon on warning node',
    icon: '!',
    color: 'warning' as const,
  },
  {
    title: 'Danger Icon',
    time: '10:30',
    description: 'Custom icon on danger node',
    icon: '×',
    color: 'danger' as const,
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function TimelineDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Timeline" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Default</div>
          <div className="mt-3">
            <Timeline items={productTimeline} />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Dashed / Small</div>
          <div className="mt-3">
            <Timeline
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

        <Card>
          <div className="text-sm font-semibold">Custom Icons</div>
          <div className="mt-3">
            <Timeline items={customIconTimeline} />
          </div>
        </Card>
      </div>
    </main>
  );
}
