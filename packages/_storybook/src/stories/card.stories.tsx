import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card } from '@srcube-ui/react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Card body content',
    color: 'default',
    size: 'md',
    radius: 'md',
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
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    header: '订单信息',
    children: '这里是卡片内容',
    footer: '这里是卡片底部',
  },
};

export const Showcase: Story = {
  render: () => (
    <StoryPage>
      <StoryStack>
        <StorySection title="Order card" description="header + body + footer actions">
          <Card
            header={<div>订单信息</div>}
            body={
              <div className="space-y-2 text-sm">
                <div>订单号：A20260218001</div>
                <div>收货人：Srcube</div>
                <div>金额：¥ 168.00</div>
              </div>
            }
            footer={
              <div className="flex gap-2">
                <Button size="sm" variant="flat" color="default">
                  取消
                </Button>
                <Button size="sm" color="primary">
                  确认
                </Button>
              </div>
            }
          />
        </StorySection>

        <StorySection title="Colors">
          <div className="grid w-full gap-3">
            <Card header={<div>Color: default</div>}>
              <div>默认样式</div>
            </Card>
            <Card color="primary" header={<div>Color: primary</div>}>
              <div>主色样式</div>
            </Card>
            <Card color="success" header={<div>Color: success</div>}>
              <div>成功色样式</div>
            </Card>
            <Card color="warning" header={<div>Color: warning</div>}>
              <div>警告色样式</div>
            </Card>
          </div>
        </StorySection>

        <StorySection title="Sizes and radius">
          <div className="grid w-full gap-3">
            <Card size="sm" radius="sm" header={<div>Small</div>}>
              <div>size=sm / radius=sm</div>
            </Card>
            <Card size="md" radius="md" color="secondary" header={<div>Medium</div>}>
              <div>size=md / radius=md</div>
            </Card>
            <Card size="lg" radius="lg" color="danger" header={<div>Large</div>}>
              <div>size=lg / radius=lg</div>
            </Card>
          </div>
        </StorySection>

        <StorySection title="应用里的示例卡片容器" description="模拟真实应用里的摘要卡片容器">
          <Card header={<div>本周发布进度</div>}>
            <div className="space-y-3 text-sm">
              <div className="font-medium text-slate-900">本周发布进度</div>
              <div className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600">
                已完成组件联调与样式回归，等待 QA 最终确认。
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>发布窗口</span>
                <span>今天 20:30</span>
              </div>
            </div>
          </Card>
        </StorySection>
      </StoryStack>
    </StoryPage>
  ),
};
