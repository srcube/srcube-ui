import type { NavbarMiniClassNames, NavbarVariants } from '@srcube-ui/styles/components/navbar/style';

export type NavbarMiniProps = NavbarVariants & {
  title?: string;
  withBack?: boolean;
  className?: string;
  classNames?: Partial<NavbarMiniClassNames>;
  style?: string;
};

export const navbarMiniProps = {
  title: { type: String, value: '' },
  size: { type: null, value: 'md' },
  isBordered: { type: Boolean, value: true },
  hasSafeTop: { type: Boolean, value: false },
  titleAlign: { type: null, value: 'center' },
  withBack: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
