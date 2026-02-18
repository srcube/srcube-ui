import type * as React from 'react';
import type { CardClassNames, CardVariants } from '../style';

type CardNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | keyof CardVariants
>;

export type CardReactProps = CardVariants &
  CardNativeProps & {
    title?: React.ReactNode;
    description?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    isHeaderDivider?: boolean;
    isFooterDivider?: boolean;
    className?: string;
    classNames?: Partial<CardClassNames>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };
