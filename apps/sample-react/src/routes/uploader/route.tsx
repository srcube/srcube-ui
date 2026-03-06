import { Uploader, type UploaderFile } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/uploader')({
  component: UploaderDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function UploaderDemo() {
  const [value, setValue] = React.useState<UploaderFile[]>([]);
  const [message, setMessage] = React.useState('请选择图片');

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <PageHeader title="Uploader" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Controlled</div>
          <div className="mt-3">
            <Uploader
              value={value}
              maxCount={5}
              helperText={message}
              onValueChange={(next) => {
                setValue(next);
                setMessage(`当前 ${next.length} 张`);
              }}
              onExceed={(detail) => {
                setMessage(
                  `超出限制：接受 ${detail.acceptedCount}，拒绝 ${detail.rejectedCount}`,
                );
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes</div>
          <div className="mt-3 space-y-3">
            <Uploader size="sm" maxCount={3} addText="Small" />
            <Uploader size="md" maxCount={3} color="primary" addText="Medium" />
            <Uploader size="lg" maxCount={3} color="success" addText="Large" />
          </div>
        </Card>
      </div>
    </main>
  );
}
