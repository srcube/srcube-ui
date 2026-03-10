import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, Stepper } from '@srcube-ui/react';
import { useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

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

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    label: 'Quantity',
    color: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
    min: 0,
    max: 10,
    step: 1,
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
} satisfies Meta<typeof Stepper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultValue: 2,
  },
};

function StepperShowcase() {
  const [basicValue, setBasicValue] = useState(2);
  const [activeColor, setActiveColor] = useState<StepperColor>('default');
  const [colorValue, setColorValue] = useState(3);

  return (
    <StoryPage>
      <StoryStack>
        <StorySection title="Basic">
          <div className="w-full">
            <Stepper
              label="Quantity"
             
              value={basicValue}
              min={0}
              max={10}
              step={0.5}
              precision={1}
              onValueChange={setBasicValue}
            />
            <div className="mt-2 text-xs text-slate-500">Value: {basicValue}</div>
          </div>
        </StorySection>

        <StorySection title="Label Placement">
          <div className="w-full space-y-3">
            <Stepper label="Outside" labelPlacement="outside" defaultValue={2} min={0} max={9} />
            <Stepper label="Left" labelPlacement="outside-left" defaultValue={2} min={0} max={9} />
            <Stepper label="Inside" labelPlacement="inside" defaultValue={2} min={0} max={9} />
          </div>
        </StorySection>

        <StorySection title="Variants">
          <div className="w-full space-y-3">
            <Stepper label="Default" defaultValue={2} variant="default" />
            <Stepper label="Outline" defaultValue={2} variant="outline" />
            <Stepper label="Twotone" defaultValue={2} variant="twotone" />
            <Stepper label="Underline" defaultValue={2} variant="underline" />
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="w-full space-y-3">
            <Stepper label="Small" defaultValue={2} size="sm" />
            <Stepper label="Medium" defaultValue={2} size="md" />
            <Stepper label="Large" defaultValue={2} size="lg" />
          </div>
        </StorySection>

        <StorySection title="Radius">
          <div className="w-full space-y-3">
            <Stepper label="Radius None" defaultValue={2} variant="twotone" radius="none" />
            <Stepper label="Radius Sm" defaultValue={2} variant="twotone" radius="sm" />
            <Stepper label="Radius Md" defaultValue={2} variant="twotone" radius="md" />
            <Stepper label="Radius Lg" defaultValue={2} variant="twotone" radius="lg" />
            <Stepper label="Radius Full" defaultValue={2} variant="twotone" radius="full" />
          </div>
        </StorySection>

        <StorySection title="States">
          <div className="w-full space-y-3">
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
            <Stepper label="Disabled" defaultValue={3} isDisabled />
            <Stepper label="Readonly" defaultValue={3} isReadOnly />
          </div>
        </StorySection>

        <StorySection title="Colors">
          <div className="flex w-full flex-col gap-2">
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

          <div className="w-full">
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
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <StepperShowcase />,
};
