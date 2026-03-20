import { Button } from '@srcube-ui/react';
import { Navbar } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/navbar')({
  component: NavbarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function NavbarDemo() {
  const [titleAlign, setTitleAlign] = useState<'start' | 'center' | 'end'>(
    'center',
  );
  const [tone, setTone] = useState<'default' | 'dark'>('default');

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <PageHeader title="Navbar" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Tone</div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              color={tone === 'default' ? 'primary' : 'default'}
              variant={tone === 'default' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('default');
              }}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              color={tone === 'dark' ? 'default' : 'default'}
              variant={tone === 'dark' ? 'solid' : 'flat'}
              onTap={() => {
                setTone('dark');
              }}
            >
              dark
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <Navbar
            className="mt-3"
            title="订单详情"
            titleAlign={titleAlign}
            tone={tone}
          />
        </Card>

        <Card>
          <div className="text-sm font-semibold">Title Align</div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              color={titleAlign === 'start' ? 'primary' : 'default'}
              variant={titleAlign === 'start' ? 'solid' : 'flat'}
              onTap={() => {
                setTitleAlign('start');
              }}
            >
              start
            </Button>
            <Button
              size="sm"
              color={titleAlign === 'center' ? 'primary' : 'default'}
              variant={titleAlign === 'center' ? 'solid' : 'flat'}
              onTap={() => {
                setTitleAlign('center');
              }}
            >
              center
            </Button>
            <Button
              size="sm"
              color={titleAlign === 'end' ? 'primary' : 'default'}
              variant={titleAlign === 'end' ? 'solid' : 'flat'}
              onTap={() => {
                setTitleAlign('end');
              }}
            >
              end
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">With Back</div>
          <Navbar
            className="mt-3"
            title="消息"
            withBack
            titleAlign={titleAlign}
            tone={tone}
            onBack={(event) => {
              console.log('Navbar onBack', event.type);
            }}
            endContent={
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition-colors duration-150"
                aria-label="More"
              >
                <span aria-hidden className="icon-more text-lg leading-none" />
              </button>
            }
          />
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes</div>
          <div className="mt-3 space-y-2">
            <Navbar size="sm" title="Small" titleAlign={titleAlign} tone={tone} />
            <Navbar size="md" title="Medium" titleAlign={titleAlign} tone={tone} />
            <Navbar size="lg" title="Large" titleAlign={titleAlign} tone={tone} />
          </div>
        </Card>
      </div>
    </main>
  );
}
