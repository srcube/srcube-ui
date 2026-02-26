import type * as React from 'react';
import type { StepStatus, StepsClassNames, StepsVariants } from '../style';

export type StepsItem = {
  key?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: StepStatus;
};

export type StepsOrientation = 'x' | 'y';

type StepsNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof StepsVariants | 'orientation'
>;

export type StepsReactProps = Omit<
  StepsVariants,
  'status' | 'isLast' | 'isFirst' | 'orientation'
> &
  StepsNativeProps & {
    items?: StepsItem[];
    current?: number;
    orientation?: StepsOrientation;
    className?: string;
    classNames?: Partial<StepsClassNames>;
    style?: React.CSSProperties;
  };
