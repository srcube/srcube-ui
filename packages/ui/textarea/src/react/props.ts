import type { FieldLabelPlacement } from '@srcube-ui/field/react';
import type { FieldClassNames, FieldVariants } from '@srcube-ui/field/style';
import type * as React from 'react';

type TextareaNativeProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'value'
  | 'defaultValue'
  | 'children'
  | 'className'
  | 'style'
  | 'placeholder'
  | 'color'
>;

type TextareaFieldProps = FieldVariants & {
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

export type TextareaReactProps = TextareaFieldProps &
  TextareaNativeProps & {
    value?: string | number;
    defaultValue?: string | number;
    placeholder?: string;
    textareaClassName?: string;
    showCount?: boolean;
    isAutoHeight?: boolean;
    onValueChange?: (value: string) => void;
  };
