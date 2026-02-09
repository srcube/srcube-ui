import type * as React from 'react';
import type { ModalClasses, ModalVariants } from '../style';

export type ModalRef = HTMLDivElement & {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export type ModalClassNames = Partial<ModalClasses>;

export type ModalReactProps = ModalVariants &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    isOpen?: boolean;
    defaultOpen?: boolean;
    isDismissable?: boolean;
    hasBackdrop?: boolean;
    children?: React.ReactNode;
    className?: string;
    classNames?: ModalClassNames;
    onOpenChange?: (isOpen: boolean) => void;
    onClose?: () => void;
  };
