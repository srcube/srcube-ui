import { NoticeBar } from '@srcube-ui/notice-bar';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/notice-bar')({
  component: NoticeBarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function NoticeBarDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Notice Bar</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <NoticeBar className="mt-3" icon="!" text="系统维护中，部分功能可能受影响。" />
        </Card>

        <Card>
          <div className="text-sm font-semibold">Colors</div>
          <div className="mt-3 space-y-2">
            <NoticeBar color="default" text="默认提示" />
            <NoticeBar color="info" text="信息提示" />
            <NoticeBar color="success" text="成功提示" />
            <NoticeBar color="warning" text="警告提示" />
            <NoticeBar color="danger" text="危险提示" />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes / Closable</div>
          <div className="mt-3 space-y-2">
            <NoticeBar size="sm" text="Small" isClosable />
            <NoticeBar size="md" text="Medium" action={<span>查看</span>} isClosable />
            <NoticeBar size="lg" text="Large" isClosable />
          </div>
        </Card>
      </div>
    </main>
  );
}
