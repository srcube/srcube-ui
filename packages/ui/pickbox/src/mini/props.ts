import type {
  PickboxMiniClassNames,
  PickboxVariants,
} from '../style';

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
  color: { type: null, value: 'default' },
  className: { type: String, value: '' },
  classNames: Object,
  style: { type: String, value: '' },
  columns: { type: Array, value: [] },
  value: { type: null, value: null },
  defaultValue: { type: Array, value: [] },
  estimateSize: { type: Number, value: 44 },
  overscan: { type: Number, value: 5 },
  indicatorHeight: { type: Number, value: 44 },
  scrollEndDelay: { type: Number, value: 120 },
} as const;
