import { ActionSheet } from '@srcube-ui/action-sheet';
import { Button } from '@srcube-ui/button';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/action-sheet')({
  component: ActionSheetDemo,
});

const actions = [
  {
    value: 'edit',
    label: '编辑',
    description: '修改当前内容',
  },
  {
    value: 'share',
    label: '分享',
    description: '分享给好友',
  },
  {
    value: 'delete',
    label: '删除',
    description: '删除后不可恢复',
    color: 'danger' as const,
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function ActionSheetDemo() {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState('-');

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Action Sheet</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <Button className="mt-3" onPress={() => setOpen(true)}>
            打开操作面板
          </Button>
          <div className="mt-2 text-xs text-slate-500">Result: {result}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Inset / Sizes</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onPress={() => setOpen(true)}>
              Small
            </Button>
            <Button size="md" onPress={() => setOpen(true)}>
              Medium
            </Button>
            <Button size="lg" onPress={() => setOpen(true)}>
              Large
            </Button>
          </div>
        </Card>
      </div>

      <ActionSheet
        isOpen={open}
        title="更多操作"
        description="请选择一个操作"
        actions={actions}
        isInset
        onAction={(value) => {
          setResult(String(value));
        }}
        onOpenChange={setOpen}
      />
    </main>
  );
}
