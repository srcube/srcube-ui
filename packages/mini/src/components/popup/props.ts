import type { PopupClasses, PopupVariants } from '@srcube-ui/styles/components/popup/style';

export type PopupMiniProps = PopupVariants & {
  isOpen?: boolean;
  defaultOpen?: boolean;
  isDismissable?: boolean;
  hasBackdrop?: boolean;
  className?: string;
  classNames?: Partial<PopupClasses>;
  style?: string;
};

export const popupMiniProps = {
  isOpen: { type: null, value: null },
  defaultOpen: { type: Boolean, value: false },
  isDismissable: { type: Boolean, value: true },
  hasBackdrop: { type: Boolean, value: true },
  motion: { type: null, value: 'modal' },
  backdrop: { type: null, value: 'opaque' },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
