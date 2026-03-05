import type { FieldVariants } from '@srcube-ui/styles/components/field/style';
import type { PickerMiniClassNames, PickerVariants } from '@srcube-ui/styles/components/picker/style';
import type { PickerDatetimeMiniMode } from '../picker-datetime/props';

export type PickerDatetimeRangeMiniRange = 'start' | 'end';

export type PickerDatetimeRangeMiniValue = {
  start: string | null;
  end: string | null;
};

export type PickerDatetimeRangeMiniProps = FieldVariants &
  PickerVariants & {
    id?: string;
    label?: string;
    labelPlacement?: 'outside' | 'outside-left' | 'inside';
    value?: PickerDatetimeRangeMiniValue | null;
    defaultValue?: PickerDatetimeRangeMiniValue | null;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isLoading?: boolean;
    mode?: PickerDatetimeMiniMode;
    format?: string;
    minYear?: number;
    maxYear?: number;
    isOpen?: boolean | null;
    defaultOpen?: boolean;
    confirmText?: string;
    drawerTitle?: string;
    isDismissable?: boolean;
    hasBackdrop?: boolean;
    backdrop?: 'transparent' | 'opaque' | 'blur';
    estimateSize?: number;
    overscan?: number;
    indicatorHeight?: number;
    scrollEndDelay?: number;
    startTabText?: string;
    endTabText?: string;
    dateTabText?: string;
    timeTabText?: string;
    valueSeparator?: string;
    className?: string;
    classNames?: Partial<PickerMiniClassNames>;
    style?: string;
  };

export const pickerDatetimeRangeMiniProps = {
  id: { type: String, value: '' },
  color: { type: null, value: null },
  variant: { type: null, value: null },
  size: { type: null, value: null },
  radius: { type: null, value: null },
  type: { type: null, value: 'default' },
  mode: { type: null, value: 'datetime' },
  format: { type: String, value: '' },
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
  minYear: { type: Number, value: 1900 },
  maxYear: { type: Number, value: 2099 },
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  confirmText: { type: String, value: '确认' },
  drawerTitle: { type: String, value: '' },
  isDismissable: { type: Boolean, value: true },
  hasBackdrop: { type: Boolean, value: true },
  backdrop: { type: null, value: 'opaque' },
  estimateSize: { type: null, value: null },
  overscan: { type: Number, value: 5 },
  indicatorHeight: { type: null, value: null },
  scrollEndDelay: { type: Number, value: 120 },
  startTabText: { type: String, value: '开始' },
  endTabText: { type: String, value: '结束' },
  dateTabText: { type: String, value: '日期' },
  timeTabText: { type: String, value: '时间' },
  valueSeparator: { type: String, value: ' ~ ' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
