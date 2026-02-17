import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const actionSheet = tv({
  slots: {
    base: 'fixed inset-0 z-[70]',
    overlay: 'absolute inset-0 bg-black/45',
    panel: 'absolute bottom-0 left-0 right-0 bg-white pb-safe',
    header: 'border-b border-slate-100 px-4 py-3',
    title: 'text-center text-base font-semibold text-slate-900',
    description: 'mt-1 text-center text-xs text-slate-500',
    list: 'py-1',
    action: 'flex w-full flex-col items-center justify-center px-4 py-3 text-center transition-colors',
    actionLabel: 'text-base font-medium',
    actionDescription: 'mt-1 text-xs text-slate-500',
    cancel: 'mt-2 flex w-full items-center justify-center border-t border-slate-100 px-4 py-3 text-base font-semibold text-slate-900',
  },
  variants: {
    size: {
      sm: {
        action: 'py-2.5',
        actionLabel: 'text-sm',
        cancel: 'py-2.5 text-sm',
      },
      md: {
        action: 'py-3',
        actionLabel: 'text-base',
        cancel: 'py-3 text-base',
      },
      lg: {
        action: 'py-4',
        actionLabel: 'text-lg',
        cancel: 'py-4 text-lg',
      },
    },
    radius: {
      none: {
        panel: 'rounded-none',
      },
      sm: {
        panel: 'rounded-t-lg',
      },
      md: {
        panel: 'rounded-t-xl',
      },
      lg: {
        panel: 'rounded-t-2xl',
      },
      full: {
        panel: 'rounded-t-3xl',
      },
    },
    isInset: {
      true: {
        panel: 'mx-2 mb-2',
      },
      false: {
        panel: 'mx-0 mb-0',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    radius: 'lg',
    isInset: false,
  },
});

export const actionSheetActionState = tv({
  base: '',
  variants: {
    color: {
      default: 'text-slate-900',
      danger: 'text-danger',
    },
    isDisabled: {
      true: 'opacity-40 pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    color: 'default',
    isDisabled: false,
  },
});

export type ActionSheetVariants = VariantProps<typeof actionSheet>;
export type ActionSheetClasses = VariantClasses<typeof actionSheet>;
export type ActionSheetClassNames = ActionSheetClasses;
export type ActionSheetReactClassNames = ActionSheetClassNames;
export type ActionSheetMiniClassNames = ActionSheetClassNames;
