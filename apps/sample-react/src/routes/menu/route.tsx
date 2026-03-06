import { Button } from '@srcube-ui/react';
import { Menu } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/menu')({
  component: MenuDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>;
}

const menuItems = [
  { value: 'edit', label: '编辑' },
  { value: 'share', label: '分享' },
  { value: 'delete', label: '删除' },
] as const;

const horizontalItems = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'done', label: '已完成' },
] as const;

function MenuDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | number>('edit');

  return (
    <main className="min-h-screen bg-slate-100 pb-16 text-slate-900">
      <PageHeader title="Menu" />

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic (Controlled)</div>
          <div className="mt-3">
            <Menu
              trigger={<Button size="sm">更多操作</Button>}
              items={menuItems}
              isOpen={isOpen}
              value={value}
              color="primary"
              variant="flat"
              onOpenChange={setIsOpen}
              onValueChange={(nextValue) => {
                setValue(nextValue);
              }}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Orientation</div>
          <div className="mt-3 flex flex-wrap gap-4">
            <Menu
              trigger={<Button size="sm">横向菜单</Button>}
              items={horizontalItems}
              orientation="x"
              defaultValue="all"
              hasArrow={false}
            />
            <Menu
              trigger={<Button size="sm">纵向菜单</Button>}
              items={menuItems}
              orientation="y"
              defaultValue="edit"
              color="secondary"
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Size & Radius</div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Menu
              trigger={<Button size="sm">SM</Button>}
              items={menuItems}
              size="sm"
              radius="sm"
              hasArrow={false}
            />
            <Menu
              trigger={<Button size="sm">MD</Button>}
              items={menuItems}
              size="md"
              radius="md"
              hasArrow={false}
            />
            <Menu
              trigger={<Button size="sm">LG</Button>}
              items={menuItems}
              size="lg"
              radius="full"
              hasArrow={false}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Tone + Variant + Color</div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Menu
              trigger={<Button size="sm">Default Tone</Button>}
              items={menuItems}
              defaultValue="share"
              color="success"
              variant="solid"
            />
            <Menu
              trigger={<Button size="sm">Dark Tone</Button>}
              items={[
                { value: 'low', label: '低优先级' },
                { value: 'high', label: '高优先级' },
                { value: 'urgent', label: '紧急', isDisabled: true },
              ]}
              defaultValue="high"
              color="warning"
              variant="flat"
              tone="dark"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
