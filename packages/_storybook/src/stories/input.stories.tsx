import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, Input } from '@srcube-ui/react';
import { useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

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

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: '手机号',
    placeholder: '请输入手机号',
    color: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isClearable: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'twotone', 'underline'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: '13800138000',
    description: '支持中国大陆手机号',
    isClearable: true,
  },
};

function InputShowcase() {
  const [phone, setPhone] = useState('');
  const [activeColor, setActiveColor] = useState<InputColor>('default');
  const [previewValue, setPreviewValue] = useState('123456');

  return (
    <StoryPage>
      <StoryStack>
        <StorySection
          title="Basic"
         
        >
          <div className="w-full">
            <Input
              label="手机号"
              value={phone}
              placeholder="请输入手机号"
             
              isClearable
              endContent={<span className="icon-[mingcute--phone-fill]" />}
              onValueChange={setPhone}
            />
            <div className="mt-2 text-xs text-slate-500">Value: {phone || 'empty'}</div>
          </div>
        </StorySection>

        <StorySection title="Label placement">
          <div className="flex w-full flex-col gap-3">
            <Input label="Outside" value="field value" labelPlacement="outside" isClearable />
            <Input
              label="Outside Left"
              value="field value"
              labelPlacement="outside-left"
              isClearable
            />
            <Input label="Inside" value="field value" labelPlacement="inside" isClearable />
          </div>
        </StorySection>

        <StorySection title="Variants">
          <div className="flex w-full flex-col gap-3">
            <Input label="Default" value="field value" variant="default" />
            <Input label="Outline" value="field value" variant="outline" />
            <Input label="Twotone" value="field value" variant="twotone" />
            <Input label="Underline" value="field value" variant="underline" />
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="flex w-full flex-col gap-3">
            <Input label="Small" value="field value" size="sm" />
            <Input label="Medium" value="field value" size="md" />
            <Input label="Large" value="field value" size="lg" />
          </div>
        </StorySection>

        <StorySection title="States">
          <div className="flex w-full flex-col gap-3">
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
             
              isDisabled
            />
            <Input
              label="Readonly"
              value="readonly value"
             
              isReadOnly
            />
          </div>
        </StorySection>

        <StorySection title="Colors">
          <div className="flex w-full flex-col gap-2">
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

          <div className="w-full">
            <Input
              className="mt-3"
              label="Color Preview"
              color={activeColor}
              value={previewValue}
              isClearable
              onValueChange={setPreviewValue}
            />
            <div className="mt-2 text-xs text-slate-500">Color: {activeColor}</div>
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <InputShowcase />,
};
