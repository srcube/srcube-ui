import { Button, ButtonGroup } from '@srcube-ui/button';
import { Input } from '@srcube-ui/input';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/input')({
  component: InputDemo,
});

const colorGroups = [
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

type InputColor = (typeof colorGroups)[number][number]['value'];

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

function InputDemo() {
  const [phone, setPhone] = useState('');
  const [activeColor, setActiveColor] = useState<InputColor>('default');
  const [previewValue, setPreviewValue] = useState('123456');

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Input" />

      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="Input 复用 Field 的 label/helper/start/end/clear"
        >
          <Input
            label="手机号"
            value={phone}
            placeholder="请输入手机号"
            description="支持中国大陆手机号"
            isClearable
            endContent={<span className="icon-[mingcute--phone-fill]" />}
            onValueChange={setPhone}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {phone || 'empty'}
          </div>
        </Section>

        <Section title="Label Placement" description="outside / outside-left / inside">
          <div className="space-y-3">
            <Input
              label="Outside"
              value="field value"
              labelPlacement="outside"
              isClearable
            />
            <Input
              label="Outside Left"
              value="field value"
              labelPlacement="outside-left"
              isClearable
            />
            <Input
              label="Inside"
              value="field value"
              labelPlacement="inside"
              isClearable
            />
          </div>
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
        >
          <div className="space-y-3">
            <Input label="Default" value="field value" variant="default" />
            <Input label="Outline" value="field value" variant="outline" />
            <Input label="Twotone" value="field value" variant="twotone" />
            <Input label="Underline" value="field value" variant="underline" />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <div className="space-y-3">
            <Input label="Small" value="field value" size="sm" />
            <Input label="Medium" value="field value" size="md" />
            <Input label="Large" value="field value" size="lg" />
          </div>
        </Section>

        <Section title="States" description="invalid / disabled / readOnly">
          <div className="space-y-3">
            <Input
              label="Invalid"
              value="invalid value"
              errorMessage="该字段格式不正确"
              variant="outline"
              color="danger"
              isInvalid
            />
            <Input
              label="Disabled"
              value="disabled value"
              description="disabled state"
              isDisabled
            />
            <Input
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
            {colorGroups.map((group, groupIndex) => (
              <ButtonGroup key={`input-color-${groupIndex}`} size="sm" isBlock>
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

          <Input
            className="mt-3"
            label="Color Preview"
            color={activeColor}
            value={previewValue}
            isClearable
            onValueChange={setPreviewValue}
          />

          <div className="mt-2 text-xs text-slate-500">
            Color: {activeColor}
          </div>
        </Section>
      </div>
    </main>
  );
}
