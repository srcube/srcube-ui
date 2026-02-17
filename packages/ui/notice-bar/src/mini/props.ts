import type {
  NoticeBarMiniClassNames,
  NoticeBarVariants,
} from '../style';

export type NoticeBarMiniProps = NoticeBarVariants & {
  text?: string;
  icon?: string;
  actionText?: string;
  isClosable?: boolean;
  isVisible?: boolean;
  defaultVisible?: boolean;
  className?: string;
  classNames?: Partial<NoticeBarMiniClassNames>;
  style?: string;
};

export const noticeBarMiniProps = {
  text: { type: String, value: '' },
  icon: { type: String, value: '' },
  actionText: { type: String, value: '' },
  isClosable: { type: Boolean, value: false },
  isVisible: { type: Boolean, value: true },
  defaultVisible: { type: Boolean, value: true },
  color: { type: null, value: 'default' },
  size: { type: null, value: 'md' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
