import { Switch } from '@srcube-ui/switch';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/switch')({
  component: SwitchDemo,
});

type DemoItem = {
  label: string;
  value: string;
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

function SwitchDemo() {
  const colors = useMemo<DemoItem[]>(
    () => [
      { label: 'Default', value: 'default' },
      { label: 'Primary', value: 'primary' },
      { label: 'Secondary', value: 'secondary' },
      { label: 'Success', value: 'success' },
      { label: 'Warning', value: 'warning' },
      { label: 'Danger', value: 'danger' },
    ],
    [],
  );

  const sizes = useMemo<DemoItem[]>(
    () => [
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
    ],
    [],
  );

  const [selectedColor, setSelectedColor] = useState('primary');
  const [selectedSize, setSelectedSize] = useState('md');
  const [isEnabled, setEnabled] = useState(true);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Switch" />
      <div className="px-4 pb-8">
        <Section title="Colors" description="color + controlled">
          <div className="flex flex-col gap-3">
            {colors.map((item) => (
              <Switch
                key={item.value}
                color={item.value as never}
                isSelected={selectedColor === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedColor(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </Section>

        <Section title="Sizes" description="size + controlled">
          <div className="flex flex-col gap-3">
            {sizes.map((item) => (
              <Switch
                key={item.value}
                size={item.value as never}
                isSelected={selectedSize === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedSize(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </Section>

        <Section title="Custom Icon" description="Iconify className">
          <div className="flex flex-wrap gap-4">
            <Switch
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--checkmark]`} />
              )}
            >
              Check
            </Switch>
            <Switch
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--flash]`} />
              )}
            >
              Flash
            </Switch>
          </div>
        </Section>

        <Section title="States">
          <div className="flex flex-col gap-3">
            <Switch isSelected={isEnabled} onValueChange={setEnabled}>
              Controlled
            </Switch>
            <Switch isDisabled>Disabled</Switch>
            <Switch isReadOnly defaultSelected>
              ReadOnly
            </Switch>
            <Switch isLoading>Loading</Switch>
            <Switch
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Switch>
          </div>
        </Section>
      </div>
    </main>
  );
}
