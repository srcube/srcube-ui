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
      'pointer-events-none absolute inset-x-2 top-1/2 z-0 -translate-y-1/2',
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
      default: {
        indicator: 'bg-default-100 bg-slate-100',
      },
      primary: {
        indicator: 'bg-primary-50',
      },
      secondary: {
        indicator: 'bg-secondary-50',
      },
      success: {
        indicator: 'bg-success-50',
      },
      warning: {
        indicator: 'bg-warning-50',
      },
      danger: {
        indicator: 'bg-danger-50',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
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
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    isSelected: {
      true: '',
      false: 'text-slate-700',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-40',
      false: '',
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      color: 'default',
      class: 'text-slate-900',
    },
    {
      isSelected: true,
      color: 'primary',
      class: 'text-primary-500',
    },
    {
      isSelected: true,
      color: 'secondary',
      class: 'text-secondary-500',
    },
    {
      isSelected: true,
      color: 'success',
      class: 'text-success-500',
    },
    {
      isSelected: true,
      color: 'warning',
      class: 'text-warning-500',
    },
    {
      isSelected: true,
      color: 'danger',
      class: 'text-danger-500',
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
