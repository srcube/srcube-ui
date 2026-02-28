import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const actionSheet = tv({
  slots: {
    base: '',
    overlay: 'bg-zinc-900/25',
    panel:
      'inset-x-0 bottom-0 top-auto h-fit max-h-[90vh] overflow-visible bg-transparent shadow-none outline-none pt-2',
    content: 'overflow-hidden bg-white',
    header: 'bg-slate-50 px-4 pb-2 pt-4',
    title: 'text-center text-base font-semibold text-slate-900',
    description: 'mt-1 text-center text-xs text-slate-500',
    list: '',
    actionGroup: 'w-full overflow-hidden',
    actionDivider: 'h-px w-full bg-slate-100',
    action: 'h-auto rounded-none px-0 bg-white',
    actionLast: '',
    actionContent: 'flex w-full flex-col items-center justify-center text-center',
    actionLabel: 'block text-base font-medium leading-5',
    actionDescription: 'mt-1 block text-xs leading-4 opacity-70',
    footer: 'mt-2 w-full pb-safe-4',
    cancelGroup: 'w-full',
    cancel: 'h-auto bg-white font-semibold active:bg-slate-100',
  },
  variants: {
    isOpen: {
      true: {
        overlay: 'animate-fade-in',
        panel: 'animate-action-sheet-in',
      },
      false: {
        overlay: 'animate-fade-out',
        panel: 'animate-action-sheet-out',
      },
    },
    size: {
      sm: {
        header: 'px-3 pb-1.5 pt-3',
        title: 'text-sm',
        description: 'mt-1 text-[11px]',
        actionContent: 'min-h-8 px-3 py-1.5',
        actionLabel: 'text-sm',
        cancel: 'min-h-9 px-3 py-2 text-sm',
      },
      md: {
        header: 'px-4 pb-2 pt-4',
        title: 'text-base',
        description: 'mt-1 text-xs',
        actionContent: 'min-h-10 px-4 py-2.5',
        actionLabel: 'text-base',
        cancel: 'min-h-11 px-4 py-2.5 text-base',
      },
      lg: {
        header: 'px-5 pb-3 pt-5',
        title: 'text-lg',
        description: 'mt-1.5 text-sm',
        actionContent: 'min-h-12 px-5 py-3.5',
        actionLabel: 'text-lg',
        cancel: 'min-h-12 px-5 py-3.5 text-lg',
      },
    },
    radius: {
      none: {
        content: 'rounded-none',
        actionGroup: 'rounded-none',
        cancelGroup: 'overflow-hidden rounded-none',
        actionLast: 'rounded-none',
      },
      sm: {
        content: 'rounded-lg',
        actionGroup: 'rounded-b-lg',
        cancelGroup: 'overflow-hidden rounded-lg',
        actionLast: 'rounded-b-lg',
      },
      md: {
        content: 'rounded-xl',
        actionGroup: 'rounded-b-xl',
        cancelGroup: 'overflow-hidden rounded-xl',
        actionLast: 'rounded-b-xl',
      },
      lg: {
        content: 'rounded-2xl',
        actionGroup: 'rounded-b-2xl',
        cancelGroup: 'overflow-hidden rounded-2xl',
        actionLast: 'rounded-b-2xl',
      },
      full: {
        content: 'rounded-full',
        actionGroup: 'rounded-b-full',
        cancelGroup: 'overflow-hidden rounded-full',
        actionLast: 'rounded-b-full',
      },
    },
    isInset: {
      true: {
        panel: 'px-2',
      },
      false: {
        panel: 'px-0',
      },
    },
  },
  defaultVariants: {
    isOpen: true,
    size: 'md',
    radius: 'lg',
    isInset: false,
  },
});

export const actionSheetAction = tv({
  base: 'border-none rounded-none bg-white',
  variants: {
    color: {
      default: 'text-slate-900 active:text-slate-900 active:bg-slate-50',
      primary: 'text-primary-500 active:text-primary-600 active:bg-primary-50',
      secondary:
        'text-secondary-500 active:text-secondary-600 active:bg-secondary-50',
      success: 'text-success-500 active:text-success-600 active:bg-success-50',
      warning: 'text-warning-500 active:text-warning-600 active:bg-warning-50',
      danger: 'text-danger-500 active:text-danger-600 active:bg-danger-50',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export type ActionSheetVariants = VariantProps<typeof actionSheet>;
export type ActionSheetClasses = VariantClasses<typeof actionSheet>;
export type ActionSheetClassNames = ActionSheetClasses;
export type ActionSheetReactClassNames = ActionSheetClassNames;
export type ActionSheetMiniClassNames = ActionSheetClassNames;
export type ActionSheetActionVariants = VariantProps<typeof actionSheetAction>;
export type ActionSheetActionColor = NonNullable<ActionSheetActionVariants['color']>;
