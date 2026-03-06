import { Button } from '@srcube-ui/react';
import { Card } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/card')({
  component: CardDemo,
});

function CardDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Card" />

      <div className="space-y-6 p-4">
        <Card
          header={<div>订单信息</div>}
          body={
            <div className="space-y-2 text-sm">
              <div>订单号：A20260218001</div>
              <div>收货人：Srcube</div>
              <div>金额：¥ 168.00</div>
            </div>
          }
          footer={
            <div className="flex gap-2">
              <Button size="sm" variant="flat" color="default">
                取消
              </Button>
              <Button size="sm" color="primary">
                确认
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 gap-3">
          <Card header={<div>Color: default</div>}>
            <div>默认样式</div>
          </Card>
          <Card color="primary" header={<div>Color: primary</div>}>
            <div>主色样式</div>
          </Card>
          <Card color="success" header={<div>Color: success</div>}>
            <div>成功色样式</div>
          </Card>
          <Card color="warning" header={<div>Color: warning</div>}>
            <div>警告色样式</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Card size="sm" radius="sm" header={<div>Small</div>}>
            <div>size=sm / radius=sm</div>
          </Card>
          <Card size="md" radius="md" color="secondary" header={<div>Medium</div>}>
            <div>size=md / radius=md</div>
          </Card>
          <Card size="lg" radius="lg" color="danger" header={<div>Large</div>}>
            <div>size=lg / radius=lg</div>
          </Card>
        </div>
      </div>
    </main>
  );
}
