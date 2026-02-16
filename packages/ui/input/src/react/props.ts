import type { FieldLabelPlacement } from '@srcube-ui/field/react';
import type { FieldClassNames, FieldVariants } from '@srcube-ui/field/style';
import type * as React from 'react';

type InputNativeProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'value'
  | 'defaultValue'
  | 'children'
  | 'className'
  | 'style'
  | 'placeholder'
  | 'size'
  | 'color'
>;

type InputFieldProps = FieldVariants & {
  id?: string;
  label?: React.ReactNode;
  labelPlacement?: FieldLabelPlacement;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  clearButton?: React.ReactNode;
  isClearable?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  className?: string;
  classNames?: Partial<FieldClassNames>;
  controlProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
  onClear?: () => void;
  onTap?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export type InputReactProps = InputFieldProps &
  InputNativeProps & {
    value?: string | number;
    defaultValue?: string | number;
    placeholder?: string;
    inputClassName?: string;
    onValueChange?: (value: string) => void;
  };
