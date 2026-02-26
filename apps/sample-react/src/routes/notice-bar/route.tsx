import { Button, ButtonGroup } from '@srcube-ui/button';
import { NoticeBar } from '@srcube-ui/notice-bar';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/notice-bar')({
  component: NoticeBarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

const switchIntervalOptions = [
  { label: '1.8s', value: 1800 },
  { label: '2.6s', value: 2600 },
  { label: '3.6s', value: 3600 },
] as const;

const marqueeDurationOptions = [
  { label: '4.2s', value: 4200 },
  { label: '5.2s', value: 5200 },
  { label: '6.8s', value: 6800 },
] as const;

function NoticeBarDemo() {
  const [switchInterval, setSwitchInterval] = React.useState(2600);
  const [marqueeDuration, setMarqueeDuration] = React.useState(5200);
  const noticeItems = [
    '系统维护中，部分功能可能受影响。',
    '预计 02:30 恢复服务。',
    '如有疑问请联系值班同学。',
  ];

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <PageHeader title="Notice Bar" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <NoticeBar className="mt-3" icon="!" text="系统维护中，部分功能可能受影响。" />
        </Card>

        <Card>
          <div className="text-sm font-semibold">Auto Switch / Marquee</div>
          <div className="mt-3 space-y-2">
            <NoticeBar
              icon="!"
              items={noticeItems}
              isAutoPlay
              switchInterval={switchInterval}
              marqueeDuration={marqueeDuration}
            />
            <NoticeBar
              color="info"
              text="这是一条超长文案示例，用于展示从右向左移动的文字轮播动画。"
              isMarquee
              marqueeDuration={marqueeDuration}
            />
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-500">切换间隔（switchInterval）</div>
            <ButtonGroup size="sm" isBlock>
              {switchIntervalOptions.map((option) => (
                <Button
                  key={option.value}
                  color={switchInterval === option.value ? 'primary' : 'default'}
                  variant={switchInterval === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setSwitchInterval(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
            <div className="text-xs text-slate-500">文字滚动时长（marqueeDuration）</div>
            <ButtonGroup size="sm" isBlock>
              {marqueeDurationOptions.map((option) => (
                <Button
                  key={option.value}
                  color={marqueeDuration === option.value ? 'primary' : 'default'}
                  variant={marqueeDuration === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setMarqueeDuration(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
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
