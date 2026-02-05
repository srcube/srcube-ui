import type * as React from 'react';
import type { ComponentClasses, ComponentVariants } from '../style';

// TODO: rename Component* to the real component name.
type ComponentNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | keyof ComponentVariants
>;

export type ComponentReactProps = ComponentVariants &
  ComponentNativeProps & {
    className?: string;
    classNames?: ComponentClasses;
    style?: React.CSSProperties | string;

    // NOTE: For RAC components, use react-aria-components props and
    // allow function className via composeTwRenderProps.
    // TODO: add React-specific props here.
  };
