import { Button } from '@srcube-ui/react';
import { ActionSheet } from '@srcube-ui/react';
import {
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
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function DrawerDemo() {
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
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Drawer" />
      <div className="px-4 pb-8">
        <Section title="Placement" description="left / right / top / bottom">
          <Button variant="outline" onTap={() => openPlacement('left')}>
            Left
          </Button>
          <Button variant="outline" onTap={() => openPlacement('right')}>
            Right
          </Button>
          <Button variant="outline" onTap={() => openPlacement('top')}>
            Top
          </Button>
          <Button variant="outline" onTap={() => openPlacement('bottom')}>
            Bottom
          </Button>
        </Section>

        <Section title="Non Dismissable">
          <Button onTap={() => setLockedOpen(true)}>Open Locked Drawer</Button>
        </Section>

        <Section
          title="Top Drawer + ActionSheet"
          description="从 top 弹出 Drawer，并在 Drawer 内继续弹出 ActionSheet"
        >
          <Button onTap={() => setTopActionDrawerOpen(true)}>
            Open Top Drawer Scene
          </Button>
          <div className="w-full text-xs text-slate-500">
            Result: {topActionResult}
          </div>
        </Section>
      </div>

      <Drawer
        isOpen={isOpen}
        placement={placement}
        title={`Drawer ${placement}`}
        onOpenChange={setIsOpen}
      >
        <DrawerContent>
          <DrawerBody>
            Current placement: <span className="font-medium">{placement}</span>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="text" onTap={() => setIsOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={lockedOpen}
        placement="right"
        isDismissable={false}
        onOpenChange={setLockedOpen}
      >
        <DrawerContent>
          <DrawerHeader>Locked Drawer</DrawerHeader>
          <DrawerBody>Backdrop clicks are disabled.</DrawerBody>
          <DrawerFooter>
            <Button variant="text" onTap={() => setLockedOpen(false)}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={topActionDrawerOpen}
        placement="top"
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
              <div className="text-sm text-slate-600">
                这个场景用于验证 Drawer(top) 内再打开 ActionSheet。
              </div>
              <Button isBlock onTap={() => setTopActionSheetOpen(true)}>
                Open Action Sheet
              </Button>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="text" onTap={() => setTopActionDrawerOpen(false)}>
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
