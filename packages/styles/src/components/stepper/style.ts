import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const stepperStyle = tv({
  slots: {
    base: '',
    decrementButton:
      'h-full min-w-0 shrink-0 rounded-none px-0 font-semibold leading-none',
    incrementButton:
      'h-full min-w-0 shrink-0 rounded-none px-0 font-semibold leading-none',
    valueWrap: 'flex min-w-0 flex-1 items-center px-2',
    input:
      'block w-full border-none bg-transparent text-center text-inherit outline-none tabular-nums placeholder:text-slate-400',
  },
  variants: {
    variant: {
      default: {},
      outline: {},
      twotone: {},
      underline: {},
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    size: {
      sm: {
        decrementButton: 'w-7 text-sm',
        incrementButton: 'w-7 text-sm',
        input: 'text-sm',
      },
      md: {
        decrementButton: 'w-8 text-base',
        incrementButton: 'w-8 text-base',
        input: 'text-base',
      },
      lg: {
        decrementButton: 'w-9 text-lg',
        incrementButton: 'w-9 text-lg',
        input: 'text-lg',
      },
    },
    radius: {
      none: {},
      sm: {},
      md: {},
      lg: {},
      full: {},
    },
    isDisabled: {
      true: {
        decrementButton: 'pointer-events-none',
        incrementButton: 'pointer-events-none',
        input: 'cursor-not-allowed',
      },
      false: {},
    },
    isReadOnly: {
      true: {
        decrementButton: 'pointer-events-none',
        incrementButton: 'pointer-events-none',
        input: 'cursor-default',
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'default',
    color: 'default',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    isReadOnly: false,
  },
});

export type StepperVariants = VariantProps<typeof stepperStyle>;
export type StepperClasses = VariantClasses<typeof stepperStyle>;
export type StepperClassNames = StepperClasses;
export type StepperReactClassNames = StepperClassNames;
export type StepperMiniClassNames = StepperClassNames;
