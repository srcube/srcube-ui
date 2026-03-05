import type { FieldVariants } from '@srcube-ui/styles/components/field/style';
import type { PickerMiniClassNames, PickerVariants } from '@srcube-ui/styles/components/picker/style';

export type PickerSelectMiniItemId = string | number;

export type PickerSelectMiniItem = {
  id: PickerSelectMiniItemId;
  label: string;
  isDisabled?: boolean;
  isSticky?: boolean;
};

export type PickerSelectMiniValue = Array<PickerSelectMiniItemId>;

export type PickerSelectMiniProps = FieldVariants &
  PickerVariants & {
    id?: string;
    label?: string;
    labelPlacement?: 'outside' | 'outside-left' | 'inside';
    value?: PickerSelectMiniValue | null;
    defaultValue?: PickerSelectMiniValue;
    selectionMode?: 'single' | 'multiple';
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isLoading?: boolean;
    items?: PickerSelectMiniItem[];
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
    className?: string;
    classNames?: Partial<PickerMiniClassNames>;
    style?: string;
  };

export const pickerSelectMiniProps = {
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
  selectionMode: { type: String, value: 'multiple' },
  placeholder: { type: String, value: '请选择' },
  description: { type: String, value: '' },
  errorMessage: { type: String, value: '' },
  isDisabled: { type: Boolean, value: false },
  isReadOnly: { type: Boolean, value: false },
  isInvalid: { type: Boolean, value: false },
  isRequired: { type: Boolean, value: false },
  isLoading: { type: Boolean, value: false },
  items: { type: Array, value: [] },
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
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
