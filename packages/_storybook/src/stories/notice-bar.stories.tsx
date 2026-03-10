import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonGroup, NoticeBar } from '@srcube-ui/react';
import { useState } from 'react';
import { StoryPage, StorySection, StoryStack } from '../lib/story-layout';

const switchIntervalOptions = [
  { label: '1.8s', value: 1800 },
  { label: '2.6s', value: 2600 },
  { label: '3.6s', value: 3600 },
] as const;

const marqueeDurationOptions = [
  { label: '4.2s', value: 4200 },
  { label: '5.2s', value: 5200 },
  { label: '6.8s', value: 6800 },
] as const;

const meta = {
  title: 'Components/NoticeBar',
  component: NoticeBar,
  tags: ['autodocs'],
  args: {
    text: '系统维护中，部分功能可能受影响。',
    color: 'default',
    size: 'md',
    isClosable: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof NoticeBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function NoticeBarShowcase() {
  const [switchInterval, setSwitchInterval] = useState(2600);
  const [marqueeDuration, setMarqueeDuration] = useState(5200);

  const noticeItems = [
    '系统维护中，部分功能可能受影响。',
    '预计 02:30 恢复服务。',
    '如有疑问请联系值班同学。',
  ];

  return (
    <StoryPage>
      <StoryStack>
        <StorySection title="Basic">
          <div className="w-full">
            <NoticeBar icon="!" text="系统维护中，部分功能可能受影响。" />
          </div>
        </StorySection>

        <StorySection title="Auto Switch / Marquee">
          <div className="w-full space-y-2">
            <NoticeBar
              icon="!"
              items={noticeItems}
              isAutoPlay
              switchInterval={switchInterval}
              marqueeDuration={marqueeDuration}
            />
            <NoticeBar
              color="info"
              text="这是一条超长文案示例，用于展示从右向左移动的文字轮播动画。"
              isMarquee
              marqueeDuration={marqueeDuration}
            />
          </div>
          <div className="w-full space-y-2 pt-1">
            <ButtonGroup size="sm" isBlock>
              {switchIntervalOptions.map((option) => (
                <Button
                  key={option.value}
                  color={switchInterval === option.value ? 'primary' : 'default'}
                  variant={switchInterval === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setSwitchInterval(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
            <ButtonGroup size="sm" isBlock>
              {marqueeDurationOptions.map((option) => (
                <Button
                  key={option.value}
                  color={marqueeDuration === option.value ? 'primary' : 'default'}
                  variant={marqueeDuration === option.value ? 'solid' : 'flat'}
                  onTap={() => {
                    setMarqueeDuration(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </StorySection>

        <StorySection title="Colors">
          <div className="w-full space-y-2">
            <NoticeBar color="default" text="默认提示" />
            <NoticeBar color="info" text="信息提示" />
            <NoticeBar color="success" text="成功提示" />
            <NoticeBar color="warning" text="警告提示" />
            <NoticeBar color="danger" text="危险提示" />
          </div>
        </StorySection>

        <StorySection title="Sizes / Closable">
          <div className="w-full space-y-2">
            <NoticeBar size="sm" text="Small" isClosable />
            <NoticeBar size="md" text="Medium" action={<span>查看</span>} isClosable />
            <NoticeBar size="lg" text="Large" isClosable />
          </div>
        </StorySection>
      </StoryStack>
    </StoryPage>
  );
}

export const Showcase: Story = {
  render: () => <NoticeBarShowcase />,
};
