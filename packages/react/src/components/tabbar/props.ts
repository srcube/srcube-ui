import type * as React from 'react';
import type { TabbarClassNames, TabbarVariants } from '@srcube-ui/styles/components/tabbar';

export type TabbarValue = string | number;

export type TabbarItem = {
  value: TabbarValue;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: boolean | number | string;
  isDisabled?: boolean;
};

type TabbarNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof TabbarVariants
>;

export type TabbarReactProps = TabbarVariants &
  TabbarNativeProps & {
    items: TabbarItem[];
    value?: TabbarValue | null;
    defaultValue?: TabbarValue | null;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    tone?: 'default' | 'dark';
    className?: string;
    classNames?: Partial<TabbarClassNames>;
    style?: React.CSSProperties;
    onValueChange?: (value: TabbarValue) => void;
  };
