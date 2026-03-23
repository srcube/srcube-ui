import {
  ActionSheet,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/drawer')({
  component: DrawerDemo,
});

type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

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
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function DrawerDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [lockedOpen, setLockedOpen] = useState(false);
  const [topActionDrawerOpen, setTopActionDrawerOpen] = useState(false);
  const [topActionSheetOpen, setTopActionSheetOpen] = useState(false);
  const [topActionResult, setTopActionResult] = useState('-');

  const openPlacement = (nextPlacement: DrawerPlacement) => {
    setPlacement(nextPlacement);
    setIsOpen(true);
  };

  const actionSheetActions = [
    {
      value: 'copy',
      label: '复制链接',
      description: '复制当前内容链接',
    },
    {
      value: 'share',
      label: '分享给团队',
      description: '发送给协作者',
    },
    {
      value: 'archive',
      label: '归档',
      description: '完成后归档到历史记录',
    },
  ];

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Drawer" tone={tone} />
      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
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
        </Section>

        <Section
          title="Placement"
          description="left / right / top / bottom"
          tone={tone}
        >
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => openPlacement('left')}
          >
            Left
          </Button>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => openPlacement('right')}
          >
            Right
          </Button>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => openPlacement('top')}
          >
            Top
          </Button>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            variant="outline"
            onTap={() => openPlacement('bottom')}
          >
            Bottom
          </Button>
        </Section>

        <Section title="Non Dismissable" tone={tone}>
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            onTap={() => setLockedOpen(true)}
          >
            Open Locked Drawer
          </Button>
        </Section>

        <Section
          title="Top Drawer + ActionSheet"
          description="从 top 弹出 Drawer，并在 Drawer 内继续弹出 ActionSheet"
          tone={tone}
        >
          <Button
            tone={tone === 'dark' ? 'dark' : 'light'}
            onTap={() => setTopActionDrawerOpen(true)}
          >
            Open Top Drawer Scene
          </Button>
          <div
            className={
              tone === 'dark'
                ? 'w-full text-xs text-zinc-400'
                : 'w-full text-xs text-slate-500'
            }
          >
            Result: {topActionResult}
          </div>
        </Section>
      </div>

      <Drawer
        isOpen={isOpen}
        placement={placement}
        tone={tone}
        title={`Drawer ${placement}`}
        onOpenChange={setIsOpen}
      >
        <DrawerContent>
          <DrawerBody>
            Current placement: <span className="font-medium">{placement}</span>
          </DrawerBody>
          <DrawerFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={lockedOpen}
        placement="right"
        tone={tone}
        isDismissable={false}
        onOpenChange={setLockedOpen}
      >
        <DrawerContent>
          <DrawerHeader>Locked Drawer</DrawerHeader>
          <DrawerBody>Backdrop clicks are disabled.</DrawerBody>
          <DrawerFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setLockedOpen(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={topActionDrawerOpen}
        placement="top"
        tone={tone}
        title="Drawer top"
        onOpenChange={(nextOpen) => {
          setTopActionDrawerOpen(nextOpen);
          if (!nextOpen) {
            setTopActionSheetOpen(false);
          }
        }}
      >
        <DrawerContent>
          <DrawerBody>
            <div className="space-y-3">
              <div
                className={
                  tone === 'dark'
                    ? 'text-sm text-zinc-300'
                    : 'text-sm text-slate-600'
                }
              >
                这个场景用于验证 Drawer(top) 内再打开 ActionSheet。
              </div>
              <Button
                tone={tone === 'dark' ? 'dark' : 'light'}
                isBlock
                onTap={() => setTopActionSheetOpen(true)}
              >
                Open Action Sheet
              </Button>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              tone={tone === 'dark' ? 'dark' : 'light'}
              variant="text"
              onTap={() => setTopActionDrawerOpen(false)}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ActionSheet
        isOpen={topActionSheetOpen}
        title="Top Drawer Actions"
        description="从 Drawer 内继续触发的 ActionSheet"
        actions={actionSheetActions}
        tone={tone}
        isInset
        onAction={(value) => {
          setTopActionResult(String(value));
          setTopActionSheetOpen(false);
        }}
        onOpenChange={setTopActionSheetOpen}
      />
    </main>
  );
}
