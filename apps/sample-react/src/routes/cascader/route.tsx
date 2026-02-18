import { Cascader } from '@srcube-ui/cascader';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/cascader')({
  component: CascaderDemo,
});

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">{children}</section>
  );
}

function CascaderDemo() {
  const options = useMemo(
    () => [
      {
        id: 'zj',
        label: '浙江',
        children: [
          {
            id: 'hz',
            label: '杭州',
            children: [
              { id: 'xh', label: '西湖区' },
              { id: 'yh', label: '余杭区' },
            ],
          },
          {
            id: 'nb',
            label: '宁波',
            children: [{ id: 'jb', label: '江北区' }],
          },
        ],
      },
      {
        id: 'gd',
        label: '广东',
        children: [
          {
            id: 'sz',
            label: '深圳',
            children: [
              { id: 'ns', label: '南山区' },
              { id: 'ft', label: '福田区' },
            ],
          },
          {
            id: 'gz',
            label: '广州',
            children: [
              { id: 'th', label: '天河区' },
              { id: 'yx', label: '越秀区' },
            ],
          },
        ],
      },
    ],
    [],
  );

  const [value, setValue] = useState<Array<string | number | null>>([
    'zj',
    'hz',
    'xh',
  ]);

  return (
    <main className="min-h-screen bg-slate-100 pb-safe-4 text-slate-900">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-4">
        <div className="text-lg font-semibold">Cascader</div>
      </div>

      <div className="space-y-6 p-4">
        <Card>
          <div className="text-sm font-semibold">Basic</div>
          <div className="mt-3">
            <Cascader
              label="地区"
              options={options}
              value={value}
              onValueChange={setValue}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Colors</div>
          <div className="mt-3 space-y-3">
            <Cascader
              label="Default"
              options={options}
              defaultValue={['zj', 'hz', 'xh']}
            />
            <Cascader
              label="Primary"
              color="primary"
              options={options}
              defaultValue={['gd', 'sz', 'ns']}
            />
            <Cascader
              label="Success"
              color="success"
              options={options}
              defaultValue={['gd', 'gz', 'th']}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Sizes</div>
          <div className="mt-3 space-y-3">
            <Cascader
              size="sm"
              label="Small"
              options={options}
              defaultValue={['zj', 'hz', 'xh']}
            />
            <Cascader
              size="md"
              label="Medium"
              options={options}
              defaultValue={['zj', 'nb', 'jb']}
            />
            <Cascader
              size="lg"
              label="Large"
              options={options}
              defaultValue={['gd', 'sz', 'ft']}
            />
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">States</div>
          <div className="mt-3 space-y-3">
            <Cascader
              label="Disabled"
              isDisabled
              options={options}
              defaultValue={['zj', 'hz', 'xh']}
            />
            <Cascader
              label="Read Only"
              isReadOnly
              options={options}
              defaultValue={['gd', 'sz', 'ns']}
            />
            <Cascader
              label="Invalid"
              isInvalid
              errorMessage="请选择有效地区"
              options={options}
              defaultValue={['gd', 'gz', 'th']}
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
