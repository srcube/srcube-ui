import {
  tv,
} from '../../shared/tv';

export type PopupMotion = 'modal' | 'none';
export type PopupBackdropTone = 'transparent' | 'opaque' | 'blur';
export type PopupVariants = {
  isOpen?: boolean;
  motion?: PopupMotion;
  backdrop?: PopupBackdropTone;
};
export type PopupSlot =
  | 'base'
  | 'backdrop'
  | 'content'
  | 'header'
  | 'body'
  | 'footer';
export type PopupClasses = Record<PopupSlot, string>;

export const popup = tv({
  slots: {
    base: '',
    backdrop: 'fixed inset-0 z-[1000]',
    content:
      'fixed inset-0 z-[1001] overflow-hidden flex flex-col h-fit bg-white outline-none',
    header: '',
    body: '',
    footer: '',
  },
  variants: {
    isOpen: {
      true: {
        backdrop: 'animate-fade-in',
      },
      false: {
        backdrop: 'animate-fade-out',
      },
    },
    motion: {
      modal: {},
      none: {},
    },
    backdrop: {
      transparent: {
        backdrop: 'bg-transparent',
      },
      opaque: {
        backdrop: 'bg-zinc-900/25',
      },
      blur: {
        backdrop: 'bg-zinc-900/25 backdrop-blur-sm',
      },
    },
  },
  compoundVariants: [
    {
      isOpen: true,
      motion: 'modal',
      class: {
        content: 'animate-modal-in',
      },
    },
    {
      isOpen: false,
      motion: 'modal',
      class: {
        content: 'animate-modal-out',
      },
    },
  ],
  defaultVariants: {
    motion: 'modal',
    backdrop: 'opaque',
  },
});
