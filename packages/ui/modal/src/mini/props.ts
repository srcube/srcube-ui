import type { ModalClasses, ModalVariants } from '../style';

export type ModalMiniProps = ModalVariants & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
  className?: string;
  classNames?: ModalClasses;
  style?: string;
};

export const modalMiniProps = {
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  isDismissable: { type: Boolean, value: true },
  hasBackdrop: { type: Boolean, value: true },
  backdrop: { type: null, value: 'opaque' },
  className: { type: String, value: '' },
  classNames: Object,
  style: { type: String, value: '' },
} as const;
