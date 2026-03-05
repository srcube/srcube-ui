import type * as React from 'react';
import type { NavbarClassNames, NavbarVariants } from '@srcube-ui/styles/components/navbar';

type NavbarNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof NavbarVariants
>;

export type NavbarReactProps = NavbarVariants &
  NavbarNativeProps & {
    title?: React.ReactNode;
    withBack?: boolean;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    onBack?: (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => void;
    className?: string;
    classNames?: Partial<NavbarClassNames>;
    style?: React.CSSProperties;
  };
