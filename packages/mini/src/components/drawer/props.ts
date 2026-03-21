import type { DrawerMiniClassNames, DrawerPlacement } from '@srcube-ui/styles/components/drawer/style';

export type DrawerMiniProps = {
  isOpen?: boolean | null;
  defaultOpen?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
  tone?: 'default' | 'dark';
  backdrop?: 'transparent' | 'opaque' | 'blur';
  placement?: DrawerPlacement;
  title?: string;
  className?: string;
  classNames?: DrawerMiniClassNames;
  style?: string;
};

export const drawerMiniProps = {
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  isDismissable: { type: Boolean, value: true },
  hasBackdrop: { type: Boolean, value: true },
  tone: { type: null, value: 'default' },
  backdrop: { type: null, value: 'opaque' },
  placement: { type: null, value: 'bottom' },
  title: { type: String, value: '' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
