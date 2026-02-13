import type * as React from 'react';
import type { FieldClassNames, FieldVariants } from '../style';

export type FieldLabelPlacement = 'outside' | 'outside-left' | 'inside';

export type FieldControlRenderProps = {
  id: string;
  className: string;
  value: string;
  onValueChange: (value: string) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  isInvalid: boolean;
};

type FieldNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style'
>;

export type FieldReactProps = FieldVariants &
  FieldNativeProps & {
    id?: string;
    label?: React.ReactNode;
    labelPlacement?: FieldLabelPlacement;
    value?: string | number;
    defaultValue?: string | number;
    placeholder?: React.ReactNode;
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
    children?:
      | React.ReactNode
      | ((props: FieldControlRenderProps) => React.ReactNode);
    onValueChange?: (value: string) => void;
    onClear?: () => void;
    onTap?: (event: React.MouseEvent<HTMLDivElement>) => void;
  };
