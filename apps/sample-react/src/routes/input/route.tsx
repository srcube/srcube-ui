import { Button, ButtonGroup, Input } from '@srcube-ui/react';
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

function InputDemo() {
  const [tone, setTone] = useState<'default' | 'dark'>('default');
  const [phone, setPhone] = useState('');
  const [activeColor, setActiveColor] = useState<InputColor>('default');
  const [previewValue, setPreviewValue] = useState('123456');

  return (
    <main
      className={[
        'min-h-screen pb-24 transition-colors duration-200',
        tone === 'dark'
          ? 'bg-zinc-950 text-zinc-50'
          : 'bg-slate-100 text-slate-900',
      ].join(' ')}
    >
      <PageHeader title="Input" tone={tone} />

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
          description="Input 复用 Field 的 label/helper/start/end/clear"
          tone={tone}
        >
          <Input
            label="手机号"
            tone={tone}
            value={phone}
            placeholder="请输入手机号"
            description="支持中国大陆手机号"
            isClearable
            endContent={<span className="icon-[mingcute--phone-fill]" />}
            onValueChange={setPhone}
          />
          <div
            className={
              tone === 'dark'
                ? 'mt-2 text-xs text-zinc-400'
                : 'mt-2 text-xs text-slate-500'
            }
          >
            Value: {phone || 'empty'}
          </div>
        </Section>

        <Section
          title="Label Placement"
          description="outside / outside-left / inside"
          tone={tone}
        >
          <div className="space-y-3">
            <Input
              label="Outside"
              tone={tone}
              value="field value"
              labelPlacement="outside"
              isClearable
            />
            <Input
              label="Outside Left"
              tone={tone}
              value="field value"
              labelPlacement="outside-left"
              isClearable
            />
            <Input
              label="Inside"
              tone={tone}
              value="field value"
              labelPlacement="inside"
              isClearable
            />
          </div>
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
          tone={tone}
        >
          <div className="space-y-3">
            <Input
              label="Default"
              value="field value"
              tone={tone}
              variant="default"
            />
            <Input
              label="Outline"
              value="field value"
              tone={tone}
              variant="outline"
            />
            <Input
              label="Twotone"
              value="field value"
              tone={tone}
              variant="twotone"
            />
            <Input
              label="Underline"
              value="field value"
              tone={tone}
              variant="underline"
            />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg" tone={tone}>
          <div className="space-y-3">
            <Input label="Small" value="field value" tone={tone} size="sm" />
            <Input label="Medium" value="field value" tone={tone} size="md" />
            <Input label="Large" value="field value" tone={tone} size="lg" />
          </div>
        </Section>

        <Section
          title="States"
          description="invalid / disabled / readOnly"
          tone={tone}
        >
          <div className="space-y-3">
            <Input
              label="Invalid"
              value="invalid value"
              tone={tone}
              errorMessage="该字段格式不正确"
              variant="outline"
              color="danger"
              isInvalid
            />
            <Input
              label="Disabled"
              value="disabled value"
              tone={tone}
              description="disabled state"
              isDisabled
            />
            <Input
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
            {colorGroups.map((group, groupIndex) => (
              <ButtonGroup
                key={`input-color-${groupIndex}`}
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

          <Input
            className="mt-3"
            label="Color Preview"
            color={activeColor}
            tone={tone}
            value={previewValue}
            isClearable
            onValueChange={setPreviewValue}
          />

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
