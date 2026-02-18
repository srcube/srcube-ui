import type { CardMiniClassNames, CardVariants } from '../style';

export type CardMiniProps = CardVariants & {
  title?: string;
  description?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasStartContent?: boolean;
  hasEndContent?: boolean;
  isHeaderDivider?: boolean;
  isFooterDivider?: boolean;
  className?: string;
  classNames?: Partial<CardMiniClassNames>;
  style?: string;
};

export const cardMiniProps = {
  title: { type: String, value: '' },
  description: { type: String, value: '' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'md' },
  shadow: { type: null, value: 'sm' },
  isBordered: { type: Boolean, value: true },
  hasHeader: { type: Boolean, value: false },
  hasFooter: { type: Boolean, value: false },
  hasStartContent: { type: Boolean, value: false },
  hasEndContent: { type: Boolean, value: false },
  isHeaderDivider: { type: Boolean, value: false },
  isFooterDivider: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
