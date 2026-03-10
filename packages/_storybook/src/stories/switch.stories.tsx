import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@srcube-ui/react';
import { useMemo, useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

type DemoItem = {
  label: string;
  value: string;
};

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    children: 'Switch',
    color: 'primary',
    size: 'md',
    isDisabled: false,
    isReadOnly: false,
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
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultSelected: true,
  },
};

function SwitchShowcase() {
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

  const [selectedColor, setSelectedColor] = useState('primary');
  const [selectedSize, setSelectedSize] = useState('md');
  const [isEnabled, setEnabled] = useState(true);

  return (
    <StoryPage>
      <StoryStack>
        <StorySection title="Colors">
          <div className="flex w-full flex-col gap-3">
            {colors.map((item) => (
              <Switch
                key={item.value}
                color={item.value as never}
                isSelected={selectedColor === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedColor(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </StorySection>

        <StorySection title="Sizes">
          <div className="flex w-full flex-col gap-3">
            {sizes.map((item) => (
              <Switch
                key={item.value}
                size={item.value as never}
                isSelected={selectedSize === item.value}
                onValueChange={(next) => {
                  if (next) {
                    setSelectedSize(item.value);
                  }
                }}
              >
                {item.label}
              </Switch>
            ))}
          </div>
        </StorySection>

        <StorySection title="Custom icon">
          <div className="flex w-full flex-wrap gap-4">
            <Switch
              defaultSelected
              icon={({ className }) => <span className={`${className} icon-[ion--checkmark]`} />}
            >
              Check
            </Switch>
            <Switch
              defaultSelected
              icon={({ className }) => <span className={`${className} icon-[ion--flash]`} />}
            >
              Flash
            </Switch>
          </div>
        </StorySection>

        <StorySection title="States">
          <div className="flex w-full flex-col gap-3">
            <Switch isSelected={isEnabled} onValueChange={setEnabled}>
              Controlled
            </Switch>
            <Switch isDisabled>Disabled</Switch>
            <Switch isReadOnly defaultSelected>
              ReadOnly
            </Switch>
            <Switch isLoading>Loading</Switch>
            <Switch
              isLoading="auto"
              onTap={async () => {
                await new Promise((resolve) => setTimeout(resolve, 800));
              }}
            >
              Auto Loading
            </Switch>
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <SwitchShowcase />,
};
