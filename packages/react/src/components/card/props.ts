import type * as React from 'react';
import type { CardClassNames, CardVariants } from '@srcube-ui/styles/components/card';

type CardNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | keyof CardVariants
>;

export type CardReactProps = CardVariants &
  CardNativeProps & {
    header?: React.ReactNode;
    body?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    classNames?: Partial<CardClassNames>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };
