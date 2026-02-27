import { Avatar } from '@srcube-ui/avatar';
import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/avatar')({
  component: AvatarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function AvatarDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <PageHeader title="Avatar" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name="Srcube User" />
            <Avatar name="Taylor Swift" color="primary" />
            <Avatar icon="?" color="warning" />
            <Avatar src="/sample-avatar.png" fallback="FB" color="danger" />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Image / Sizes</div>
          <div className="mt-3 flex items-end gap-3">
            <Avatar size="sm" src="https://picsum.photos/80" alt="sm" />
            <Avatar size="md" src="https://picsum.photos/100" alt="md" />
            <Avatar size="lg" src="https://picsum.photos/120" alt="lg" />
            <Avatar size="xl" src="https://picsum.photos/140" alt="xl" isBordered />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Radius</div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar radius="none" name="RN" />
            <Avatar radius="sm" name="RS" />
            <Avatar radius="md" name="RM" />
            <Avatar radius="lg" name="RL" />
            <Avatar radius="full" name="RF" />
          </div>
        </Card>
      </div>
    </main>
  );
}
