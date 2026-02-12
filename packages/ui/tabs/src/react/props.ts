import type * as React from 'react';
import type {
  TabPanelClassNames,
  TabPanelVariants,
  TabsClassNames,
  TabsVariants,
} from '../style';

type TabsNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'className' | 'onChange' | 'style' | keyof TabsVariants
>;

type TabPanelNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style'
>;

export type TabsValue = string | number;

export type TabsItem = {
  value: TabsValue;
  label: React.ReactNode;
  isDisabled?: boolean;
};

export type TabsReactProps = TabsVariants &
  TabsNativeProps & {
    items: TabsItem[];
    value?: TabsValue | null;
    defaultValue?: TabsValue | null;
    onValueChange?: (value: TabsValue) => void;
    className?: string;
    classNames?: TabsClassNames;
    style?: React.CSSProperties | string;
    children?: React.ReactNode;
  };

export type TabPanelReactProps = Omit<TabPanelVariants, 'isActive'> &
  TabPanelNativeProps & {
    value: TabsValue;
    activeValue?: TabsValue | null;
    isActive?: boolean;
    keepMounted?: boolean;
    className?: string;
    classNames?: TabPanelClassNames;
    style?: React.CSSProperties | string;
    children?: React.ReactNode;
  };
