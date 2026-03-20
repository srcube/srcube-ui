import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const tabbar = tv({
  slots: {
    base: 'w-full',
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
    tone: {
      default: {},
      dark: {},
    },
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
        base: 'border-t',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: 'default',
      class: {
        base: 'bg-white',
      },
    },
    {
      tone: 'dark',
      class: {
        base: 'bg-zinc-950',
      },
    },
    {
      tone: 'default',
      isBordered: true,
      class: {
        base: 'border-slate-200',
      },
    },
    {
      tone: 'dark',
      isBordered: true,
      class: {
        base: 'border-zinc-800',
      },
    },
  ],
  defaultVariants: {
    tone: 'default',
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
    tone: {
      default: '',
      dark: '',
    },
  },
  compoundVariants: [
    {
      isActive: true,
      color: 'default',
      tone: 'default',
      class: 'text-slate-900',
    },
    {
      isActive: false,
      tone: 'default',
      class: 'text-slate-500',
    },
    {
      isActive: true,
      color: 'default',
      tone: 'dark',
      class: 'text-white',
    },
    {
      isActive: false,
      tone: 'dark',
      class: 'text-zinc-400',
    },
    {
      isActive: true,
      color: 'primary',
      tone: 'default',
      class: 'text-primary',
    },
    {
      isActive: true,
      color: 'secondary',
      tone: 'default',
      class: 'text-secondary',
    },
    {
      isActive: true,
      color: 'success',
      tone: 'default',
      class: 'text-success',
    },
    {
      isActive: true,
      color: 'warning',
      tone: 'default',
      class: 'text-warning',
    },
    {
      isActive: true,
      color: 'danger',
      tone: 'default',
      class: 'text-danger',
    },
    {
      isActive: true,
      color: 'primary',
      tone: 'dark',
      class: 'text-primary-300',
    },
    {
      isActive: true,
      color: 'secondary',
      tone: 'dark',
      class: 'text-secondary-300',
    },
    {
      isActive: true,
      color: 'success',
      tone: 'dark',
      class: 'text-success-300',
    },
    {
      isActive: true,
      color: 'warning',
      tone: 'dark',
      class: 'text-warning-300',
    },
    {
      isActive: true,
      color: 'danger',
      tone: 'dark',
      class: 'text-danger-300',
    },
  ],
  defaultVariants: {
    isActive: false,
    isDisabled: false,
    color: 'default',
    tone: 'default',
  },
});

export type TabbarVariants = VariantProps<typeof tabbar>;
export type TabbarClasses = VariantClasses<typeof tabbar>;
export type TabbarClassNames = TabbarClasses;
export type TabbarReactClassNames = TabbarClassNames;
export type TabbarMiniClassNames = TabbarClassNames;
