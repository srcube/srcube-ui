import type * as React from 'react';
import type { InputOtpClassNames, InputOtpVariants } from '@srcube-ui/styles/components/input-otp';

type InputOtpNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange'
>;

export type InputOtpKeyboardType =
  | 'text'
  | 'number'
  | 'digit'
  | 'tel'
  | 'password';

export type InputOtpReactProps = InputOtpVariants &
  InputOtpNativeProps & {
    length?: number;
    value?: string;
    defaultValue?: string;
    keyboardType?: InputOtpKeyboardType;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isPassword?: boolean;
    className?: string;
    classNames?: Partial<InputOtpClassNames>;
    style?: React.CSSProperties;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onValueChange?: (value: string) => void;
    onComplete?: (value: string) => void;
  };
