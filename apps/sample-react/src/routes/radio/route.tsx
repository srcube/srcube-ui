import { Radio, RadioGroup } from '@srcube-ui/radio';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/radio')({
  component: RadioDemo,
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

function RadioDemo() {
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

  const [colorValue, setColorValue] = useState('primary');
  const [sizeValue, setSizeValue] = useState('md');
  const [groupValue, setGroupValue] = useState('left');

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Radio" />
      <div className="px-4 pb-8">
        <Section title="Colors" description="color + group">
          <RadioGroup
            value={colorValue}
            onValueChange={setColorValue}
            orientation="y"
            isBlock
          >
            {colors.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                color={item.value as never}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </Section>

        <Section title="Sizes" description="size + group">
          <RadioGroup
            value={sizeValue}
            onValueChange={setSizeValue}
            orientation="y"
            isBlock
          >
            {sizes.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                size={item.value as never}
              >
                {item.label}
              </Radio>
            ))}
          </RadioGroup>
        </Section>

        <Section title="Custom Icon" description="Iconify className">
          <div className="flex flex-wrap gap-4">
            <Radio
              value="custom"
              defaultSelected
              icon={({ isSelected, className }) => (
                <span
                  className={`${className} ${isSelected ? 'icon-[ion--checkmark]' : 'icon-[ion--ellipse-outline]'}`}
                />
              )}
            >
              Check
            </Radio>
            <Radio
              value="custom-2"
              icon={({ className }) => (
                <span className={`${className} icon-[ion--chevron-back]`} />
              )}
            >
              Chevron
            </Radio>
          </div>
        </Section>

        <Section title="States">
          <div className="flex flex-wrap gap-4">
            <Radio defaultSelected>Normal</Radio>
            <Radio isDisabled>Disabled</Radio>
            <Radio isLoading>Loading</Radio>
            <Radio
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Radio>
          </div>
        </Section>

        <Section title="Group" description="orientation + isBlock">
          <RadioGroup
            value={groupValue}
            onValueChange={setGroupValue}
            orientation="y"
            isBlock
          >
            <Radio value="left">Left</Radio>
            <Radio value="middle">Middle</Radio>
            <Radio value="right">Right</Radio>
          </RadioGroup>
          <RadioGroup orientation="x" defaultValue="a">
            <Radio value="a">Option A</Radio>
            <Radio value="b">Option B</Radio>
          </RadioGroup>
        </Section>
      </div>
    </main>
  );
}
