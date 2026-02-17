import type * as React from 'react';
import type { CollapseClassNames, CollapseVariants } from '../style';

type CollapseNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof CollapseVariants
>;

export type CollapseReactProps = CollapseVariants &
  CollapseNativeProps & {
    title: React.ReactNode;
    content?: React.ReactNode;
    value?: boolean;
    defaultValue?: boolean;
    isDisabled?: boolean;
    hasIndicator?: boolean;
    indicator?: React.ReactNode;
    className?: string;
    classNames?: Partial<CollapseClassNames>;
    style?: React.CSSProperties;
    onValueChange?: (value: boolean) => void;
  };
