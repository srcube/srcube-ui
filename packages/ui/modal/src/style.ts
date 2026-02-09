import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const modal = tv({
  slots: {
    rootPortal: 'fixed inset-0 z-[1000] flex items-center justify-center',
    backdrop: 'absolute inset-0',
    content:
      'relative z-[1001] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl bg-white shadow-lg flex flex-col',
    header: 'px-4 pt-4 text-base font-semibold text-slate-900',
    body: 'px-4 py-3 text-sm text-slate-600',
    footer: 'px-4 pb-4 pt-2 flex items-center justify-end gap-2',
  },
  variants: {
    isOpen: {
      true: {
        backdrop: 'animate-fade-in',
        content: 'animate-modal-in',
      },
      false: {
        backdrop: 'animate-fade-out',
        content: 'animate-modal-out',
      },
    },
    backdrop: {
      transparent: {
        backdrop: 'bg-transparent',
      },
      opaque: {
        backdrop: 'bg-slate-900/30',
      },
      blur: {
        backdrop: 'bg-slate-900/30 backdrop-blur-xs',
      },
    },
  },
  defaultVariants: {
    backdrop: 'opaque',
  },
});

export type ModalVariants = VariantProps<typeof modal>;
export type ModalClasses = VariantClasses<typeof modal>;
