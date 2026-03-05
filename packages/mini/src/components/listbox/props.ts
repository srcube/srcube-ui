import type { ListboxMiniClassNames, ListboxVariants } from '@srcube-ui/styles/components/listbox/style';
import type { ListboxLocale } from './locale';

export type ListboxMiniItem = {
  id: string | number;
  label: string;
  isDisabled?: boolean;
  isSticky?: boolean;
  className?: string;
  labelClassName?: string;
  endIconClassName?: string;
};

export type ListboxMiniProps = ListboxVariants & {
  className?: string;
  classNames?: ListboxMiniClassNames;
  style?: string;
  items?: ListboxMiniItem[];
  estimateSize?: number;
  overscan?: number;
  hideEmptyContent?: boolean;
  emptyContent?: string;
  locale?: ListboxLocale;

  hideMasks?: boolean;
  upperThreshold?: number;
  lowerThreshold?: number;
  scrollTop?: number | null;
  scrollLeft?: number | null;
  scrollIntoView?: string;
  scrollWithAnimation?: boolean;
  enableBackToTop?: boolean;
  showScrollbar?: boolean | null;
  enhanced?: boolean;
  bounces?: boolean | null;
  pagingEnabled?: boolean;
  fastDeceleration?: boolean;
  enableFlex?: boolean;
  scrollAnchoring?: boolean;
  refresherEnabled?: boolean;
  refresherThreshold?: number;
  refresherDefaultStyle?: string;
  refresherBackground?: string;
  refresherTriggered?: boolean;
};

export const listboxMiniProps = {
  orientation: { type: null, value: 'y' },
  size: { type: null, value: 'md' },
  hasDivider: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  items: { type: Array, value: [] },
  estimateSize: { type: Number, value: 40 },
  overscan: { type: Number, value: 5 },
  hideEmptyContent: { type: Boolean, value: false },
  emptyContent: { type: String, value: '' },
  locale: { type: String, value: 'en' },

  hideMasks: { type: Boolean, value: false },
  upperThreshold: { type: Number, value: 50 },
  lowerThreshold: { type: Number, value: 50 },
  scrollTop: { type: null, value: null },
  scrollLeft: { type: null, value: null },
  scrollIntoView: { type: String, value: '' },
  scrollWithAnimation: { type: Boolean, value: false },
  enableBackToTop: { type: Boolean, value: false },
  showScrollbar: { type: null, value: null },
  enhanced: { type: Boolean, value: false },
  bounces: { type: null, value: null },
  pagingEnabled: { type: Boolean, value: false },
  fastDeceleration: { type: Boolean, value: false },
  enableFlex: { type: Boolean, value: false },
  scrollAnchoring: { type: Boolean, value: false },
  refresherEnabled: { type: Boolean, value: false },
  refresherThreshold: { type: Number, value: 45 },
  refresherDefaultStyle: { type: String, value: 'black' },
  refresherBackground: { type: String, value: '#fff' },
  refresherTriggered: { type: Boolean, value: false },
} as const;
