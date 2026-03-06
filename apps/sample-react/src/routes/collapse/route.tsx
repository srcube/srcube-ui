import { Collapse } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

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
      <PageHeader title="Collapse" />

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
            <Collapse title="Default" content="无边框无背景" variant="default" defaultValue />
            <Collapse title="Flat" content="柔和背景风格" variant="flat" defaultValue />
            <Collapse title="Outline" content="边框风格" variant="outline" defaultValue />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes / States</div>
          <div className="mt-3 space-y-2">
            <Collapse title="Small" content="size=sm" size="sm" defaultValue />
            <Collapse title="Medium" content="size=md" size="md" defaultValue />
            <Collapse title="Large" content="size=lg" size="lg" defaultValue />
            <Collapse title="Radius None" content="radius=none" variant="flat" radius="none" defaultValue />
            <Collapse title="Radius Sm" content="radius=sm" variant="flat" radius="sm" defaultValue />
            <Collapse title="Radius Md" content="radius=md" variant="flat" radius="md" defaultValue />
            <Collapse title="Radius Lg" content="radius=lg" variant="flat" radius="lg" defaultValue />
            <Collapse title="No Indicator" content="隐藏右侧图标" hasIndicator={false} defaultValue />
            <Collapse title="Disabled" content="禁用状态" isDisabled defaultValue />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Custom Title Node</div>
          <div className="mt-3 space-y-2">
            <Collapse
              title={(
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="icon-[mingcute--notification-fill] text-base text-primary" />
                  <span>系统通知</span>
                </span>
              )}
              content="title 支持 ReactNode，可在左侧放 iconify 图标。"
              defaultValue
            />
            <Collapse
              variant="outline"
              title={(
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="icon-[mdi--calendar-blank] text-base text-slate-500" />
                  <span>日程提醒</span>
                </span>
              )}
              content="这里是另一种图标 + 标题组合样式。"
              defaultValue
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
