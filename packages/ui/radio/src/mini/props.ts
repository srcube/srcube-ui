import type { RadioClasses, RadioVariants } from '../style';

export type RadioMiniProps = RadioVariants & {
  value?: string;
  defaultSelected?: boolean;
  isSelected?: boolean;
  isLoading?: boolean | 'auto';
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasIcon?: boolean;
  className?: string;
  classNames?: RadioClasses;
  style?: string;
};

export const radioMiniProps = {
  value: { type: String, value: '' },
  color: { type: null, value: null },
  size: { type: null, value: null },
  isSelected: { type: null, value: null },
  defaultSelected: { type: Boolean, value: false },
  isLoading: { type: null, value: false },
  isDisabled: { type: null, value: null },
  isReadOnly: { type: null, value: null },
  hasIcon: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: Object,
  style: { type: String, value: '' },
} as const;
