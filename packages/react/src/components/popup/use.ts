import type React from 'react';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { popup } from '@srcube-ui/styles/components/popup';
import type { PopupClassNames, PopupReactProps, PopupRef } from './props';
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

export interface UsePopupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    PopupReactProps {
  ref?: React.Ref<PopupRef>;
}

export function usePopup(props: UsePopupProps) {
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
      popup({
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
    }) as PopupRef;
  });

  const getRootPortalProps = useCallback(() => {
    return {
      ref: domRef,
      className: slots.base({
        class: [classNames?.base, className],
      }),
      ...rest,
    };
  }, [className, classNames, rest, slots]);

  return {
    domRef,
    classNames: classNames as PopupClassNames | undefined,
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

export type UsePopupReturn = ReturnType<typeof usePopup>;
