import type * as React from 'react';
import type { SkeletonClassNames, SkeletonVariants } from '../style';

type SkeletonNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof SkeletonVariants
>;

export type SkeletonReactProps = SkeletonVariants &
  SkeletonNativeProps & {
    className?: string;
    classNames?: Partial<SkeletonClassNames>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  };
