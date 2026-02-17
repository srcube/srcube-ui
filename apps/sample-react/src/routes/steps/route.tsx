import { Steps } from '@srcube-ui/steps';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/steps')({
  component: StepsDemo,
});

const checkoutSteps = [
  { title: 'Address', description: 'Fill shipping info' },
  { title: 'Payment', description: 'Confirm card details' },
  { title: 'Done', description: 'Order created' },
];

const issueSteps = [
  { title: 'Create ticket', description: 'Submit detail', status: 'finish' as const },
  { title: 'Assign owner', description: 'Waiting owner', status: 'error' as const },
  { title: 'Fix & verify', description: 'Pending' },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function StepsDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Steps</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Horizontal</div>
          <div className="mt-3">
            <Steps items={checkoutSteps} current={1} />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Vertical / Dot</div>
          <div className="mt-3">
            <Steps items={checkoutSteps} current={2} direction="vertical" isDot />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Custom Status</div>
          <div className="mt-3">
            <Steps items={issueSteps} direction="vertical" size="sm" />
          </div>
        </Card>
      </div>
    </main>
  );
}
