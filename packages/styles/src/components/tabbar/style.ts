import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const tabbar = tv({
  slots: {
    base: 'w-full bg-white',
    list: 'flex w-full items-stretch',
    item: 'flex min-w-0 flex-1 items-center justify-center px-2 transition-colors',
    main: 'relative inline-flex min-w-0 flex-col items-center justify-center gap-1',
    icon: 'text-base',
    label: 'truncate text-xs font-medium',
    badge: 'pointer-events-none absolute -right-3 -top-2 z-[1]',
    badgeDot: 'block h-2 w-2 rounded-full bg-danger',
    badgeContent:
      'inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-medium leading-none text-white',
  },
  variants: {
    size: {
      sm: {
        item: 'h-12',
        badge: '-right-2 -top-1.5',
        badgeDot: 'h-1.5 w-1.5',
        badgeContent: 'min-h-3.5 min-w-3.5 px-1 text-[9px]',
        icon: 'text-sm',
        label: 'text-[11px]',
      },
      md: {
        item: 'h-14',
        badge: '-right-3 -top-2',
        badgeDot: 'h-2 w-2',
        badgeContent: 'min-h-4 min-w-4 px-1 text-[10px]',
        icon: 'text-base',
        label: 'text-xs',
      },
      lg: {
        item: 'h-16',
        badge: '-right-3.5 -top-2.5',
        badgeDot: 'h-2.5 w-2.5',
        badgeContent: 'min-h-5 min-w-5 px-1.5 text-[11px]',
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
