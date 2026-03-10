import type { Meta, StoryObj } from '@storybook/react';
import { Collapse } from '@srcube-ui/react';
import { useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

const meta = {
  title: 'Components/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  args: {
    title: '配送信息',
    content: '重庆渝中区，预计今天送达',
    variant: 'default',
    size: 'md',
    radius: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'flat', 'outline'],
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
} satisfies Meta<typeof Collapse>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    defaultValue: true,
  },
};

function CollapseShowcase() {
  const [value, setValue] = useState(false);

  return (
    <StoryPage>
      <StoryStack>
        <StorySection title="Controlled">
          <div className="w-full space-y-2">
            <Collapse
              title="配送信息"
              content="重庆渝中区，预计今天送达"
              value={value}
              onValueChange={setValue}
            />
            <div className="text-xs text-slate-500">Expanded: {String(value)}</div>
          </div>
        </StorySection>

        <StorySection title="Variants">
          <div className="w-full space-y-2">
            <Collapse title="Default" content="无边框无背景" variant="default" defaultValue />
            <Collapse title="Flat" content="柔和背景风格" variant="flat" defaultValue />
            <Collapse title="Outline" content="边框风格" variant="outline" defaultValue />
          </div>
        </StorySection>

        <StorySection title="Sizes / States">
          <div className="w-full space-y-2">
            <Collapse title="Small" content="size=sm" size="sm" defaultValue />
            <Collapse title="Medium" content="size=md" size="md" defaultValue />
            <Collapse title="Large" content="size=lg" size="lg" defaultValue />
            <Collapse title="Radius None" content="radius=none" variant="flat" radius="none" defaultValue />
            <Collapse title="Radius Sm" content="radius=sm" variant="flat" radius="sm" defaultValue />
            <Collapse title="Radius Md" content="radius=md" variant="flat" radius="md" defaultValue />
            <Collapse title="Radius Lg" content="radius=lg" variant="flat" radius="lg" defaultValue />
            <Collapse title="No Indicator" content="隐藏右侧图标" hasIndicator={false} defaultValue />
            <Collapse title="Disabled" content="禁用状态" isDisabled defaultValue />
          </div>
        </StorySection>

        <StorySection title="Custom Title Node">
          <div className="w-full space-y-2">
            <Collapse
              title={(
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="icon-[mingcute--notification-fill] text-base text-primary" />
                  <span>系统通知</span>
                </span>
              )}
              content="title 支持 ReactNode，可在左侧放 iconify 图标。"
              defaultValue
            />
            <Collapse
              variant="outline"
              title={(
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden className="icon-[mdi--calendar-blank] text-base text-slate-500" />
                  <span>日程提醒</span>
                </span>
              )}
              content="这里是另一种图标 + 标题组合样式。"
              defaultValue
            />
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <CollapseShowcase />,
};
