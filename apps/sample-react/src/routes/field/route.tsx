import { Button, ButtonGroup, Field } from '@srcube-ui/react';
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
  tone,
  children,
}: {
  title: string;
  description?: string;
  tone: 'default' | 'dark';
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'mt-6 rounded-2xl p-4 shadow-sm transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-900 text-zinc-50 shadow-black/20'
          : 'bg-white text-slate-900',
      ].join(' ')}
    >
      <div className="text-sm font-semibold">{title}</div>
      {description ? (
        <div
          className={[
            'mt-1 text-xs',
            tone === 'dark' ? 'text-zinc-400' : 'text-slate-500',
          ].join(' ')}
        >
          {description}
        </div>
      ) : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FieldDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const [basicValue, setBasicValue] = useState('');
  const [colorValue, setColorValue] = useState('123456');
  const [activeColor, setActiveColor] = useState<FieldColor>('default');

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Field" tone={tone} />

      <div className="px-4 pb-8">
        <Section title="Tone" tone={tone}>
          <div className="flex gap-2">
            <Button
              size="sm"
              color={tone === 'default' ? 'primary' : 'default'}
              variant={tone === 'default' ? 'solid' : 'flat'}
              onTap={() => setTone('default')}
            >
              default
            </Button>
            <Button
              size="sm"
              tone="dark"
              variant={tone === 'dark' ? 'solid' : 'flat'}
              onTap={() => setTone('dark')}
            >
              dark
            </Button>
          </div>
        </Section>

        <Section
          title="Basic"
          description="field 负责表现层，input 逻辑由业务控件承载"
          tone={tone}
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
            tone={tone}
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
          tone={tone}
        >
          <div className="space-y-3">
            <Field
              label="Outside"
              tone={tone}
              labelPlacement="outside"
              placeholder="outside"
            />
            <Field
              label="Left"
              tone={tone}
              labelPlacement="outside-left"
              placeholder="outside-left"
            />
            <Field
              label="Inside"
              tone={tone}
              labelPlacement="inside"
              placeholder="inside"
            />
          </div>
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
          tone={tone}
        >
          <div className="space-y-3">
            <Field
              label="Default"
              value="field value"
              tone={tone}
              variant="default"
            />
            <Field
              label="Outline"
              value="field value"
              tone={tone}
              variant="outline"
            />
            <Field
              label="Twotone"
              value="field value"
              tone={tone}
              variant="twotone"
            />
            <Field
              label="Underline"
              value="field value"
              tone={tone}
              variant="underline"
            />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg" tone={tone}>
          <div className="space-y-3">
            <Field label="Small" value="field value" tone={tone} size="sm" />
            <Field label="Medium" value="field value" tone={tone} size="md" />
            <Field label="Large" value="field value" tone={tone} size="lg" />
          </div>
        </Section>

        <Section
          title="Radius"
          description="none / sm / md / lg / full"
          tone={tone}
        >
          <div className="space-y-3">
            <Field
              label="Radius None"
              value="field value"
              tone={tone}
              variant="twotone"
              radius="none"
            />
            <Field
              label="Radius Sm"
              value="field value"
              tone={tone}
              variant="twotone"
              radius="sm"
            />
            <Field
              label="Radius Md"
              value="field value"
              tone={tone}
              variant="twotone"
              radius="md"
            />
            <Field
              label="Radius Lg"
              value="field value"
              tone={tone}
              variant="twotone"
              radius="lg"
            />
            <Field
              label="Radius Full"
              value="field value"
              tone={tone}
              variant="twotone"
              radius="full"
            />
          </div>
        </Section>

        <Section
          title="States"
          description="invalid / disabled / readOnly"
          tone={tone}
        >
          <div className="space-y-3">
            <Field
              label="Invalid"
              value="invalid value"
              tone={tone}
              errorMessage="该字段格式不正确"
              variant="outline"
              color="danger"
              isInvalid
            />
            <Field
              label="Disabled"
              value="disabled value"
              tone={tone}
              description="disabled state"
              isDisabled
            />
            <Field
              label="Readonly"
              value="readonly value"
              tone={tone}
              description="readonly state"
              isReadOnly
            />
          </div>
        </Section>

        <Section
          title="Colors"
          description="use 2 sm ButtonGroup to switch color"
          tone={tone}
        >
          <div className="flex flex-col gap-2">
            {fieldColorGroups.map((group, groupIndex) => (
              <ButtonGroup
                key={`field-color-${groupIndex}`}
                size="sm"
                tone={tone === 'dark' ? 'dark' : 'light'}
                isBlock
              >
                {group.map((item) => (
                  <Button
                    key={item.value}
                    tone={tone === 'dark' ? 'dark' : 'light'}
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
            tone={tone}
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

          <div
            className={
              tone === 'dark'
                ? 'mt-2 text-xs text-zinc-400'
                : 'mt-2 text-xs text-slate-500'
            }
          >
            Color: {activeColor}
          </div>
        </Section>
      </div>
    </main>
  );
}
