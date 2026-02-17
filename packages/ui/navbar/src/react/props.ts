import type * as React from 'react';
import type { NavbarClassNames, NavbarVariants } from '../style';

type NavbarNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof NavbarVariants
>;

export type NavbarReactProps = NavbarVariants &
  NavbarNativeProps & {
    title?: React.ReactNode;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    className?: string;
    classNames?: Partial<NavbarClassNames>;
    style?: React.CSSProperties;
  };
