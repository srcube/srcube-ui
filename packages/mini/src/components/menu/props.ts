import type { MenuMiniClassNames, MenuVariants } from '@srcube-ui/styles/components/menu/style';

export type MenuMiniValue = string | number;

export type MenuMiniItem = {
  value: MenuMiniValue;
  label: string;
  isDisabled?: boolean;
};

export type MenuMiniProps = MenuVariants & {
  items?: MenuMiniItem[];
  value?: MenuMiniValue | null;
  defaultValue?: MenuMiniValue | null;
  isOpen?: boolean;
  defaultOpen?: boolean;
  isDisabled?: boolean;
  shouldCloseOnOutsidePress?: boolean;
  shouldCloseOnSelect?: boolean;
  className?: string;
  classNames?: Partial<MenuMiniClassNames>;
  style?: string;
};

export const menuMiniProps = {
  items: { type: Array, value: [] },
  value: { type: null, value: null },
  defaultValue: { type: null, value: null },
  isOpen: { type: Boolean, value: false },
  defaultOpen: { type: Boolean, value: false },
  isDisabled: { type: Boolean, value: false },
  shouldCloseOnOutsidePress: { type: Boolean, value: true },
  shouldCloseOnSelect: { type: Boolean, value: true },
  placement: { type: null, value: 'bottom' },
  orientation: { type: null, value: 'y' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'md' },
  variant: { type: null, value: 'solid' },
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  hasArrow: { type: Boolean, value: true },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
