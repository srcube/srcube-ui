import type { TabsClassNames, TabsVariants } from '@srcube-ui/styles/components/tabs/style';

export type TabsMiniValue = string | number;

export type TabsMiniItem = {
  value: TabsMiniValue;
  label: string;
  isDisabled?: boolean;
};

export type TabsMiniProps = TabsVariants & {
  items?: TabsMiniItem[];
  value?: TabsMiniValue | null;
  defaultValue?: TabsMiniValue | null;
  isDisabled?: boolean;
  estimateSize?: number;
  overscan?: number;
  hideMasks?: boolean;
  className?: string;
  classNames?: TabsClassNames;
  style?: string;
};

export const tabsMiniProps = {
  orientation: {
    type: null,
    value: 'x',
  },
  color: {
    type: null,
    value: 'default',
  },
  variant: {
    type: null,
    value: 'default',
  },
  placement: {
    type: null,
    value: null,
  },
  size: {
    type: null,
    value: 'md',
  },
  radius: {
    type: null,
    value: 'md',
  },
  items: {
    type: Array,
    value: [],
  },
  value: {
    type: null,
    value: null,
  },
  defaultValue: {
    type: null,
    value: null,
  },
  isDisabled: {
    type: Boolean,
    value: false,
  },
  estimateSize: {
    type: Number,
    value: 0,
  },
  overscan: {
    type: Number,
    value: 5,
  },
  hideMasks: {
    type: Boolean,
    value: false,
  },
  className: {
    type: String,
    value: '',
  },
  classNames: { type: Object, value: {} },
  style: {
    type: String,
    value: '',
  },
} as const;
