import type * as React from 'react';
import type { MenuClassNames, MenuVariants } from '@srcube-ui/styles/components/menu';

export type MenuValue = string | number;

export type MenuItem = {
  value: MenuValue;
  label: React.ReactNode;
  isDisabled?: boolean;
};

export type MenuValueChangeDetail = {
  item: MenuItem;
  index: number;
};

type MenuNativeProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'onChange' | keyof MenuVariants
>;

export type MenuReactProps = MenuVariants &
  MenuNativeProps & {
    trigger: React.ReactNode;
    items?: MenuItem[];
    value?: MenuValue | null;
    defaultValue?: MenuValue | null;
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDisabled?: boolean;
    shouldCloseOnOutsidePress?: boolean;
    shouldCloseOnSelect?: boolean;
    className?: string;
    classNames?: Partial<MenuClassNames>;
    style?: React.CSSProperties;
    onOpenChange?: (isOpen: boolean) => void;
    onValueChange?: (value: MenuValue, detail: MenuValueChangeDetail) => void;
  };
