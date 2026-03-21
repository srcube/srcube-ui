import type { ListboxMiniProps } from '../listbox';
import type {
  SelectboxMiniClassNames,
  SelectboxVariants,
} from '@srcube-ui/styles/components/selectbox/style';

export type SelectboxMiniItemId = string | number;

export type SelectboxMiniItem = {
  id: SelectboxMiniItemId;
  label: string;
  isDisabled?: boolean;
  isSticky?: boolean;
  className?: string;
  labelClassName?: string;
};

export type SelectboxMiniValue = Array<SelectboxMiniItemId>;
export type SelectboxMiniSelectionMode = 'single' | 'multiple';

type ListboxForwardProps = Pick<
  ListboxMiniProps,
  | 'estimateSize'
  | 'overscan'
  | 'orientation'
  | 'hasDivider'
  | 'hideEmptyContent'
  | 'emptyContent'
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
>;

export type SelectboxMiniProps = SelectboxVariants &
  ListboxForwardProps & {
    className?: string;
    classNames?: Partial<SelectboxMiniClassNames>;
    listboxClassNames?: ListboxMiniProps['classNames'];
    style?: string;
    items?: SelectboxMiniItem[];
    value?: SelectboxMiniValue | null;
    defaultValue?: SelectboxMiniValue;
    selectionMode?: SelectboxMiniSelectionMode;
    selectIcon?: boolean;
  };

export const selectboxMiniProps = {
  orientation: { type: null, value: 'y' },
  size: { type: null, value: 'md' },
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  hasDivider: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  listboxClassNames: { type: Object, value: {} },
  style: { type: String, value: '' },
  items: { type: Array, value: [] },
  value: { type: null, value: null },
  defaultValue: { type: Array, value: [] },
  selectionMode: { type: null, value: 'multiple' },
  selectIcon: { type: Boolean, value: false },
  estimateSize: { type: null, value: null },
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
