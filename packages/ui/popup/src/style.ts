import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const popup = tv({
  slots: {
    rootPortal: '',
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

export type PopupVariants = VariantProps<typeof popup>;
export type PopupClasses = VariantClasses<typeof popup>;
