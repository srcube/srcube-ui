import { Button, ButtonGroup } from '@srcube-ui/react';
import { Field } from '@srcube-ui/react';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/field')({
  component: FieldDemo,
});

const fieldColorGroups = [
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

type FieldColor = (typeof fieldColorGroups)[number][number]['value'];

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

function FieldDemo() {
  const [basicValue, setBasicValue] = useState('');
  const [colorValue, setColorValue] = useState('123456');
  const [activeColor, setActiveColor] = useState<FieldColor>('default');

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Field" />

      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="field 负责表现层，input 逻辑由业务控件承载"
        >
          <Field
            label="手机号"
            description="请输入 11 位手机号"
            isClearable
            value={basicValue}
            onValueChange={setBasicValue}
            onClear={() => {
              setBasicValue('');
            }}
            endContent={<span className="icon-[mingcute--phone-fill]" />}
          >
            {({ id, className, value, onValueChange }) => (
              <input
                id={id}
                className={`${className} bg-transparent outline-none`}
                value={value}
                placeholder="例如：13800000000"
                onChange={(event) => {
                  onValueChange(event.target.value);
                }}
              />
            )}
          </Field>
        </Section>

        <Section
          title="Label Placement"
          description="outside / outside-left / inside"
        >
          <div className="space-y-3">
            <Field
              label="Outside"
              labelPlacement="outside"
              placeholder="outside"
            />
            <Field
              label="Left"
              labelPlacement="outside-left"
              placeholder="outside-left"
            />
            <Field
              label="Inside"
              labelPlacement="inside"
              placeholder="inside"
            />
          </div>
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
        >
          <div className="space-y-3">
            <Field label="Default" value="field value" variant="default" />
            <Field label="Outline" value="field value" variant="outline" />
            <Field label="Twotone" value="field value" variant="twotone" />
            <Field label="Underline" value="field value" variant="underline" />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <div className="space-y-3">
            <Field label="Small" value="field value" size="sm" />
            <Field label="Medium" value="field value" size="md" />
            <Field label="Large" value="field value" size="lg" />
          </div>
        </Section>

        <Section title="Radius" description="none / sm / md / lg / full">
          <div className="space-y-3">
            <Field
              label="Radius None"
              value="field value"
              variant="twotone"
              radius="none"
            />
            <Field
              label="Radius Sm"
              value="field value"
              variant="twotone"
              radius="sm"
            />
            <Field
              label="Radius Md"
              value="field value"
              variant="twotone"
              radius="md"
            />
            <Field
              label="Radius Lg"
              value="field value"
              variant="twotone"
              radius="lg"
            />
            <Field
              label="Radius Full"
              value="field value"
              variant="twotone"
              radius="full"
            />
          </div>
        </Section>

        <Section title="States" description="invalid / disabled / readOnly">
          <div className="space-y-3">
            <Field
              label="Invalid"
              value="invalid value"
              errorMessage="该字段格式不正确"
              variant="outline"
              color="danger"
              isInvalid
            />
            <Field
              label="Disabled"
              value="disabled value"
              description="disabled state"
              isDisabled
            />
            <Field
              label="Readonly"
              value="readonly value"
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
            {fieldColorGroups.map((group, groupIndex) => (
              <ButtonGroup key={`field-color-${groupIndex}`} size="sm" isBlock>
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

          <Field
            className="mt-3"
            label="Color Preview"
            color={activeColor}
            isClearable
            value={colorValue}
            onValueChange={setColorValue}
            onClear={() => {
              setColorValue('');
            }}
          >
            {({ id, className, value, onValueChange }) => (
              <input
                id={id}
                className={`${className} bg-transparent outline-none`}
                value={value}
                onChange={(event) => {
                  onValueChange(event.target.value);
                }}
              />
            )}
          </Field>

          <div className="mt-2 text-xs text-slate-500">
            Color: {activeColor}
          </div>
        </Section>
      </div>
    </main>
  );
}
