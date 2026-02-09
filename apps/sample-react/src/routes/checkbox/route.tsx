import { Checkbox, CheckboxGroup } from '@srcube-ui/checkbox';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/checkbox')({
  component: CheckboxDemo,
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

function CheckboxDemo() {
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

  const radii = useMemo<DemoItem[]>(
    () => [
      { label: 'None', value: 'none' },
      { label: 'Small', value: 'sm' },
      { label: 'Medium', value: 'md' },
      { label: 'Large', value: 'lg' },
      { label: 'Full', value: 'full' },
    ],
    [],
  );

  const [colorValue, setColorValue] = useState<string[]>(['primary']);
  const [sizeValue, setSizeValue] = useState<string[]>(['md']);
  const [radiusValue, setRadiusValue] = useState<string[]>(['md']);
  const [groupValue, setGroupValue] = useState<string[]>(['left']);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Checkbox" />
      <div className="px-4 pb-8">
        <Section title="Colors" description="color + group">
          <CheckboxGroup
            value={colorValue}
            onValueChange={setColorValue}
            orientation="y"
            isBlock
          >
            {colors.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                color={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section title="Sizes" description="size + group">
          <CheckboxGroup
            value={sizeValue}
            onValueChange={setSizeValue}
            orientation="y"
            isBlock
          >
            {sizes.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                size={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section title="Radius" description="radius + group">
          <CheckboxGroup
            value={radiusValue}
            onValueChange={setRadiusValue}
            orientation="y"
            isBlock
          >
            {radii.map((item) => (
              <Checkbox
                key={item.value}
                value={item.value}
                radius={item.value as never}
              >
                {item.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Section>

        <Section title="Custom Icon" description="Iconify className">
          <div className="flex flex-wrap gap-4">
            <Checkbox
              defaultSelected
              icon={({ className }) => (
                <span className={`${className} icon-[ion--checkmark]`} />
              )}
            >
              Check
            </Checkbox>
            <Checkbox
              isIndeterminate
              icon={({ className }) => (
                <span className={`${className} icon-[ion--remove]`} />
              )}
            >
              Indeterminate
            </Checkbox>
          </div>
        </Section>

        <Section title="States">
          <div className="flex flex-wrap gap-4">
            <Checkbox defaultSelected>Normal</Checkbox>
            <Checkbox isDisabled>Disabled</Checkbox>
            <Checkbox isLoading>Loading</Checkbox>
            <Checkbox
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Checkbox>
            <Checkbox isIndeterminate>Mixed</Checkbox>
            <Checkbox defaultSelected isLineThrough>
              Line Through
            </Checkbox>
          </div>
        </Section>

        <Section title="Group" description="orientation + isBlock">
          <CheckboxGroup
            value={groupValue}
            onValueChange={setGroupValue}
            orientation="y"
            isBlock
          >
            <Checkbox value="left">Left</Checkbox>
            <Checkbox value="middle">Middle</Checkbox>
            <Checkbox value="right">Right</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup defaultValue={['a']} orientation="x">
            <Checkbox value="a">Option A</Checkbox>
            <Checkbox value="b">Option B</Checkbox>
          </CheckboxGroup>
        </Section>
      </div>
    </main>
  );
}
