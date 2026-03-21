import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const pickbox = tv({
  slots: {
    base:
      'relative isolate overflow-hidden rounded-2xl border border-slate-200 bg-white outline-none',
    columns: 'relative z-10 flex h-full divide-x divide-slate-100',
    column: 'relative min-w-0 flex-1',
    columnScroll: 'h-full overflow-y-auto scrollbar-none outline-none',
    columnContent: 'relative w-full',
    item:
      'absolute left-0 right-0 flex select-none origin-center items-center justify-center transition-colors duration-200',
    itemLabel: 'truncate',
    indicator:
      'pointer-events-none absolute inset-0 top-1/2 z-0 w-full -translate-y-1/2',
    maskTop: '',
    maskBottom: '',
  },
  variants: {
    size: {
      sm: {
        base: 'h-56',
        item: 'px-2',
        itemLabel: 'text-xs',
        indicator: 'rounded-xl',
      },
      md: {
        base: 'h-64',
        item: 'px-3',
        itemLabel: 'text-sm',
        indicator: 'rounded-2xl',
      },
      lg: {
        base: 'h-72',
        item: 'px-4',
        itemLabel: 'text-base',
        indicator: 'rounded-2xl',
      },
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    tone: {
      default: {},
      dark: {
        base: 'border-zinc-800 bg-zinc-950',
        columns: 'divide-zinc-800',
      },
    },
  },
  compoundVariants: [
    {
      color: 'default',
      tone: 'default',
      class: {
        indicator: 'bg-default-100 bg-slate-100',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        indicator: 'bg-primary-50',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        indicator: 'bg-secondary-50',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        indicator: 'bg-success-50',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        indicator: 'bg-warning-50',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        indicator: 'bg-danger-50',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      class: {
        indicator: 'bg-zinc-900',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        indicator: 'bg-primary-950',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        indicator: 'bg-secondary-950',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        indicator: 'bg-success-950',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        indicator: 'bg-warning-950',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        indicator: 'bg-danger-950',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'default',
    tone: 'default',
  },
});

export const pickboxItemState = tv({
  base: '',
  variants: {
    color: {
      default: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
    },
    tone: {
      default: '',
      dark: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    isSelected: {
      true: '',
      false: '',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-40',
      false: '',
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      tone: 'default',
      class: 'text-slate-700',
    },
    {
      isSelected: false,
      tone: 'dark',
      class: 'text-zinc-300',
    },
    {
      isSelected: true,
      color: 'default',
      tone: 'default',
      class: 'text-slate-900',
    },
    {
      isSelected: true,
      color: 'primary',
      tone: 'default',
      class: 'text-primary-500',
    },
    {
      isSelected: true,
      color: 'secondary',
      tone: 'default',
      class: 'text-secondary-500',
    },
    {
      isSelected: true,
      color: 'success',
      tone: 'default',
      class: 'text-success-500',
    },
    {
      isSelected: true,
      color: 'warning',
      tone: 'default',
      class: 'text-warning-500',
    },
    {
      isSelected: true,
      color: 'danger',
      tone: 'default',
      class: 'text-danger-500',
    },
    {
      isSelected: true,
      color: 'default',
      tone: 'dark',
      class: 'text-zinc-50',
    },
    {
      isSelected: true,
      color: 'primary',
      tone: 'dark',
      class: 'text-primary-200',
    },
    {
      isSelected: true,
      color: 'secondary',
      tone: 'dark',
      class: 'text-secondary-200',
    },
    {
      isSelected: true,
      color: 'success',
      tone: 'dark',
      class: 'text-success-200',
    },
    {
      isSelected: true,
      color: 'warning',
      tone: 'dark',
      class: 'text-warning-200',
    },
    {
      isSelected: true,
      color: 'danger',
      tone: 'dark',
      class: 'text-danger-200',
    },
    {
      isSelected: true,
      size: 'sm',
      class: 'font-medium',
    },
    {
      isSelected: true,
      size: 'md',
      class: 'font-semibold',
    },
    {
      isSelected: true,
      size: 'lg',
      class: 'font-semibold',
    },
  ],
  defaultVariants: {
    color: 'default',
    tone: 'default',
    size: 'md',
    isSelected: false,
    isDisabled: false,
  },
});

export type PickboxVariants = VariantProps<typeof pickbox>;
export type PickboxClasses = VariantClasses<typeof pickbox>;
export type PickboxClassNames = PickboxClasses;
export type PickboxReactClassNames = PickboxClassNames;
export type PickboxMiniClassNames = PickboxClassNames;
