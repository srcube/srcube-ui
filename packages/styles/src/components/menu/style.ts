import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const menu = tv({
  slots: {
    base: 'relative inline-flex',
    trigger: 'inline-flex',
    layer: 'absolute z-50',
    content:
      'min-w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl',
    list: 'flex gap-1',
    item:
      'inline-flex min-w-0 items-center justify-center whitespace-nowrap font-medium transition-colors duration-150',
    itemLabel: 'truncate',
    arrow: 'absolute h-2 w-2 rotate-45 border border-slate-200 bg-white',
    backdrop: 'fixed inset-0 z-40 bg-transparent',
  },
  variants: {
    placement: {
      top: {
        layer: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
        arrow: '-bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0',
      },
      bottom: {
        layer: 'left-1/2 top-full mt-2 -translate-x-1/2',
        arrow: '-top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0',
      },
      left: {
        layer: 'right-full top-1/2 mr-2 -translate-y-1/2',
        arrow: '-right-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0',
      },
      right: {
        layer: 'left-full top-1/2 ml-2 -translate-y-1/2',
        arrow: '-left-1 top-1/2 -translate-y-1/2 border-t-0 border-r-0',
      },
    },
    orientation: {
      x: {
        list: 'flex-row flex-wrap items-center',
      },
      y: {
        list: 'flex-col',
      },
    },
    size: {
      sm: {
        content: 'min-w-32 p-1.5',
        item: 'h-7 px-2.5 text-xs',
      },
      md: {
        content: 'min-w-40 p-2',
        item: 'h-8 px-3 text-sm',
      },
      lg: {
        content: 'min-w-48 p-2.5',
        item: 'h-10 px-4 text-base',
      },
    },
    radius: {
      none: {
        content: 'rounded-none',
        item: 'rounded-none',
      },
      sm: {
        content: 'rounded-lg',
        item: 'rounded-lg',
      },
      md: {
        content: 'rounded-xl',
        item: 'rounded-xl',
      },
      lg: {
        content: 'rounded-2xl',
        item: 'rounded-2xl',
      },
      full: {
        content: 'rounded-3xl',
        item: 'rounded-full',
      },
    },
    variant: {
      solid: {},
      flat: {},
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
        content: 'border-slate-800 bg-slate-950',
        arrow: 'border-slate-800 bg-slate-950',
      },
    },
    hasArrow: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    placement: 'bottom',
    orientation: 'y',
    size: 'md',
    radius: 'md',
    variant: 'solid',
    color: 'default',
    tone: 'default',
    hasArrow: true,
  },
});

export const menuItemState = tv({
  base: '',
  variants: {
    isSelected: {
      true: '',
      false: '',
    },
    isDisabled: {
      true: 'pointer-events-none opacity-40',
      false: '',
    },
    variant: {
      solid: '',
      flat: '',
    },
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
  },
  compoundVariants: [
    {
      isSelected: false,
      tone: 'default',
      class: 'text-slate-700 active:bg-slate-100',
    },
    {
      isSelected: false,
      tone: 'dark',
      class: 'text-slate-200 active:bg-slate-800',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'default',
      tone: 'default',
      class: 'bg-slate-900 text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'default',
      tone: 'dark',
      class: 'bg-white text-slate-900',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'default',
      tone: 'default',
      class: 'bg-slate-100 text-slate-900',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'default',
      tone: 'dark',
      class: 'bg-slate-800 text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'primary',
      class: 'bg-primary text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'secondary',
      class: 'bg-secondary text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'success',
      class: 'bg-success text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'warning',
      class: 'bg-warning text-white',
    },
    {
      isSelected: true,
      variant: 'solid',
      color: 'danger',
      class: 'bg-danger text-white',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'primary',
      tone: 'default',
      class: 'bg-primary-100 text-primary-700',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'secondary',
      tone: 'default',
      class: 'bg-secondary-100 text-secondary-700',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'success',
      tone: 'default',
      class: 'bg-success-100 text-success-700',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'warning',
      tone: 'default',
      class: 'bg-warning-100 text-warning-700',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'danger',
      tone: 'default',
      class: 'bg-danger-100 text-danger-700',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'primary',
      tone: 'dark',
      class: 'bg-primary-500/25 text-primary-100',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'secondary',
      tone: 'dark',
      class: 'bg-secondary-500/25 text-secondary-100',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'success',
      tone: 'dark',
      class: 'bg-success-500/25 text-success-100',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'warning',
      tone: 'dark',
      class: 'bg-warning-500/25 text-warning-100',
    },
    {
      isSelected: true,
      variant: 'flat',
      color: 'danger',
      tone: 'dark',
      class: 'bg-danger-500/25 text-danger-100',
    },
  ],
  defaultVariants: {
    isSelected: false,
    isDisabled: false,
    variant: 'solid',
    color: 'default',
    tone: 'default',
  },
});

export type MenuVariants = VariantProps<typeof menu>;
export type MenuClasses = VariantClasses<typeof menu>;
export type MenuClassNames = MenuClasses;
export type MenuReactClassNames = MenuClassNames;
export type MenuMiniClassNames = MenuClassNames;
