import { Button } from '@srcube-ui/react';
import { SwipeAction } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/swipe-action')({
  component: SwipeActionDemo,
});

type OpenDirection = 'none' | 'left' | 'right';

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

function Row({ text }: { text: string }) {
  return <div className="flex h-12 items-center bg-white px-4">{text}</div>;
}

function SwipeActionDemo() {
  const [controlledDirection, setControlledDirection] =
    useState<OpenDirection>('none');
  const [lastAction, setLastAction] = useState('none');

  const leftActions = useMemo(
    () => [
      {
        key: 'pin',
        label: '置顶',
        color: 'primary' as const,
      },
    ],
    [],
  );

  const rightActions = useMemo(
    () => [
      {
        key: 'more',
        label: (
          <>
            <span className="icon-[ic--outline-more-horiz] text-lg" aria-hidden />
            <span className="sr-only">更多</span>
          </>
        ),
        color: 'secondary' as const,
      },
      {
        key: 'delete',
        label: (
          <>
            <span className="icon-[fa7-solid--trash] text-base" aria-hidden />
            <span className="sr-only">删除</span>
          </>
        ),
        color: 'danger' as const,
      },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Swipe Action" />

      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="左右滑动揭示动作按钮，点击动作后自动收起"
        >
          <SwipeAction
            leftActions={leftActions}
            rightActions={rightActions}
            onAction={(detail) => {
              setLastAction(`${detail.direction}:${String(detail.key)}`);
            }}
          >
            <Row text="订单 #1001" />
          </SwipeAction>

          <div className="mt-2 text-xs text-slate-500">
            Last Action: {lastAction}
          </div>
        </Section>

        <Section
          title="Controlled"
          description="使用 openDirection + onOpenDirectionChange 控制开合"
        >
          <div className="mb-3 flex gap-2">
            <Button
              size="sm"
              variant="flat"
              onTap={() => setControlledDirection('left')}
            >
              Open Left
            </Button>
            <Button
              size="sm"
              variant="flat"
              onTap={() => setControlledDirection('right')}
            >
              Open Right
            </Button>
            <Button
              size="sm"
              variant="flat"
              onTap={() => setControlledDirection('none')}
            >
              Close
            </Button>
          </div>

          <SwipeAction
            leftActions={leftActions}
            rightActions={rightActions}
            openDirection={controlledDirection}
            onOpenDirectionChange={setControlledDirection}
          >
            <Row text="受控行 #2001" />
          </SwipeAction>

          <div className="mt-2 text-xs text-slate-500">
            Open Direction: {controlledDirection}
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <div className="space-y-3">
            <SwipeAction
              leftActions={leftActions}
              rightActions={rightActions}
              size="sm"
            >
              <Row text="Small" />
            </SwipeAction>
            <SwipeAction
              leftActions={leftActions}
              rightActions={rightActions}
              size="md"
            >
              <Row text="Medium" />
            </SwipeAction>
            <SwipeAction
              leftActions={leftActions}
              rightActions={rightActions}
              size="lg"
            >
              <Row text="Large" />
            </SwipeAction>
          </div>
        </Section>

        <Section title="States" description="disabled / custom action style">
          <div className="space-y-3">
            <SwipeAction
              leftActions={leftActions}
              rightActions={rightActions}
              isDisabled
            >
              <Row text="Disabled" />
            </SwipeAction>

            <SwipeAction
              leftActions={[
                {
                  key: 'archive',
                  label: '归档',
                  color: 'success',
                },
              ]}
              rightActions={[
                {
                  key: 'delete',
                  label: (
                    <>
                      <span className="icon-[fa7-solid--trash] text-base" aria-hidden />
                      <span className="sr-only">删除</span>
                    </>
                  ),
                  color: 'danger',
                  className: 'font-bold',
                },
              ]}
            >
              <Row text="Custom Action" />
            </SwipeAction>
          </div>
        </Section>
      </div>
    </main>
  );
}
