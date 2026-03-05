import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const inputOtpStyle = tv({
  slots: {
    base: 'relative inline-flex w-fit min-w-0 items-center gap-1 select-none outline-none',
    hiddenInput:
      'absolute left-0 top-0 h-full w-0 opacity-0 pointer-events-none',
    box: 'flex items-center justify-center font-medium transition-colors duration-200',
    cursor: 'h-[60%] w-0.5 rounded-sm animate-blink-caret',
    dot: 'rounded-full bg-current',
  },
  variants: {
    variant: {
      default: {},
      outline: {
        box: 'border-2',
      },
      twotone: {
        box: 'border-2',
      },
      underline: {
        box: 'border-b-2 rounded-none',
      },
    },
    color: {
      default: {
        box: 'bg-slate-50 text-slate-700',
        cursor: 'bg-slate-500',
      },
      primary: {
        box: 'bg-primary/10 text-primary',
        cursor: 'bg-primary',
      },
      secondary: {
        box: 'bg-secondary/10 text-secondary',
        cursor: 'bg-secondary',
      },
      success: {
        box: 'bg-success/10 text-success',
        cursor: 'bg-success',
      },
      warning: {
        box: 'bg-warning/10 text-warning',
        cursor: 'bg-warning',
      },
      danger: {
        box: 'bg-danger/10 text-danger',
        cursor: 'bg-danger',
      },
    },
    size: {
      xs: {
        box: 'h-6 w-6 text-xs',
        dot: 'size-1',
      },
      sm: {
        box: 'h-8 w-8 text-sm',
        dot: 'size-1.5',
      },
      md: {
        box: 'h-10 w-10 text-base',
        dot: 'size-2',
      },
      lg: {
        box: 'h-12 w-12 text-lg',
        dot: 'size-3',
      },
    },
    radius: {
      none: {
        box: 'rounded-none',
      },
      sm: {
        box: 'rounded-md',
      },
      md: {
        box: 'rounded-lg',
      },
      lg: {
        box: 'rounded-xl',
      },
      full: {
        box: 'rounded-full',
      },
    },
    isDisabled: {
      true: {
        base: 'opacity-60',
        box: 'cursor-not-allowed',
      },
      false: {},
    },
    isReadOnly: {
      true: {
        box: 'cursor-not-allowed',
      },
      false: {},
    },
    isPassword: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'underline',
      class: {
        box: 'rounded-none',
      },
    },
    {
      variant: ['outline', 'underline'],
      class: {
        box: 'bg-transparent',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'default',
      class: {
        box: 'border-slate-300',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'primary',
      class: {
        box: 'border-primary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'secondary',
      class: {
        box: 'border-secondary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'success',
      class: {
        box: 'border-success',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'warning',
      class: {
        box: 'border-warning',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'danger',
      class: {
        box: 'border-danger',
      },
    },
    {
      isDisabled: true,
      color: 'default',
      class: {
        box: 'text-slate-500',
      },
    },
    {
      isDisabled: true,
      color: 'primary',
      class: {
        box: 'text-primary/60',
      },
    },
    {
      isDisabled: true,
      color: 'secondary',
      class: {
        box: 'text-secondary/60',
      },
    },
    {
      isDisabled: true,
      color: 'success',
      class: {
        box: 'text-success/60',
      },
    },
    {
      isDisabled: true,
      color: 'warning',
      class: {
        box: 'text-warning/60',
      },
    },
    {
      isDisabled: true,
      color: 'danger',
      class: {
        box: 'text-danger/60',
      },
    },
  ],
  defaultVariants: {
    color: 'default',
    variant: 'default',
    size: 'md',
    radius: 'lg',
    isDisabled: false,
    isReadOnly: false,
    isPassword: false,
  },
});

export type InputOtpVariants = VariantProps<typeof inputOtpStyle>;
export type InputOtpClasses = VariantClasses<typeof inputOtpStyle>;
export type InputOtpClassNames = InputOtpClasses;
