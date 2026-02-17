import type { NavbarMiniClassNames, NavbarVariants } from '../style';

export type NavbarMiniProps = NavbarVariants & {
  id?: string;
  title?: string;
  className?: string;
  classNames?: Partial<NavbarMiniClassNames>;
  style?: string;
};

export const navbarMiniProps = {
  id: { type: String, value: '' },
  title: { type: String, value: '' },
  size: { type: null, value: 'md' },
  isBordered: { type: Boolean, value: true },
  hasSafeTop: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
