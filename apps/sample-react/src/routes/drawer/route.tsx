import { Button } from '@srcube-ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@srcube-ui/drawer';
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

  const openPlacement = (nextPlacement: DrawerPlacement) => {
    setPlacement(nextPlacement);
    setIsOpen(true);
  };

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
    </main>
  );
}
