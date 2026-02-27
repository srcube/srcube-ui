import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

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
      color: 'default',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-black active:bg-slate-300' },
    },
    {
      color: 'primary',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-white active:bg-primary-600' },
    },
    {
      color: 'secondary',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-white active:bg-secondary-600' },
    },
    {
      color: 'success',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-white active:bg-success-600' },
    },
    {
      color: 'warning',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-white active:bg-warning-600' },
    },
    {
      color: 'danger',
      variant: 'solid',
      isDisabled: false,
      class: { base: 'text-white active:bg-danger-600' },
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
      variant: 'solid',
      color: 'default',
      class: { base: 'bg-slate-200' },
    },
    {
      variant: 'solid',
      color: 'primary',
      class: { base: 'bg-primary' },
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: { base: 'bg-secondary' },
    },
    {
      variant: 'solid',
      color: 'success',
      class: { base: 'bg-success' },
    },
    {
      variant: 'solid',
      color: 'warning',
      class: { base: 'bg-warning' },
    },
    {
      variant: 'solid',
      color: 'danger',
      class: { base: 'bg-danger' },
    },
    {
      variant: ['outline', 'flat', 'text'],
      color: 'primary',
      isDisabled: false,
      class: { base: 'text-primary-500 active:text-primary-600' },
    },
    {
      variant: ['outline', 'flat', 'text'],
      color: 'secondary',
      isDisabled: false,
      class: { base: 'text-secondary-500 active:text-secondary-600' },
    },
    {
      variant: ['outline', 'flat', 'text'],
      color: 'success',
      isDisabled: false,
      class: { base: 'text-success-500 active:text-success-600' },
    },
    {
      variant: ['outline', 'flat', 'text'],
      color: 'warning',
      isDisabled: false,
      class: { base: 'text-warning-500 active:text-warning-600' },
    },
    {
      variant: ['outline', 'flat', 'text'],
      color: 'danger',
      isDisabled: false,
      class: { base: 'text-danger-500 active:text-danger-600' },
    },
    {
      variant: 'flat',
      color: 'default',
      isDisabled: false,
      class: { base: 'bg-slate-100 active:bg-slate-200' },
    },
    {
      variant: 'flat',
      color: 'primary',
      isDisabled: false,
      class: { base: 'bg-primary-100 active:bg-primary-200' },
    },
    {
      variant: 'flat',
      color: 'secondary',
      isDisabled: false,
      class: { base: 'bg-secondary-100 active:bg-secondary-200' },
    },
    {
      variant: 'flat',
      color: 'success',
      isDisabled: false,
      class: { base: 'bg-success-100 active:bg-success-200' },
    },
    {
      variant: 'flat',
      color: 'warning',
      isDisabled: false,
      class: { base: 'bg-warning-100 active:bg-warning-200' },
    },
    {
      variant: 'flat',
      color: 'danger',
      isDisabled: false,
      class: { base: 'bg-danger-100 active:bg-danger-200' },
    },
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
    {
      isDisabled: true,
      color: ['primary', 'secondary', 'success', 'warning', 'danger'],
      variant: 'solid',
      class: { base: 'text-white' },
    },
  ],
  defaultVariants: {
    color: 'primary',
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
export type ButtonClasses = VariantClasses<typeof button>;
export type ButtonGroupVariants = VariantProps<typeof buttonGroup>;
