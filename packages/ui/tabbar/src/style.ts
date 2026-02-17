import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const tabbar = tv({
  slots: {
    base: 'w-full bg-white',
    list: 'flex w-full items-stretch',
    item: 'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-2 transition-colors',
    icon: 'text-base',
    label: 'truncate text-xs font-medium',
  },
  variants: {
    size: {
      sm: {
        item: 'h-12',
        icon: 'text-sm',
        label: 'text-[11px]',
      },
      md: {
        item: 'h-14',
        icon: 'text-base',
        label: 'text-xs',
      },
      lg: {
        item: 'h-16',
        icon: 'text-lg',
        label: 'text-sm',
      },
    },
    isBordered: {
      true: {
        base: 'border-t border-slate-200',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    isBordered: true,
  },
});

export const tabbarItemState = tv({
  base: 'w-full',
  variants: {
    isActive: {
      true: '',
      false: '',
    },
    isDisabled: {
      true: 'opacity-40 pointer-events-none',
      false: '',
    },
    color: {
      default: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
    },
  },
  compoundVariants: [
    {
      isActive: true,
      color: 'default',
      class: 'text-slate-900',
    },
    {
      isActive: false,
      class: 'text-slate-500',
    },
    {
      isActive: true,
      color: 'primary',
      class: 'text-primary',
    },
    {
      isActive: true,
      color: 'secondary',
      class: 'text-secondary',
    },
    {
      isActive: true,
      color: 'success',
      class: 'text-success',
    },
    {
      isActive: true,
      color: 'warning',
      class: 'text-warning',
    },
    {
      isActive: true,
      color: 'danger',
      class: 'text-danger',
    },
  ],
  defaultVariants: {
    isActive: false,
    isDisabled: false,
    color: 'default',
  },
});

export type TabbarVariants = VariantProps<typeof tabbar>;
export type TabbarClasses = VariantClasses<typeof tabbar>;
export type TabbarClassNames = TabbarClasses;
export type TabbarReactClassNames = TabbarClassNames;
export type TabbarMiniClassNames = TabbarClassNames;
