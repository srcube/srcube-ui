import type * as React from 'react';
import type {
  ListboxItem,
  ListboxLocale,
  ListboxReactProps,
} from '../listbox';
import type {
  SelectboxReactClassNames,
  SelectboxVariants,
} from '@srcube-ui/styles/components/selectbox';

export type SelectboxItemId = string | number;

export type SelectboxItem = Omit<ListboxItem, 'id'> & {
  id: SelectboxItemId;
};

export type SelectboxValue = Array<SelectboxItemId>;
export type SelectboxSelectionMode = 'single' | 'multiple';

type ListboxForwardBaseProps = Pick<
  ListboxReactProps,
  | 'estimateSize'
  | 'overscan'
  | 'orientation'
  | 'hasDivider'
  | 'emptyContent'
  | 'hideEmptyContent'
  | 'locale'
  | 'hideMasks'
  | 'upperThreshold'
  | 'lowerThreshold'
  | 'scrollTop'
  | 'scrollLeft'
  | 'scrollIntoView'
  | 'scrollWithAnimation'
  | 'enableBackToTop'
  | 'showScrollbar'
  | 'enhanced'
  | 'bounces'
  | 'pagingEnabled'
  | 'fastDeceleration'
  | 'enableFlex'
  | 'scrollAnchoring'
  | 'refresherEnabled'
  | 'refresherThreshold'
  | 'refresherDefaultStyle'
  | 'refresherBackground'
  | 'refresherTriggered'
  | 'onScroll'
  | 'onScrollToUpper'
  | 'onScrollToLower'
  | 'shouldMeasureItem'
  | 'getItemKey'
>;

type ListboxForwardProps = Omit<ListboxForwardBaseProps, 'estimateSize'> & {
  estimateSize?: ListboxReactProps['estimateSize'];
};

export type SelectboxReactProps = SelectboxVariants &
  ListboxForwardProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
    items: SelectboxItem[];
    value?: SelectboxValue;
    defaultValue?: SelectboxValue;
    selectionMode?: SelectboxSelectionMode;
    className?: string;
    classNames?: Partial<SelectboxReactClassNames>;
    listboxClassNames?: ListboxReactProps['classNames'];
    itemClassName?: string;
    itemLabelClassName?: string;
    selectIcon?: boolean;
    locale?: ListboxLocale;
    onValueChange?: (value: SelectboxValue) => void;
    onItemPress?: (item: SelectboxItem, index: number, value: SelectboxValue) => void;
    renderItem?: (
      item: SelectboxItem,
      index: number,
      isSelected: boolean,
    ) => React.ReactNode;
  };
