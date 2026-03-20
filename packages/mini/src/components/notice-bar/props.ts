import type {
  NoticeBarMiniClassNames,
  NoticeBarVariants,
} from '@srcube-ui/styles/components/notice-bar/style';

export type NoticeBarMiniProps = NoticeBarVariants & {
  text?: string;
  items?: string[];
  icon?: string;
  actionText?: string;
  isClosable?: boolean;
  isAutoPlay?: boolean;
  isMarquee?: boolean;
  switchInterval?: number;
  switchDuration?: number;
  marqueeDuration?: number;
  isVisible?: boolean;
  defaultVisible?: boolean;
  tone?: 'default' | 'dark';
  className?: string;
  classNames?: Partial<NoticeBarMiniClassNames>;
  style?: string;
};

export const noticeBarMiniProps = {
  text: { type: String, value: '' },
  items: { type: Array, value: [] },
  icon: { type: String, value: '' },
  actionText: { type: String, value: '' },
  isClosable: { type: Boolean, value: false },
  isAutoPlay: { type: Boolean, value: false },
  isMarquee: { type: Boolean, value: false },
  switchInterval: { type: Number, value: 3000 },
  switchDuration: { type: Number, value: 280 },
  marqueeDuration: { type: Number, value: 6000 },
  isVisible: { type: Boolean, value: true },
  defaultVisible: { type: Boolean, value: true },
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  size: { type: null, value: 'md' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
