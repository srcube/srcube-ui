import type * as React from 'react';
import type { PopupClasses, PopupVariants } from '@srcube-ui/styles/components/popup';

export type PopupRef = HTMLDivElement & {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export type PopupClassNames = Partial<PopupClasses>;

export type PopupReactProps = PopupVariants &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDismissable?: boolean;
    hasBackdrop?: boolean;
    children?: React.ReactNode;
    className?: string;
    classNames?: PopupClassNames;
    onOpenChange?: (isOpen: boolean) => void;
    onClose?: () => void;
  };
