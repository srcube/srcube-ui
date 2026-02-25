import type * as React from 'react';
import type { AvatarClassNames, AvatarVariants } from '../style';

type AvatarNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof AvatarVariants
>;

export type AvatarReactProps = AvatarVariants &
  AvatarNativeProps & {
    src?: string;
    alt?: string;
    name?: string;
    icon?: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
    classNames?: Partial<AvatarClassNames>;
    style?: React.CSSProperties;
  };
