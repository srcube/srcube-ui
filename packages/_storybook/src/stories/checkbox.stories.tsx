import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, CheckboxGroup } from '@srcube-ui/react';
import { useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    children: 'Checkbox',
    color: 'primary',
    size: 'md',
    radius: 'md',
    isDisabled: false,
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
    radius: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function CheckboxShowcase() {
  const [groupValue, setGroupValue] = useState<string[]>(['primary']);

  return (
    <StoryPage>
      <StoryStack>
        <StorySection title="Colors" description="group + color">
          <div className="w-full">
            <CheckboxGroup value={groupValue} onValueChange={setGroupValue} orientation="y" isBlock>
              <Checkbox value="default" color="default">Default</Checkbox>
              <Checkbox value="primary" color="primary">Primary</Checkbox>
              <Checkbox value="secondary" color="secondary">Secondary</Checkbox>
              <Checkbox value="success" color="success">Success</Checkbox>
              <Checkbox value="warning" color="warning">Warning</Checkbox>
              <Checkbox value="danger" color="danger">Danger</Checkbox>
            </CheckboxGroup>
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="flex w-full flex-col gap-3">
            <Checkbox size="sm" defaultSelected>Small</Checkbox>
            <Checkbox size="md" defaultSelected>Medium</Checkbox>
            <Checkbox size="lg" defaultSelected>Large</Checkbox>
          </div>
        </StorySection>

        <StorySection title="Radius">
          <div className="flex w-full flex-col gap-3">
            <Checkbox radius="none" defaultSelected>None</Checkbox>
            <Checkbox radius="sm" defaultSelected>Small</Checkbox>
            <Checkbox radius="md" defaultSelected>Medium</Checkbox>
            <Checkbox radius="lg" defaultSelected>Large</Checkbox>
            <Checkbox radius="full" defaultSelected>Full</Checkbox>
          </div>
        </StorySection>

        <StorySection title="States">
          <div className="flex w-full flex-col gap-3">
            <Checkbox>Unchecked</Checkbox>
            <Checkbox defaultSelected>Checked</Checkbox>
            <Checkbox isIndeterminate>Indeterminate</Checkbox>
            <Checkbox isDisabled>Disabled</Checkbox>
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <CheckboxShowcase />,
};
