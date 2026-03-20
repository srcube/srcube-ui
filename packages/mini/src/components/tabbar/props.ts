import type { TabbarMiniClassNames, TabbarVariants } from '@srcube-ui/styles/components/tabbar/style';

export type TabbarMiniValue = string | number;

export type TabbarMiniItem = {
  value: TabbarMiniValue;
  label: string;
  icon?: string;
  badge?: boolean | number | string;
  isDisabled?: boolean;
};

export type TabbarMiniProps = TabbarVariants & {
  items?: TabbarMiniItem[];
  value?: TabbarMiniValue | null;
  defaultValue?: TabbarMiniValue | null;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  tone?: 'default' | 'dark';
  className?: string;
  classNames?: Partial<TabbarMiniClassNames>;
  style?: string;
};

export const tabbarMiniProps = {
  tone: { type: null, value: 'default' },
  size: { type: null, value: 'md' },
  isBordered: { type: Boolean, value: true },
  items: { type: Array, value: [] },
  value: { type: null, value: null },
  defaultValue: { type: null, value: null },
  color: { type: null, value: 'default' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
