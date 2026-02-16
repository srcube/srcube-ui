import type * as React from 'react';
import type { FieldLabelPlacement } from '@srcube-ui/field/react';
import type { FieldVariants } from '@srcube-ui/field/style';
import type { PickerReactClassNames, PickerVariants } from '../style';

export type PickerType = NonNullable<PickerVariants['type']>;
export type PickerMode = 'single' | 'multiple';
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
export type PickerValue = PickerSingleValue | PickerMultiValue;

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
    mode?: PickerMode;
    items?: PickerItem[];
    columns?: PickerColumn[];
    value?: PickerValue;
    defaultValue?: PickerValue;
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
    onValueChange?: (value: PickerSingleValue | PickerMultiValue) => void;
    onDraftValueChange?: (
      value: PickerSingleValue | PickerMultiValue,
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
  | 'mode'
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
