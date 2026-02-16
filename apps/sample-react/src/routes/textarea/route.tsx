import { Button, ButtonGroup } from '@srcube-ui/button';
import { Textarea } from '@srcube-ui/textarea';
import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import PageHeader from '@/components/page-header';

export const Route = createFileRoute('/textarea')({
  component: TextareaDemo,
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

type TextareaColor = (typeof colorGroups)[number][number]['value'];

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

function TextareaDemo() {
  const [bio, setBio] = useState('');
  const [activeColor, setActiveColor] = useState<TextareaColor>('default');
  const [previewValue, setPreviewValue] = useState(
    'A longer content for preview',
  );

  return (
    <main className="min-h-screen bg-slate-100 pb-24 text-slate-900">
      <PageHeader title="Textarea" />

      <div className="px-4 pb-8">
        <Section
          title="Basic"
          description="Textarea 使用 Field 多行布局，前后缀与 clear 对齐首行"
        >
          <Textarea
            label="简介"
            value={bio}
            rows={4}
            placeholder="请输入内容"
            description="可输入多行文本"
            isClearable
            onValueChange={setBio}
          />
          <div className="mt-2 text-xs text-slate-500">
            Value: {bio || 'empty'}
          </div>
        </Section>

        <Section title="Label Placement" description="outside / outside-left / inside">
          <div className="space-y-3">
            <Textarea
              label="Outside"
              value="field value"
              rows={3}
              labelPlacement="outside"
              isClearable
              showCount
            />
            <Textarea
              label="Outside Left"
              value="field value"
              rows={3}
              labelPlacement="outside-left"
              isClearable
              showCount
            />
            <Textarea
              label="Inside"
              value="field value"
              rows={3}
              labelPlacement="inside"
              isClearable
              showCount
            />
          </div>
        </Section>

        <Section
          title="Auto Height"
          description="isAutoHeight=true 时按内容增长高度"
        >
          <Textarea
            label="Auto Height"
            value={previewValue}
            isAutoHeight
            isClearable
            onValueChange={setPreviewValue}
          />
        </Section>

        <Section
          title="Variants"
          description="default / outline / twotone / underline"
        >
          <div className="space-y-3">
            <Textarea label="Default" value="field value" variant="default" />
            <Textarea label="Outline" value="field value" variant="outline" />
            <Textarea label="Twotone" value="field value" variant="twotone" />
            <Textarea
              label="Underline"
              value="field value"
              variant="underline"
            />
          </div>
        </Section>

        <Section title="Sizes" description="sm / md / lg">
          <div className="space-y-3">
            <Textarea label="Small" value="field value" size="sm" />
            <Textarea label="Medium" value="field value" size="md" />
            <Textarea label="Large" value="field value" size="lg" />
          </div>
        </Section>

        <Section title="States" description="invalid / disabled / readOnly">
          <div className="space-y-3">
            <Textarea
              label="Invalid"
              value="invalid value"
              errorMessage="该字段格式不正确"
              variant="outline"
              color="danger"
              isInvalid
            />
            <Textarea
              label="Disabled"
              value="disabled value"
              description="disabled state"
              isDisabled
            />
            <Textarea
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
              <ButtonGroup
                key={`textarea-color-${groupIndex}`}
                size="sm"
                isBlock
              >
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

          <Textarea
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
