import type * as React from 'react';
import type {
  PickboxReactClassNames,
  PickboxVariants,
} from '../style';

export type PickboxItemId = string | number;

export type PickboxItem = {
  id: PickboxItemId;
  label: React.ReactNode;
  isDisabled?: boolean;
};

export type PickboxColumn = {
  id?: string | number;
  items: PickboxItem[];
};

export type PickboxValue = Array<PickboxItemId | null>;

export type PickboxRenderItem = (
  item: PickboxItem,
  columnIndex: number,
  itemIndex: number,
  state: {
    isSelected: boolean;
    isDisabled: boolean;
  },
) => React.ReactNode;

export type PickboxReactProps = PickboxVariants &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
    columns: PickboxColumn[];
    value?: PickboxValue;
    defaultValue?: PickboxValue;
    onValueChange?: (value: PickboxValue) => void;
    estimateSize?: number;
    overscan?: number;
    indicatorHeight?: number;
    scrollEndDelay?: number;
    classNames?: PickboxReactClassNames;
    getItemKey?: (
      item: PickboxItem,
      columnIndex: number,
      itemIndex: number,
    ) => PickboxItemId;
    renderItem?: PickboxRenderItem;
  };
