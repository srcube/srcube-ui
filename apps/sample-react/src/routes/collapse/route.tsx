import { Button, Collapse } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/collapse')({
  component: CollapseDemo,
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

function CollapseDemo() {
  const [value, setValue] = React.useState(false);
  const [tone, setTone] = React.useState<'default' | 'dark'>('default');
  const descriptionClassName =
    tone === 'dark'
      ? 'mt-2 text-xs text-zinc-400'
      : 'mt-2 text-xs text-slate-500';

  return (
    <main
      className={[
        'min-h-screen pb-16 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Collapse" tone={tone} />

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
          <div className="text-sm font-semibold">Controlled</div>
          <Collapse
            className="mt-3"
            title="配送信息"
            content="重庆渝中区，预计今天送达"
            tone={tone}
            value={value}
            onValueChange={setValue}
          />
          <div className={descriptionClassName}>Expanded: {String(value)}</div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Variants</div>
          <div className="mt-3 space-y-2">
            <Collapse
              title="Default"
              content="无边框无背景"
              tone={tone}
              variant="default"
              defaultValue
            />
            <Collapse
              title="Flat"
              content="柔和背景风格"
              tone={tone}
              variant="flat"
              defaultValue
            />
            <Collapse
              title="Outline"
              content="边框风格"
              tone={tone}
              variant="outline"
              defaultValue
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Sizes / States</div>
          <div className="mt-3 space-y-2">
            <Collapse
              title="Small"
              content="size=sm"
              tone={tone}
              size="sm"
              defaultValue
            />
            <Collapse
              title="Medium"
              content="size=md"
              tone={tone}
              size="md"
              defaultValue
            />
            <Collapse
              title="Large"
              content="size=lg"
              tone={tone}
              size="lg"
              defaultValue
            />
            <Collapse
              title="Radius None"
              content="radius=none"
              tone={tone}
              variant="flat"
              radius="none"
              defaultValue
            />
            <Collapse
              title="Radius Sm"
              content="radius=sm"
              tone={tone}
              variant="flat"
              radius="sm"
              defaultValue
            />
            <Collapse
              title="Radius Md"
              content="radius=md"
              tone={tone}
              variant="flat"
              radius="md"
              defaultValue
            />
            <Collapse
              title="Radius Lg"
              content="radius=lg"
              tone={tone}
              variant="flat"
              radius="lg"
              defaultValue
            />
            <Collapse
              title="No Indicator"
              content="隐藏右侧图标"
              tone={tone}
              hasIndicator={false}
              defaultValue
            />
            <Collapse
              title="Disabled"
              content="禁用状态"
              tone={tone}
              isDisabled
              defaultValue
            />
          </div>
        </Card>

        <Card tone={tone}>
          <div className="text-sm font-semibold">Custom Title Node</div>
          <div className="mt-3 space-y-2">
            <Collapse
              tone={tone}
              title={
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className="icon-[mingcute--notification-fill] text-base text-primary"
                  />
                  <span>系统通知</span>
                </span>
              }
              content="title 支持 ReactNode，可在左侧放 iconify 图标。"
              defaultValue
            />
            <Collapse
              tone={tone}
              variant="outline"
              title={
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden
                    className={[
                      'icon-[mdi--calendar-blank] text-base',
                      tone === 'dark' ? 'text-zinc-400' : 'text-slate-500',
                    ].join(' ')}
                  />
                  <span>日程提醒</span>
                </span>
              }
              content="这里是另一种图标 + 标题组合样式。"
              defaultValue
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
