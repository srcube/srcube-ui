import type * as React from 'react';
import type {
  ToasterClassNames,
  ToasterVariants,
} from '@srcube-ui/styles/components/toaster';

type ToasterNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'style' | keyof ToasterVariants
>;

export type ToasterReactProps = ToasterVariants &
  ToasterNativeProps & {
    className?: string;
    classNames?: Partial<ToasterClassNames>;
    style?: React.CSSProperties;
  };
