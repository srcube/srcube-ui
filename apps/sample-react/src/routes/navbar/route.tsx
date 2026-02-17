import { Button } from '@srcube-ui/button';
import { Navbar } from '@srcube-ui/navbar';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, Ellipsis } from 'lucide-react';

export const Route = createFileRoute('/navbar')({
  component: NavbarDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

function NavbarDemo() {
  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Navbar</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <Navbar className="mt-3" title="订单详情" />
        </Card>

        <Card>
          <div className="text-sm font-semibold">With Actions</div>
          <Navbar
            className="mt-3"
            title="消息"
            startContent={
              <Button variant="light" radius="full" size="sm" startContent={<ArrowLeft size={16} />}>
                返回
              </Button>
            }
            endContent={
              <Button isIconOnly variant="light" radius="full" size="sm" aria-label="More">
                <Ellipsis size={16} />
              </Button>
            }
          />
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes</div>
          <div className="mt-3 space-y-2">
            <Navbar size="sm" title="Small" />
            <Navbar size="md" title="Medium" />
            <Navbar size="lg" title="Large" />
          </div>
        </Card>
      </div>
    </main>
  );
}
