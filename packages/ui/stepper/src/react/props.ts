import type { FieldLabelPlacement } from '@srcube-ui/field/react';
import type * as React from 'react';
import type { StepperClassNames, StepperVariants } from '../style';

type StepperInputNativeProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | 'style'
  | 'value'
  | 'defaultValue'
  | 'size'
  | 'type'
  | 'disabled'
  | 'readOnly'
>;

type StepperFieldProps = {
  id?: string;
  label?: React.ReactNode;
  labelPlacement?: FieldLabelPlacement;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  isLoading?: boolean;
  className?: string;
  classNames?: Partial<StepperClassNames>;
  controlProps?: React.HTMLAttributes<HTMLDivElement>;
  style?: React.CSSProperties;
  onTap?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

type StepperRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'color'
>;

export type StepperReactProps = StepperVariants &
  StepperFieldProps &
  StepperRootProps & {
    value?: number | null;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    decrementLabel?: string;
    incrementLabel?: string;
    inputProps?: StepperInputNativeProps;
    onValueChange?: (value: number) => void;
  };
