import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from '@srcube-ui/react';
import { useMemo, useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

type DemoItem = {
  label: string;
  value: string;
};

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  args: {
    children: 'Radio',
    color: 'primary',
    size: 'md',
    isDisabled: false,
    isLoading: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function RadioShowcase() {
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
    <StoryPage>
      <StoryStack>
        <StorySection title="Colors">
          <div className="w-full">
            <RadioGroup value={colorValue} onValueChange={setColorValue} orientation="y" isBlock>
              {colors.map((item) => (
                <Radio key={item.value} value={item.value} color={item.value as never}>
                  {item.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="w-full">
            <RadioGroup value={sizeValue} onValueChange={setSizeValue} orientation="y" isBlock>
              {sizes.map((item) => (
                <Radio key={item.value} value={item.value} size={item.value as never}>
                  {item.label}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </StorySection>

        <StorySection title="Custom icon">
          <div className="flex w-full flex-wrap gap-4">
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
        </StorySection>

        <StorySection title="States">
          <div className="flex w-full flex-wrap gap-4">
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
        </StorySection>

        <StorySection title="Group">
          <div className="w-full space-y-3">
            <RadioGroup value={groupValue} onValueChange={setGroupValue} orientation="y" isBlock>
              <Radio value="left">Left</Radio>
              <Radio value="middle">Middle</Radio>
              <Radio value="right">Right</Radio>
            </RadioGroup>
            <RadioGroup orientation="x" defaultValue="a">
              <Radio value="a">Option A</Radio>
              <Radio value="b">Option B</Radio>
            </RadioGroup>
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <RadioShowcase />,
};
