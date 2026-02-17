import { Collapse } from '@srcube-ui/collapse';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/collapse')({
  component: CollapseDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function CollapseDemo() {
  const [value, setValue] = React.useState(false);

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Collapse</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Controlled</div>
          <Collapse
            className="mt-3"
            title="配送信息"
            content="重庆渝中区，预计今天送达"
            value={value}
            onValueChange={setValue}
          />
          <div className="mt-2 text-xs text-slate-500">Expanded: {String(value)}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Variants</div>
          <div className="mt-3 space-y-2">
            <Collapse title="Outline" content="默认边框样式" variant="outline" defaultValue />
            <Collapse title="Twotone" content="双层背景风格" variant="twotone" defaultValue />
            <Collapse title="Soft" content="柔和背景风格" variant="soft" defaultValue />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes / States</div>
          <div className="mt-3 space-y-2">
            <Collapse title="Small" content="size=sm" size="sm" defaultValue />
            <Collapse title="Medium" content="size=md" size="md" defaultValue />
            <Collapse title="Large" content="size=lg" size="lg" defaultValue />
            <Collapse title="No Indicator" content="隐藏右侧图标" hasIndicator={false} defaultValue />
            <Collapse title="Disabled" content="禁用状态" isDisabled defaultValue />
          </div>
        </Card>
      </div>
    </main>
  );
}
