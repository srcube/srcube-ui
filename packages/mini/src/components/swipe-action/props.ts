import type {
  SwipeActionActionToneColors,
  SwipeActionMiniClassNames,
  SwipeActionVariants,
} from '@srcube-ui/styles/components/swipe-action/style';

export type SwipeActionMiniDirection = 'none' | 'left' | 'right';

export type SwipeActionMiniItem = {
  key: string | number;
  label: string;
  color?: SwipeActionActionToneColors;
  iconClassName?: string;
  isDisabled?: boolean;
  className?: string;
};

export type SwipeActionMiniProps = SwipeActionVariants & {
  leftActions?: SwipeActionMiniItem[];
  rightActions?: SwipeActionMiniItem[];
  actionWidth?: number;
  threshold?: number;
  openDirection?: SwipeActionMiniDirection | null;
  defaultOpenDirection?: SwipeActionMiniDirection;
  isDisabled?: boolean;
  className?: string;
  classNames?: Partial<SwipeActionMiniClassNames>;
  style?: string;
};

export const swipeActionMiniProps = {
  color: { type: null, value: null },
  tone: { type: null, value: 'default' },
  size: { type: null, value: null },
  leftActions: { type: Array, value: [] },
  rightActions: { type: Array, value: [] },
  actionWidth: { type: null, value: null },
  threshold: { type: Number, value: -1 },
  openDirection: { type: null, value: null },
  defaultOpenDirection: { type: String, value: 'none' },
  isDisabled: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
