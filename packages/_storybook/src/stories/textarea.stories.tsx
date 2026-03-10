import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, Textarea } from '@srcube-ui/react';
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

type TextareaColor = (typeof colorGroups)[number][number]['value'];

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: '简介',
    placeholder: '请输入内容',
    color: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
    rows: 4,
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isClearable: false,
    showCount: false,
    isAutoHeight: false,
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
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    value: 'A longer content for preview',
    description: '可输入多行文本',
    isClearable: true,
  },
};

function TextareaShowcase() {
  const [bio, setBio] = useState('');
  const [activeColor, setActiveColor] = useState<TextareaColor>('default');
  const [previewValue, setPreviewValue] = useState('A longer content for preview');

  return (
    <StoryPage>
      <StoryStack>
        <StorySection
          title="Basic"
         
        >
          <div className="w-full">
            <Textarea
              label="简介"
              value={bio}
              rows={4}
              placeholder="请输入内容"
             
              isClearable
              onValueChange={setBio}
            />
            <div className="mt-2 text-xs text-slate-500">Value: {bio || 'empty'}</div>
          </div>
        </StorySection>

        <StorySection title="Label placement">
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
        </StorySection>

        <StorySection title="Auto height">
          <Textarea
            label="Auto Height"
            value={previewValue}
            isAutoHeight
            isClearable
            onValueChange={setPreviewValue}
          />
        </StorySection>

        <StorySection title="Variants">
          <div className="space-y-3">
            <Textarea label="Default" value="field value" variant="default" />
            <Textarea label="Outline" value="field value" variant="outline" />
            <Textarea label="Twotone" value="field value" variant="twotone" />
            <Textarea label="Underline" value="field value" variant="underline" />
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="space-y-3">
            <Textarea label="Small" value="field value" size="sm" />
            <Textarea label="Medium" value="field value" size="md" />
            <Textarea label="Large" value="field value" size="lg" />
          </div>
        </StorySection>

        <StorySection title="States">
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
             
              isDisabled
            />
            <Textarea
              label="Readonly"
              value="readonly value"
             
              isReadOnly
            />
          </div>
        </StorySection>

        <StorySection title="Colors">
          <div className="flex w-full flex-col gap-2">
            {colorGroups.map((group, groupIndex) => (
              <ButtonGroup key={`textarea-color-${groupIndex}`} size="sm" isBlock>
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
            <Textarea
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
  render: () => <TextareaShowcase />,
};
