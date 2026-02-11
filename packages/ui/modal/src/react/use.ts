import type React from 'react';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { modal } from '../style';
import type { ModalClassNames, ModalReactProps, ModalRef } from './props';

let scrollLockCount = 0;
let originalBodyOverflow: string | null = null;

function lockPageScroll() {
  if (typeof document === 'undefined') return;
  if (scrollLockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
}

function unlockPageScroll() {
  if (typeof document === 'undefined') return;
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = originalBodyOverflow ?? '';
    originalBodyOverflow = null;
  }
}

export interface UseModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    ModalReactProps {
  ref?: React.Ref<ModalRef>;
}

export function useModal(props: UseModalProps) {
  const {
    ref,
    isOpen: isOpenProp,
    defaultOpen,
    isDismissable = true,
    hasBackdrop = true,
    backdrop,
    children,
    className,
    classNames,
    onOpenChange,
    onClose,
    ...rest
  } = props;

  const domRef = useRef<HTMLDivElement>(null);
  const isControlled = isOpenProp !== null && isOpenProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    defaultOpen ?? false,
  );
  const isOpen = isControlled ? Boolean(isOpenProp) : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      onClose?.();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    lockPageScroll();
    return () => {
      unlockPageScroll();
    };
  }, [isOpen]);

  const slots = useMemo(
    () =>
      modal({
        isOpen,
        backdrop: backdrop ?? undefined,
      }),
    [isOpen, backdrop],
  );

  useImperativeHandle(ref, () => {
    return Object.assign(domRef.current || {}, {
      isOpen,
      open,
      close,
    }) as ModalRef;
  });

  const getRootPortalProps = useCallback(() => {
    return {
      ref: domRef,
      className: slots.rootPortal({
        class: [classNames?.rootPortal, className],
      }),
      ...rest,
    };
  }, [className, classNames, rest, slots]);

  return {
    domRef,
    classNames: classNames as ModalClassNames | undefined,
    slots,
    children,
    isDismissable,
    hasBackdrop,
    isOpen,
    open,
    close,
    setOpen,
    getRootPortalProps,
  };
}

export type UseModalReturn = ReturnType<typeof useModal>;
