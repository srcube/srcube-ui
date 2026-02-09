import type { CheckboxClasses, CheckboxVariants } from '../style';

export type CheckboxMiniProps = CheckboxVariants & {
  value?: string;
  defaultSelected?: boolean;
  isSelected?: boolean;
  isIndeterminate?: boolean;
  isLoading?: boolean | 'auto';
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isLineThrough?: boolean;
  className?: string;
  classNames?: CheckboxClasses;
  style?: string;
};

export const checkboxMiniProps = {
  value: { type: String, value: '' },
  color: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  isSelected: { type: null, value: null },
  defaultSelected: { type: Boolean, value: false },
  isIndeterminate: { type: Boolean, value: false },
  isLoading: { type: null, value: false },
  isDisabled: { type: null, value: null },
  isReadOnly: { type: null, value: null },
  isLineThrough: { type: null, value: null },
  className: { type: String, value: '' },
  classNames: Object,
  style: { type: String, value: '' },
} as const;
