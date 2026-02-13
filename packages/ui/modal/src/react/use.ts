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
import { useAnimatePresence } from './use-animate-presence';

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
    motion,
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
  const { isVisible, isClosing } = useAnimatePresence({ isOpen, duration: 500 });
  const isMotionOpen = isVisible && !isClosing;

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
    if (!isVisible) return;
    lockPageScroll();
    return () => {
      unlockPageScroll();
    };
  }, [isVisible]);

  const slots = useMemo(
    () =>
      modal({
        isOpen: isMotionOpen,
        motion: motion ?? undefined,
        backdrop: backdrop ?? undefined,
      }),
    [isMotionOpen, motion, backdrop],
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
    isVisible,
    isClosing,
    open,
    close,
    setOpen,
    getRootPortalProps,
  };
}

export type UseModalReturn = ReturnType<typeof useModal>;
