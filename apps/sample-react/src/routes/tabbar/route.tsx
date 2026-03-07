import { Tabbar } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/tabbar')({
  component: TabbarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>
  );
}

const COLOR_DEMOS = [
  { color: 'default', label: 'Default' },
  { color: 'primary', label: 'Primary' },
  { color: 'secondary', label: 'Secondary' },
  { color: 'success', label: 'Success' },
  { color: 'warning', label: 'Warning' },
  { color: 'danger', label: 'Danger' },
] as const;

function TabbarDemo() {
  const [value, setValue] = useState<'home' | 'msg' | 'me'>('home');

  return (
    <main className="min-h-screen bg-slate-100 pb-20 text-slate-900">
      <PageHeader title="Tabbar" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <Tabbar
            className="mt-3"
            items={[
              {
                value: 'home',
                label: '首页',
                icon: (
                  <span className="icon-[mdi--home] text-base" aria-hidden />
                ),
                badge: true,
              },
              {
                value: 'msg',
                label: '消息',
                icon: (
                  <span
                    className="icon-[mdi--message-text] text-base"
                    aria-hidden
                  />
                ),
                badge: 12,
              },
              {
                value: 'me',
                label: '我的',
                icon: (
                  <span className="icon-[mdi--account] text-base" aria-hidden />
                ),
                badge: '99+',
              },
            ]}
            value={value}
            onValueChange={(next) => {
              if (next === 'home' || next === 'msg' || next === 'me') {
                setValue(next);
              }
            }}
          />
          <div className="mt-2 text-xs text-slate-500">Value: {value}</div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Colors</div>
          <div className="mt-3 space-y-3">
            {COLOR_DEMOS.map((item) => (
              <div key={item.color}>
                <div className="mb-1 text-xs text-slate-500">{item.label}</div>
                <Tabbar
                  color={item.color}
                  size={item.color === 'success' ? 'sm' : 'md'}
                  items={[
                    {
                      value: `${item.color}-discover`,
                      label: '发现',
                      icon: (
                        <span
                          className="icon-[mdi--compass-outline] text-base"
                          aria-hidden
                        />
                      ),
                    },
                    {
                      value: `${item.color}-notify`,
                      label: '通知',
                      icon: (
                        <span
                          className="icon-[mdi--bell-outline] text-base"
                          aria-hidden
                        />
                      ),
                      badge: item.color === 'default' ? true : '99+',
                    },
                    {
                      value: `${item.color}-profile`,
                      label: '我的',
                      icon: (
                        <span
                          className="icon-[mdi--account-outline] text-base"
                          aria-hidden
                        />
                      ),
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
