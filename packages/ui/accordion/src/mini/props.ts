import type {
  AccordionMiniClassNames,
  AccordionVariants,
} from '../style';

export type AccordionMiniValue = string | number;

export type AccordionMiniItem = {
  value: AccordionMiniValue;
  title: string;
  content: string;
  isDisabled?: boolean;
};

export type AccordionMiniSelectionMode = 'single' | 'multiple';

export type AccordionMiniChangeValue =
  | AccordionMiniValue
  | AccordionMiniValue[]
  | null;

export type AccordionMiniProps = AccordionVariants & {
  items?: AccordionMiniItem[];
  selectionMode?: AccordionMiniSelectionMode;
  value?: AccordionMiniChangeValue;
  defaultValue?: AccordionMiniChangeValue;
  isDisabled?: boolean;
  hasIndicator?: boolean;
  className?: string;
  classNames?: Partial<AccordionMiniClassNames>;
  style?: string;
};

export const accordionMiniProps = {
  variant: { type: null, value: 'outline' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'md' },
  isSeparated: { type: Boolean, value: true },
  items: { type: Array, value: [] },
  selectionMode: { type: null, value: 'single' },
  value: { type: null, value: null },
  defaultValue: { type: null, value: null },
  isDisabled: { type: Boolean, value: false },
  hasIndicator: { type: Boolean, value: true },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
