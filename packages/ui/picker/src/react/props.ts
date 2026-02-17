import type * as React from 'react';
import type { FieldLabelPlacement } from '@srcube-ui/field/react';
import type { FieldVariants } from '@srcube-ui/field/style';
import type { PickerReactClassNames, PickerVariants } from '../style';

export type PickerType = NonNullable<PickerVariants['type']>;
export type PickerItemId = string | number;

export type PickerItem = {
  id: PickerItemId;
  label: string;
  isDisabled?: boolean;
};

export type PickerColumn = {
  id?: string | number;
  items: PickerItem[];
};

export type PickerSingleValue = PickerItemId | null;
export type PickerMultiValue = Array<PickerItemId | null>;
export type PickerValue = PickerMultiValue;

export type PickerDraftDetail = {
  values: PickerMultiValue;
  columnIndex?: number;
  itemId?: PickerItemId;
};

type PickerNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | 'onChange' | keyof FieldVariants
>;

export type PickerReactProps = FieldVariants &
  PickerNativeProps & {
    id?: string;
    label?: React.ReactNode;
    labelPlacement?: FieldLabelPlacement;
    placeholder?: React.ReactNode;
    description?: React.ReactNode;
    errorMessage?: React.ReactNode;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isInvalid?: boolean;
    isRequired?: boolean;
    isLoading?: boolean;
    type?: PickerType;
    items?: PickerItem[];
    columns?: PickerColumn[];
    value?: PickerMultiValue;
    defaultValue?: PickerMultiValue;
    isOpen?: boolean;
    defaultOpen?: boolean;
    separator?: string;
    confirmText?: React.ReactNode;
    drawerTitle?: React.ReactNode;
    isDismissable?: boolean;
    hasBackdrop?: boolean;
    backdrop?: 'transparent' | 'opaque' | 'blur';
    estimateSize?: number;
    overscan?: number;
    indicatorHeight?: number;
    scrollEndDelay?: number;
    className?: string;
    classNames?: Partial<PickerReactClassNames>;
    style?: React.CSSProperties | string;
    onTap?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onCancel?: () => void;
    onOpenChange?: (isOpen: boolean) => void;
    onValueChange?: (value: PickerMultiValue) => void;
    onDraftValueChange?: (
      value: PickerMultiValue,
      detail: PickerDraftDetail,
    ) => void;
  };

export type DatePickerValue = string | null;

export type DatePickerValueDetail = {
  year: number;
  month: number;
  day: number;
};

type DatePickerBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
>;

export type DatePickerReactProps = DatePickerBaseProps & {
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  minYear?: number;
  maxYear?: number;
  onValueChange?: (
    value: DatePickerValue,
    detail: DatePickerValueDetail,
  ) => void;
  onDraftValueChange?: (
    value: DatePickerValue,
    detail: DatePickerValueDetail,
  ) => void;
};

export type TimePickerValue = string | null;

export type TimePickerValueDetail = {
  hour: number;
  minute: number;
  second: number;
};

type TimePickerBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
>;

export type TimePickerReactProps = TimePickerBaseProps & {
  value?: TimePickerValue;
  defaultValue?: TimePickerValue;
  onValueChange?: (
    value: TimePickerValue,
    detail: TimePickerValueDetail,
  ) => void;
  onDraftValueChange?: (
    value: TimePickerValue,
    detail: TimePickerValueDetail,
  ) => void;
};

export type DateRangePickerRange = 'start' | 'end';

export type DateRangePickerValue = {
  start: DatePickerValue;
  end: DatePickerValue;
};

export type DateRangePickerValueDetail = {
  activeRange: DateRangePickerRange;
  start: DatePickerValueDetail;
  end: DatePickerValueDetail;
};

type DateRangePickerBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
>;

export type DateRangePickerReactProps = DateRangePickerBaseProps & {
  value?: DateRangePickerValue;
  defaultValue?: DateRangePickerValue;
  minYear?: number;
  maxYear?: number;
  startTabText?: React.ReactNode;
  endTabText?: React.ReactNode;
  valueSeparator?: string;
  onValueChange?: (
    value: DateRangePickerValue,
    detail: DateRangePickerValueDetail,
  ) => void;
  onDraftValueChange?: (
    value: DateRangePickerValue,
    detail: DateRangePickerValueDetail,
  ) => void;
};

export type PickerDatetimeMode = 'datetime' | 'date' | 'time';
export type PickerDatetimePanel = 'date' | 'time';
export type PickerDatetimeValue = string | null;

export type PickerDatetimeValueDetail = {
  mode: PickerDatetimeMode;
  panel: PickerDatetimePanel;
  format: string;
  date: DatePickerValueDetail;
  time: TimePickerValueDetail;
};

type PickerDatetimeBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
>;

export type PickerDatetimeReactProps = PickerDatetimeBaseProps & {
  mode?: PickerDatetimeMode;
  value?: PickerDatetimeValue;
  defaultValue?: PickerDatetimeValue;
  format?: string;
  minYear?: number;
  maxYear?: number;
  dateTabText?: React.ReactNode;
  timeTabText?: React.ReactNode;
  onValueChange?: (
    value: PickerDatetimeValue,
    detail: PickerDatetimeValueDetail,
  ) => void;
  onDraftValueChange?: (
    value: PickerDatetimeValue,
    detail: PickerDatetimeValueDetail,
  ) => void;
};

export type PickerDatetimeRange = 'start' | 'end';

export type PickerDatetimeRangeValue = {
  start: PickerDatetimeValue;
  end: PickerDatetimeValue;
};

export type PickerDatetimeRangeValueDetail = {
  mode: PickerDatetimeMode;
  activeRange: PickerDatetimeRange;
  panel: PickerDatetimePanel;
  format: string;
  start: {
    date: DatePickerValueDetail;
    time: TimePickerValueDetail;
  };
  end: {
    date: DatePickerValueDetail;
    time: TimePickerValueDetail;
  };
};

type PickerDatetimeRangeBaseProps = Omit<
  PickerReactProps,
  | 'items'
  | 'columns'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'onDraftValueChange'
>;

export type PickerDatetimeRangeReactProps = PickerDatetimeRangeBaseProps & {
  mode?: PickerDatetimeMode;
  value?: PickerDatetimeRangeValue;
  defaultValue?: PickerDatetimeRangeValue;
  format?: string;
  minYear?: number;
  maxYear?: number;
  startTabText?: React.ReactNode;
  endTabText?: React.ReactNode;
  dateTabText?: React.ReactNode;
  timeTabText?: React.ReactNode;
  valueSeparator?: string;
  onValueChange?: (
    value: PickerDatetimeRangeValue,
    detail: PickerDatetimeRangeValueDetail,
  ) => void;
  onDraftValueChange?: (
    value: PickerDatetimeRangeValue,
    detail: PickerDatetimeRangeValueDetail,
  ) => void;
};
