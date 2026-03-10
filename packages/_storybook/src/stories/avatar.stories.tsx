import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@srcube-ui/react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Srcube User',
    color: 'default',
    size: 'md',
    radius: 'full',
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    radius: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    name: 'Taylor Swift',
  },
};

export const Showcase: Story = {
  render: () => (
    <StoryPage>
      <StoryStack>
        <StorySection title="Basic">
          <Avatar name="Srcube User" />
          <Avatar name="Taylor Swift" color="primary" />
          <Avatar icon="?" color="warning" />
          <Avatar fallback="FB" color="danger" />
        </StorySection>

        <StorySection title="Image / Sizes">
          <div className="flex items-end gap-3">
            <Avatar size="sm" src="https://picsum.photos/80" alt="sm" />
            <Avatar size="md" src="https://picsum.photos/100" alt="md" />
            <Avatar size="lg" src="https://picsum.photos/120" alt="lg" />
            <Avatar size="xl" src="https://picsum.photos/140" alt="xl" isBordered />
          </div>
        </StorySection>

        <StorySection title="Radius">
          <Avatar radius="none" name="RN" />
          <Avatar radius="sm" name="RS" />
          <Avatar radius="md" name="RM" />
          <Avatar radius="lg" name="RL" />
          <Avatar radius="full" name="RF" />
        </StorySection>
      </StoryStack>
    </StoryPage>
  ),
};
