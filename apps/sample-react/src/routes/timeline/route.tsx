import { Timeline } from '@srcube-ui/timeline';
import { createFileRoute } from '@tanstack/react-router';

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
    color: 'primary' as const,
  },
  {
    title: 'Release',
    time: 'Pending',
    description: 'Waiting QA sign-off',
    isPending: true,
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function TimelineDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Timeline</div>
      </div>

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
      </div>
    </main>
  );
}
