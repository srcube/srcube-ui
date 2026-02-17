import type { PopoverMiniClassNames, PopoverVariants } from '../style';

export type PopoverMiniProps = PopoverVariants & {
  title?: string;
  content?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  isDisabled?: boolean;
  shouldCloseOnOutsidePress?: boolean;
  className?: string;
  classNames?: Partial<PopoverMiniClassNames>;
  style?: string;
};

export const popoverMiniProps = {
  title: { type: String, value: '' },
  content: { type: String, value: '' },
  isOpen: { type: Boolean, value: false },
  defaultOpen: { type: Boolean, value: false },
  isDisabled: { type: Boolean, value: false },
  shouldCloseOnOutsidePress: { type: Boolean, value: true },
  placement: { type: null, value: 'bottom' },
  size: { type: null, value: 'md' },
  hasArrow: { type: Boolean, value: true },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
