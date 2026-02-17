import type * as React from 'react';
import type { PopoverClassNames, PopoverVariants } from '../style';

type PopoverNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof PopoverVariants
>;

export type PopoverReactProps = PopoverVariants &
  PopoverNativeProps & {
    trigger: React.ReactNode;
    title?: React.ReactNode;
    content?: React.ReactNode;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    shouldCloseOnOutsidePress?: boolean;
    className?: string;
    classNames?: Partial<PopoverClassNames>;
    style?: React.CSSProperties;
    onOpenChange?: (isOpen: boolean) => void;
  };
