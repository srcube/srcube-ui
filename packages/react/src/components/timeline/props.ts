import type * as React from 'react';
import type {
  TimelineClassNames,
  TimelineColor,
  TimelineVariants,
} from '@srcube-ui/styles/components/timeline';

export type TimelineItem = {
  key?: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  time?: React.ReactNode;
  icon?: React.ReactNode;
  color?: TimelineColor;
  isPending?: boolean;
};

type TimelineNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof TimelineVariants
>;

export type TimelineReactProps = Omit<
  TimelineVariants,
  'isPending' | 'isLast' | 'isFirst'
> &
  TimelineNativeProps & {
    items?: TimelineItem[];
    className?: string;
    classNames?: Partial<TimelineClassNames>;
    style?: React.CSSProperties;
  };
