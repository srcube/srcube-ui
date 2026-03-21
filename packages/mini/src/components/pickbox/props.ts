import type {
  PickboxMiniClassNames,
  PickboxVariants,
} from '@srcube-ui/styles/components/pickbox/style';

export type PickboxMiniItemId = string | number;

export type PickboxMiniItem = {
  id: PickboxMiniItemId;
  label: string;
  isDisabled?: boolean;
};

export type PickboxMiniColumn = {
  id?: string | number;
  items: PickboxMiniItem[];
};

export type PickboxMiniValue = Array<PickboxMiniItemId | null>;

export type PickboxMiniProps = PickboxVariants & {
  className?: string;
  classNames?: PickboxMiniClassNames;
  style?: string;
  columns?: PickboxMiniColumn[];
  value?: PickboxMiniValue | null;
  defaultValue?: PickboxMiniValue;
  estimateSize?: number;
  overscan?: number;
  indicatorHeight?: number;
  scrollEndDelay?: number;
};

export const pickboxMiniProps = {
  size: { type: null, value: 'md' },
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  columns: { type: Array, value: [] },
  value: { type: null, value: null },
  defaultValue: { type: Array, value: [] },
  estimateSize: { type: null, value: null },
  overscan: { type: Number, value: 5 },
  indicatorHeight: { type: null, value: null },
  scrollEndDelay: { type: Number, value: 180 },
} as const;
