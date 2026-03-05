import type * as React from 'react';
import type { AvatarFallbackStyle, AvatarFallbackTheme } from './fallback';
import type { AvatarClassNames, AvatarVariants } from '@srcube-ui/styles/components/avatar';

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
    fallbackStyle?: AvatarFallbackStyle;
    fallbackTheme?: AvatarFallbackTheme;
    fallbackSeed?: string | number;
    className?: string;
    classNames?: Partial<AvatarClassNames>;
    style?: React.CSSProperties;
  };
