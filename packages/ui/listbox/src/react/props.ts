import type * as React from 'react';
import type { ScrollboxReactProps } from '@srcube-ui/scrollbox/react';
import type {
  ListboxReactClassNames,
  ListboxVariants,
} from '../style';

type ScrollboxForwardProps = Pick<
  ScrollboxReactProps,
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
  | 'onScrollToUpper'
  | 'onScrollToLower'
>;

export type ListboxItem = {
  id: string | number;
  label: React.ReactNode;
  isDisabled?: boolean;
  isSticky?: boolean;
};

export type ListboxLocale = 'en' | 'zh-CN' | 'zh-TW';

export type ListboxReactProps = ListboxVariants &
  ScrollboxForwardProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
    items: ListboxItem[];
    estimateSize: number | ((index: number) => number);
    overscan?: number;
    emptyContent?: React.ReactNode;
    hideEmptyContent?: boolean;
    locale?: ListboxLocale;
    selectedKeys?: Array<string | number>;
    defaultSelectedKeys?: Array<string | number>;
    onSelectionChange?: (selectedKeys: Array<string | number>) => void;
    renderItem?: (item: ListboxItem, index: number) => React.ReactNode;
    getItemKey?: (item: ListboxItem, index: number) => string | number;
    itemClassName?: string;
    classNames?: ListboxReactClassNames;
    shouldMeasureItem?: boolean | ((item: ListboxItem, index: number) => boolean);
    onScroll?: React.UIEventHandler<HTMLDivElement>;
  };
