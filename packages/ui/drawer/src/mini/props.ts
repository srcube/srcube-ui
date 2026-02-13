import type { DrawerMiniClassNames, DrawerPlacement } from '../style';

export type DrawerMiniProps = {
  isOpen?: boolean | null;
  defaultOpen?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
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
  backdrop: { type: null, value: 'opaque' },
  placement: { type: null, value: 'bottom' },
  title: { type: String, value: '' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
