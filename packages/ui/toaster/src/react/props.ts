import type * as React from 'react';
import type {
  ToasterClassNames,
  ToasterVariants,
} from '../style';

type ToasterNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | keyof ToasterVariants
>;

export type ToasterReactProps = ToasterVariants &
  ToasterNativeProps & {
    max?: number;
    className?: string;
    classNames?: Partial<ToasterClassNames>;
    style?: React.CSSProperties;
  };
