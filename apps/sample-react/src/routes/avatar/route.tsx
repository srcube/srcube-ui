import { Avatar, Button } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/avatar')({
  component: AvatarDemo,
});

function Card({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: 'default' | 'dark';
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

function AvatarDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const descriptionClassName =
    tone === 'dark'
      ? 'mt-1 text-xs text-zinc-400'
      : 'mt-1 text-xs text-slate-500';

  return (
    <main
      className={[
        'min-h-screen pb-16 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Avatar" tone={tone} />

      <div className="space-y-6 p-4">
        <Card tone={tone}>
          <div className="text-sm font-semibold">Tone</div>
          <div className="mt-3 flex gap-2">
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
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Basic</div>
          <div className={descriptionClassName}>
            fallback surfaces and semantic foreground ramps should stay readable
            in dark mode
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name="Srcube User" tone={tone} />
            <Avatar name="Taylor Swift" color="primary" tone={tone} />
            <Avatar icon="?" color="warning" tone={tone} />
            <Avatar
              src="/sample-avatar.png"
              fallback="FB"
              color="danger"
              tone={tone}
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Image / Sizes</div>
          <div className="mt-3 flex items-end gap-3">
            <Avatar
              size="sm"
              src="https://picsum.photos/80"
              alt="sm"
              tone={tone}
            />
            <Avatar
              size="md"
              src="https://picsum.photos/100"
              alt="md"
              tone={tone}
            />
            <Avatar
              size="lg"
              src="https://picsum.photos/120"
              alt="lg"
              tone={tone}
            />
            <Avatar
              size="xl"
              src="https://picsum.photos/140"
              alt="xl"
              tone={tone}
              isBordered
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Radius</div>
          <div className="mt-3 flex items-center gap-3">
            <Avatar radius="none" name="RN" tone={tone} />
            <Avatar radius="sm" name="RS" tone={tone} />
            <Avatar radius="md" name="RM" tone={tone} />
            <Avatar radius="lg" name="RL" tone={tone} />
            <Avatar radius="full" name="RF" tone={tone} />
          </div>
        </Card>
      </div>
    </main>
  );
}
