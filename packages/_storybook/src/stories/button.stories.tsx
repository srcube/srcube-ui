import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup } from '@srcube-ui/react';
import { StorySection, StoryStack } from '../lib/story-layout';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    isLoading: false,
    isBlock: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'flat', 'text'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    radius: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    onTap: { action: 'tapped' },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <StoryStack>
      <StorySection title="Colors" description="color + variant=solid">
        <Button color="default">Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
      </StorySection>

      <StorySection title="Variants" description="color=primary">
        <Button variant="solid">Solid</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="flat">Flat</Button>
        <Button variant="text">Text</Button>
      </StorySection>

      <StorySection title="Sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </StorySection>

      <StorySection title="Radius">
        <Button radius="none">None</Button>
        <Button radius="sm">Small</Button>
        <Button radius="md">Medium</Button>
        <Button radius="lg">Large</Button>
        <Button radius="full">Full</Button>
      </StorySection>

      <StorySection title="States">
        <Button>Normal</Button>
        <Button isDisabled>Disabled</Button>
        <Button isLoading>Loading</Button>
        <Button
          isLoading="auto"
          onTap={async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
          }}
        >
          Auto Loading
        </Button>
      </StorySection>

      <StorySection title="Icons">
        <Button isIcon aria-label="Add">
          <span aria-hidden className="text-lg">
            +
          </span>
        </Button>
        <Button>
          <span aria-hidden className="text-lg">
            ☆
          </span>
          <span>Star</span>
        </Button>
      </StorySection>

      <StorySection title="Block layout">
        <div className="w-full space-y-2">
          <Button isBlock>Primary Block</Button>
          <Button isBlock variant="outline">
            Outline Block
          </Button>
        </div>
      </StorySection>

      <StorySection title="ButtonGroup">
        <div className="flex w-full flex-col gap-3">
          <ButtonGroup>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
          <ButtonGroup isBlock>
            <Button>Yes</Button>
            <Button variant="outline">No</Button>
          </ButtonGroup>
        </div>
      </StorySection>
    </StoryStack>
  ),
};
