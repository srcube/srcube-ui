import type { FieldVariants } from '@srcube-ui/field/style';
import type { PickerVariants } from '@srcube-ui/picker/style';
import type { CascaderMiniClassNames } from '../style';

export type CascaderMiniOptionId = string | number;

export type CascaderMiniOption = {
  id: CascaderMiniOptionId;
  label: string;
  isDisabled?: boolean;
  children?: CascaderMiniOption[];
};

export type CascaderMiniValue = Array<CascaderMiniOptionId | null>;

export type CascaderMiniProps = FieldVariants &
  PickerVariants & {
    id?: string;
    label?: string;
    labelPlacement?: 'outside' | 'outside-left' | 'inside';
    value?: CascaderMiniValue | null;
    defaultValue?: CascaderMiniValue;
    options?: CascaderMiniOption[];
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isLoading?: boolean;
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
    classNames?: Partial<CascaderMiniClassNames>;
    pickerClassNames?: Record<string, string>;
    style?: string;
  };

export const cascaderMiniProps = {
  id: { type: String, value: '' },
  color: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  type: { type: null, value: 'default' },
  label: { type: String, value: '' },
  labelPlacement: { type: String, value: 'outside' },
  value: { type: null, value: null },
  defaultValue: { type: Array, value: [] },
  options: { type: Array, value: [] },
  placeholder: { type: String, value: '请选择' },
  description: { type: String, value: '' },
  errorMessage: { type: String, value: '' },
  isDisabled: { type: Boolean, value: false },
  isReadOnly: { type: Boolean, value: false },
  isInvalid: { type: Boolean, value: false },
  isRequired: { type: Boolean, value: false },
  isLoading: { type: Boolean, value: false },
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
  pickerClassNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
