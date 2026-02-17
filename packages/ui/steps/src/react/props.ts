import type * as React from 'react';
import type { StepStatus, StepsClassNames, StepsVariants } from '../style';

export type StepsItem = {
  key?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: StepStatus;
};

type StepsNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof StepsVariants
>;

export type StepsReactProps = Omit<StepsVariants, 'status' | 'isLast'> &
  StepsNativeProps & {
    items?: StepsItem[];
    current?: number;
    className?: string;
    classNames?: Partial<StepsClassNames>;
    style?: React.CSSProperties;
  };
