import type { FieldVariants } from '@srcube-ui/field/style';
import type { PickerMiniClassNames, PickerVariants } from '../style';

export type PickerMiniType = NonNullable<PickerVariants['type']>;
export type PickerMiniMode = 'single' | 'multiple';
export type PickerMiniItemId = string | number;

export type PickerMiniItem = {
  id: PickerMiniItemId;
  label: string;
  isDisabled?: boolean;
};

export type PickerMiniColumn = {
  id?: string | number;
  items: PickerMiniItem[];
};

export type PickerMiniSingleValue = PickerMiniItemId | null;
export type PickerMiniMultiValue = Array<PickerMiniItemId | null>;
export type PickerMiniValue = PickerMiniSingleValue | PickerMiniMultiValue;

export type PickerMiniProps = FieldVariants &
  PickerVariants & {
    id?: string;
    label?: string;
    labelPlacement?: 'outside' | 'outside-left' | 'inside';
    value?: PickerMiniValue | null;
    defaultValue?: PickerMiniValue;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isLoading?: boolean;
    mode?: PickerMiniMode;
    items?: PickerMiniItem[];
    columns?: PickerMiniColumn[];
    isOpen?: boolean | null;
    defaultOpen?: boolean;
    separator?: string;
    confirmText?: string;
    drawerTitle?: string;
    isDismissable?: boolean;
    hasBackdrop?: boolean;
    backdrop?: 'transparent' | 'opaque' | 'blur';
    estimateSize?: number;
    overscan?: number;
    indicatorHeight?: number;
    scrollEndDelay?: number;
    className?: string;
    classNames?: Partial<PickerMiniClassNames>;
    style?: string;
  };

export const pickerMiniProps = {
  id: { type: String, value: '' },
  color: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  type: { type: null, value: 'default' },
  mode: { type: null, value: 'single' },
  label: { type: String, value: '' },
  labelPlacement: { type: String, value: 'outside' },
  value: { type: null, value: null },
  defaultValue: { type: null, value: null },
  placeholder: { type: String, value: '请选择' },
  description: { type: String, value: '' },
  errorMessage: { type: String, value: '' },
  isDisabled: { type: Boolean, value: false },
  isReadOnly: { type: Boolean, value: false },
  isInvalid: { type: Boolean, value: false },
  isRequired: { type: Boolean, value: false },
  isLoading: { type: Boolean, value: false },
  items: { type: Array, value: [] },
  columns: { type: Array, value: [] },
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  separator: { type: String, value: ' / ' },
  confirmText: { type: String, value: '确认' },
  drawerTitle: { type: String, value: '' },
  isDismissable: { type: Boolean, value: true },
  hasBackdrop: { type: Boolean, value: true },
  backdrop: { type: null, value: 'opaque' },
  estimateSize: { type: null, value: null },
  overscan: { type: Number, value: 5 },
  indicatorHeight: { type: null, value: null },
  scrollEndDelay: { type: Number, value: 180 },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
