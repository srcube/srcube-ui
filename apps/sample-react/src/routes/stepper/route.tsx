import { Button, ButtonGroup } from '@srcube-ui/react';
import { Stepper } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/stepper')({
  component: StepperDemo,
});

const stepperColorGroups = [
  [
    { label: 'default', value: 'default' },
    { label: 'primary', value: 'primary' },
    { label: 'success', value: 'success' },
  ],
  [
    { label: 'secondary', value: 'secondary' },
    { label: 'warning', value: 'warning' },
    { label: 'danger', value: 'danger' },
  ],
] as const;

type StepperColor = (typeof stepperColorGroups)[number][number]['value'];

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
      <div className="mt-3">{children}</div>
    </section>
  );
}

function StepperDemo() {
  const [basicValue, setBasicValue] = useState(2);
  const [activeColor, setActiveColor] = useState<StepperColor>('default');
  const [colorValue, setColorValue] = useState(3);

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Stepper" />

      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="field 负责表现层，stepper 只负责数值步进逻辑"
        >
          <Stepper
            label="Quantity"
            description="Use +/- or input number"
            value={basicValue}
            min={0}
            max={10}
            step={0.5}
            precision={1}
            onValueChange={setBasicValue}
          />

          <div className="mt-2 text-xs text-slate-500">Value: {basicValue}</div>
        </Section>

        <Section
          title="Label Placement"
          description="outside / outside-left / inside"
        >
          <div className="space-y-3">
            <Stepper
              label="Outside"
              labelPlacement="outside"
              defaultValue={2}
              min={0}
              max={9}
            />
            <Stepper
              label="Left"
              labelPlacement="outside-left"
              defaultValue={2}
              min={0}
              max={9}
            />
            <Stepper
              label="Inside"
              labelPlacement="inside"
              defaultValue={2}
              min={0}
              max={9}
            />
          </div>
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
        >
          <div className="space-y-3">
            <Stepper label="Default" defaultValue={2} variant="default" />
            <Stepper label="Outline" defaultValue={2} variant="outline" />
            <Stepper label="Twotone" defaultValue={2} variant="twotone" />
            <Stepper label="Underline" defaultValue={2} variant="underline" />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <div className="space-y-3">
            <Stepper label="Small" defaultValue={2} size="sm" />
            <Stepper label="Medium" defaultValue={2} size="md" />
            <Stepper label="Large" defaultValue={2} size="lg" />
          </div>
        </Section>

        <Section title="Radius" description="none / sm / md / lg / full">
          <div className="space-y-3">
            <Stepper label="Radius None" defaultValue={2} variant="twotone" radius="none" />
            <Stepper label="Radius Sm" defaultValue={2} variant="twotone" radius="sm" />
            <Stepper label="Radius Md" defaultValue={2} variant="twotone" radius="md" />
            <Stepper label="Radius Lg" defaultValue={2} variant="twotone" radius="lg" />
            <Stepper label="Radius Full" defaultValue={2} variant="twotone" radius="full" />
          </div>
        </Section>

        <Section title="States" description="invalid / disabled / readOnly">
          <div className="space-y-3">
            <Stepper
              label="Invalid"
              value={12}
              min={0}
              max={9}
              variant="outline"
              color="danger"
              errorMessage="数值超出范围"
              isInvalid
            />
            <Stepper
              label="Disabled"
              defaultValue={3}
              description="disabled state"
              isDisabled
            />
            <Stepper
              label="Readonly"
              defaultValue={3}
              description="readonly state"
              isReadOnly
            />
          </div>
        </Section>

        <Section
          title="Colors"
          description="use 2 sm ButtonGroup to switch color"
        >
          <div className="flex flex-col gap-2">
            {stepperColorGroups.map((group, groupIndex) => (
              <ButtonGroup key={`stepper-color-${groupIndex}`} size="sm" isBlock>
                {group.map((item) => (
                  <Button
                    key={item.value}
                    color={activeColor === item.value ? item.value : 'default'}
                    variant={activeColor === item.value ? 'solid' : 'flat'}
                    onTap={() => {
                      setActiveColor(item.value);
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </ButtonGroup>
            ))}
          </div>

          <Stepper
            className="mt-3"
            label="Color Preview"
            color={activeColor}
            min={0}
            max={9}
            value={colorValue}
            onValueChange={setColorValue}
          />

          <div className="mt-2 text-xs text-slate-500">Color: {activeColor}</div>
        </Section>
      </div>
    </main>
  );
}
