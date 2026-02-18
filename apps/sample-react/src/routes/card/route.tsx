import { Button } from '@srcube-ui/button';
import { Card } from '@srcube-ui/card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/card')({
  component: CardDemo,
});

function CardDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Card</div>
      </div>

      <div className="space-y-6 p-4">
        <Card
          title="订单信息"
          description="2026-02-18 10:30"
          isHeaderDivider
          isFooterDivider
          footer={
            <>
              <Button size="sm" variant="flat">
                取消
              </Button>
              <Button size="sm" color="primary">
                确认
              </Button>
            </>
          }
        >
          <div className="space-y-2 text-sm text-slate-600">
            <div>订单号：A20260218001</div>
            <div>收货人：Srcube</div>
            <div>金额：¥ 168.00</div>
          </div>
        </Card>

        <Card
          title="无边框样式"
          shadow="none"
          isBordered={false}
          radius="lg"
          className="bg-slate-900 text-white"
          classNames={{
            title: 'text-white',
            description: 'text-slate-300',
          }}
        >
          <div className="text-sm text-slate-300">适用于强调块内容。</div>
        </Card>

        <div className="grid grid-cols-1 gap-3">
          <Card title="Small" size="sm">
            <div className="text-sm text-slate-600">size=sm</div>
          </Card>
          <Card title="Medium" size="md">
            <div className="text-sm text-slate-600">size=md</div>
          </Card>
          <Card title="Large" size="lg" shadow="md">
            <div className="text-sm text-slate-600">size=lg</div>
          </Card>
        </div>
      </div>
    </main>
  );
}
