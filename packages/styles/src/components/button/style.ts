import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

const semanticToneVariants = [
  {
    color: 'primary',
    tone: 'light',
    variant: 'solid',
    class: { base: 'bg-primary text-white active:bg-primary-600' },
  },
  {
    color: 'primary',
    tone: 'dark',
    variant: 'solid',
    class: { base: 'bg-primary-600 text-white active:bg-primary-700' },
  },
  {
    color: 'primary',
    tone: 'light',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-primary-500 active:text-primary-600' },
  },
  {
    color: 'primary',
    tone: 'dark',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-primary-100 active:text-primary-200' },
  },
  {
    color: 'primary',
    tone: 'dark',
    variant: 'outline',
    class: { base: 'border-primary-700' },
  },
  {
    color: 'primary',
    tone: 'light',
    variant: 'flat',
    class: { base: 'bg-primary-100 active:bg-primary-200' },
  },
  {
    color: 'primary',
    tone: 'dark',
    variant: 'flat',
    class: { base: 'bg-primary-950 active:bg-primary-900' },
  },
  {
    color: 'secondary',
    tone: 'light',
    variant: 'solid',
    class: { base: 'bg-secondary text-white active:bg-secondary-600' },
  },
  {
    color: 'secondary',
    tone: 'dark',
    variant: 'solid',
    class: { base: 'bg-secondary-600 text-white active:bg-secondary-700' },
  },
  {
    color: 'secondary',
    tone: 'light',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-secondary-500 active:text-secondary-600' },
  },
  {
    color: 'secondary',
    tone: 'dark',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-secondary-100 active:text-secondary-200' },
  },
  {
    color: 'secondary',
    tone: 'dark',
    variant: 'outline',
    class: { base: 'border-secondary-700' },
  },
  {
    color: 'secondary',
    tone: 'light',
    variant: 'flat',
    class: { base: 'bg-secondary-100 active:bg-secondary-200' },
  },
  {
    color: 'secondary',
    tone: 'dark',
    variant: 'flat',
    class: { base: 'bg-secondary-950 active:bg-secondary-900' },
  },
  {
    color: 'success',
    tone: 'light',
    variant: 'solid',
    class: { base: 'bg-success text-white active:bg-success-600' },
  },
  {
    color: 'success',
    tone: 'dark',
    variant: 'solid',
    class: { base: 'bg-success-600 text-white active:bg-success-700' },
  },
  {
    color: 'success',
    tone: 'light',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-success-500 active:text-success-600' },
  },
  {
    color: 'success',
    tone: 'dark',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-success-100 active:text-success-200' },
  },
  {
    color: 'success',
    tone: 'dark',
    variant: 'outline',
    class: { base: 'border-success-700' },
  },
  {
    color: 'success',
    tone: 'light',
    variant: 'flat',
    class: { base: 'bg-success-100 active:bg-success-200' },
  },
  {
    color: 'success',
    tone: 'dark',
    variant: 'flat',
    class: { base: 'bg-success-950 active:bg-success-900' },
  },
  {
    color: 'warning',
    tone: 'light',
    variant: 'solid',
    class: { base: 'bg-warning text-white active:bg-warning-600' },
  },
  {
    color: 'warning',
    tone: 'dark',
    variant: 'solid',
    class: { base: 'bg-warning-600 text-black active:bg-warning-700' },
  },
  {
    color: 'warning',
    tone: 'light',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-warning-500 active:text-warning-600' },
  },
  {
    color: 'warning',
    tone: 'dark',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-warning-100 active:text-warning-200' },
  },
  {
    color: 'warning',
    tone: 'dark',
    variant: 'outline',
    class: { base: 'border-warning-700' },
  },
  {
    color: 'warning',
    tone: 'light',
    variant: 'flat',
    class: { base: 'bg-warning-100 active:bg-warning-200' },
  },
  {
    color: 'warning',
    tone: 'dark',
    variant: 'flat',
    class: { base: 'bg-warning-950 active:bg-warning-900' },
  },
  {
    color: 'danger',
    tone: 'light',
    variant: 'solid',
    class: { base: 'bg-danger text-white active:bg-danger-600' },
  },
  {
    color: 'danger',
    tone: 'dark',
    variant: 'solid',
    class: { base: 'bg-danger-600 text-white active:bg-danger-700' },
  },
  {
    color: 'danger',
    tone: 'light',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-danger-500 active:text-danger-600' },
  },
  {
    color: 'danger',
    tone: 'dark',
    variant: ['outline', 'flat', 'text'],
    class: { base: 'text-danger-100 active:text-danger-200' },
  },
  {
    color: 'danger',
    tone: 'dark',
    variant: 'outline',
    class: { base: 'border-danger-700' },
  },
  {
    color: 'danger',
    tone: 'light',
    variant: 'flat',
    class: { base: 'bg-danger-100 active:bg-danger-200' },
  },
  {
    color: 'danger',
    tone: 'dark',
    variant: 'flat',
    class: { base: 'bg-danger-950 active:bg-danger-900' },
  },
] as const;

export const button = tv({
  slots: {
    base: [
      'relative inline-flex items-center justify-center align-middle',
      'gap-2 mx-0 box-border',
      'transition-all duration-200 ease-out',
      'border-2 border-solid border-transparent',
      'font-semibold',
      'outline-none',
      'after:border-none after:content-none',
    ],
    _iLoading: 'icon-spinner',
  },
  variants: {
    color: {
      default: {
        base: 'border-slate-200',
      },
      primary: {
        base: 'border-primary',
      },
      secondary: {
        base: 'border-secondary',
      },
      success: {
        base: 'border-success',
      },
      warning: {
        base: 'border-warning',
      },
      danger: {
        base: 'border-danger',
      },
    },
    tone: {
      light: { base: '' },
      dark: { base: '' },
    },
    variant: {
      solid: { base: 'border-transparent' },
      outline: { base: 'bg-transparent border-2' },
      flat: { base: 'border-none' },
      text: { base: 'bg-transparent border-none' },
    },
    size: {
      sm: { base: 'h-8 px-3 text-sm' },
      md: { base: 'h-10 px-4 text-base' },
      lg: { base: 'h-12 px-6 text-lg' },
    },
    radius: {
      none: { base: 'rounded-none' },
      sm: { base: 'rounded-lg' },
      md: { base: 'rounded-xl' },
      lg: { base: 'rounded-2xl' },
      full: { base: 'rounded-full' },
    },
    isBlock: {
      true: { base: 'w-full' },
    },
    isIcon: {
      true: { base: 'px-0' },
      false: { base: '' },
    },
    isLoading: {
      true: { base: 'cursor-not-allowed' },
      false: { base: '' },
      auto: { base: '' },
    },
    isDisabled: {
      true: {
        base: 'opacity-60 cursor-not-allowed',
      },
      false: { base: '' },
    },
    isInGroup: {
      true: { base: '' },
      false: { base: '' },
    },
    groupIsBlock: {
      true: { base: 'flex-1' },
    },
    groupPosition: {
      first: { base: '' },
      middle: { base: '' },
      last: { base: '' },
      none: {},
    },
    groupOrientation: {
      x: { base: '' },
      y: { base: '' },
    },
  },
  compoundVariants: [
    {
      isDisabled: false,
      isLoading: false,
      class: { base: 'active:scale-95' },
    },
    {
      isDisabled: false,
      isLoading: 'auto',
      class: { base: 'active:scale-95' },
    },
    {
      variant: 'outline',
      isDisabled: false,
      class: { base: 'active:bg-transparent' },
    },
    {
      variant: 'flat',
      isDisabled: false,
      class: { base: 'active:border-none' },
    },
    {
      variant: 'text',
      isDisabled: false,
      class: { base: 'active:bg-transparent active:border-none' },
    },
    {
      color: 'default',
      tone: 'light',
      variant: 'solid',
      class: { base: 'bg-slate-200 text-black active:bg-slate-300' },
    },
    {
      color: 'default',
      tone: 'dark',
      variant: 'solid',
      class: { base: 'bg-zinc-950 text-white active:bg-zinc-900' },
    },
    {
      color: 'default',
      tone: 'light',
      variant: ['outline', 'flat', 'text'],
      class: { base: 'text-slate-900 active:text-slate-950' },
    },
    {
      color: 'default',
      tone: 'dark',
      variant: ['outline', 'flat', 'text'],
      class: { base: 'text-white active:text-zinc-200' },
    },
    {
      color: 'default',
      tone: 'dark',
      variant: 'outline',
      class: { base: 'border-zinc-600' },
    },
    {
      color: 'default',
      tone: 'light',
      variant: 'flat',
      class: { base: 'bg-slate-100 active:bg-slate-200' },
    },
    {
      color: 'default',
      tone: 'dark',
      variant: 'flat',
      class: { base: 'bg-zinc-700 active:bg-zinc-600' },
    },
    ...semanticToneVariants,
    {
      isIcon: true,
      size: 'sm',
      class: { base: 'min-w-8 w-8 h-8' },
    },
    {
      isIcon: true,
      size: 'md',
      class: { base: 'min-w-10 w-10 h-10' },
    },
    {
      isIcon: true,
      size: 'lg',
      class: { base: 'min-w-12 w-12 h-12' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'first',
      class: { base: 'border-r-0' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'middle',
      class: { base: 'border-x-0' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'last',
      class: { base: 'border-l-0' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'first',
      class: { base: 'border-b-0' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'middle',
      class: { base: 'border-y-0' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'last',
      class: { base: 'border-t-0' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'first',
      size: 'sm',
      class: { base: 'rounded-l-lg rounded-r-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'first',
      size: 'md',
      class: { base: 'rounded-l-xl rounded-r-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'first',
      size: 'lg',
      class: { base: 'rounded-l-2xl rounded-r-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'first',
      size: 'sm',
      class: { base: 'rounded-t-lg rounded-b-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'first',
      size: 'md',
      class: { base: 'rounded-t-xl rounded-b-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'first',
      size: 'lg',
      class: { base: 'rounded-t-2xl rounded-b-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'last',
      size: 'sm',
      class: { base: 'rounded-r-lg rounded-l-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'last',
      size: 'md',
      class: { base: 'rounded-r-xl rounded-l-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'last',
      size: 'lg',
      class: { base: 'rounded-r-2xl rounded-l-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'last',
      size: 'sm',
      class: { base: 'rounded-b-lg rounded-t-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'last',
      size: 'md',
      class: { base: 'rounded-b-xl rounded-t-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'last',
      size: 'lg',
      class: { base: 'rounded-b-2xl rounded-t-none' },
    },
    {
      groupPosition: 'middle',
      class: { base: 'rounded-none' },
    },
    {
      groupPosition: ['first', 'last', 'middle'],
      radius: 'none',
      class: { base: 'rounded-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'first',
      radius: 'full',
      class: { base: 'rounded-l-full rounded-r-none' },
    },
    {
      groupOrientation: 'x',
      groupPosition: 'last',
      radius: 'full',
      class: { base: 'rounded-r-full rounded-l-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'first',
      radius: 'full',
      class: { base: 'rounded-t-full rounded-b-none' },
    },
    {
      groupOrientation: 'y',
      groupPosition: 'last',
      radius: 'full',
      class: { base: 'rounded-b-full rounded-t-none' },
    },
  ],
  defaultVariants: {
    color: 'default',
    tone: 'light',
    variant: 'solid',
    size: 'md',
    radius: 'md',
    isBlock: false,
    groupOrientation: 'x',
  },
});

export const buttonGroup = tv({
  base: 'inline-flex h-auto justify-center',
  variants: {
    isBlock: {
      true: 'w-full',
    },
    orientation: {
      x: 'flex-row items-center',
      y: 'flex-col items-stretch',
    },
  },
  defaultVariants: {
    orientation: 'x',
  },
});

export type ButtonVariants = VariantProps<typeof button>;
type ButtonInternalClasses = VariantClasses<typeof button>;
export type ButtonClasses = Omit<ButtonInternalClasses, '_iLoading'>;
export type ButtonGroupVariants = VariantProps<typeof buttonGroup>;
