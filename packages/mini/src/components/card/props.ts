import type { CardMiniClassNames, CardVariants } from '@srcube-ui/styles/components/card/style';

export type CardMiniProps = CardVariants & {
  hasHeader?: boolean;
  hasFooter?: boolean;
  className?: string;
  classNames?: Partial<CardMiniClassNames>;
  style?: string;
};

export const cardMiniProps = {
  color: { type: null, value: 'default' },
  tone: { type: null, value: 'default' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'md' },
  hasHeader: { type: Boolean, value: false },
  hasFooter: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
