import { Accordion } from '@srcube-ui/accordion';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';

export const Route = createFileRoute('/accordion')({
  component: AccordionDemo,
});

const orderItems = [
  {
    value: 'order',
    title: '订单信息',
    content: '订单号: NO.20260217001，状态: 已支付',
  },
  {
    value: 'shipping',
    title: '配送信息',
    content: '收货地址: 重庆渝中区，预计今天送达',
  },
  {
    value: 'invoice',
    title: '发票信息',
    content: '电子发票将发送至 chio@example.com',
  },
];

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function AccordionDemo() {
  const [singleValue, setSingleValue] = React.useState<string | number | null>('order');
  const [multipleValues, setMultipleValues] = React.useState<Array<string | number>>([
    'order',
    'shipping',
  ]);

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Accordion</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Controlled / Single</div>
          <Accordion
            className="mt-3"
            items={orderItems}
            value={singleValue}
            onValueChange={setSingleValue}
          />
          <div className="mt-2 text-xs text-slate-500">Value: {String(singleValue ?? '-')}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Controlled / Multiple</div>
          <Accordion
            className="mt-3"
            items={orderItems}
            selectionMode="multiple"
            value={multipleValues}
            onValueChange={(nextValue) => {
              setMultipleValues(Array.isArray(nextValue) ? nextValue : []);
            }}
            variant="twotone"
          />
          <div className="mt-2 text-xs text-slate-500">Values: {multipleValues.join(', ')}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes</div>
          <div className="mt-3 space-y-2">
            <Accordion items={orderItems.slice(0, 2)} size="sm" defaultValue="order" />
            <Accordion items={orderItems.slice(0, 2)} size="md" defaultValue="order" />
            <Accordion items={orderItems.slice(0, 2)} size="lg" defaultValue="order" />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">States</div>
          <div className="mt-3 space-y-2">
            <Accordion items={orderItems} defaultValue="order" radius="lg" />
            <Accordion
              items={orderItems}
              defaultValue="order"
              variant="soft"
              isSeparated={false}
              hasIndicator={false}
            />
            <Accordion items={orderItems} defaultValue="order" isDisabled />
          </div>
        </Card>
      </div>
    </main>
  );
}
