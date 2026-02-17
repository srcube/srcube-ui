import { Button } from '@srcube-ui/button';
import { Popover } from '@srcube-ui/popover';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/popover')({
  component: PopoverDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function PopoverDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Popover</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <div className="mt-3">
            <Popover
              trigger={<Button size="sm">点击查看</Button>}
              title="配送说明"
              content="支持工作日与周末配送。"
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Placements</div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <Popover
              placement="top"
              trigger={<Button size="sm">Top</Button>}
              title="Top"
              content="顶部展示"
            />
            <Popover
              placement="bottom"
              trigger={<Button size="sm">Bottom</Button>}
              title="Bottom"
              content="底部展示"
            />
            <Popover
              placement="left"
              trigger={<Button size="sm">Left</Button>}
              title="Left"
              content="左侧展示"
            />
            <Popover
              placement="right"
              trigger={<Button size="sm">Right</Button>}
              title="Right"
              content="右侧展示"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
