import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const inputStyle = tv({
  slots: {
    control: '',
    input:
      'block w-full min-w-0 appearance-none border-none bg-transparent text-inherit outline-none placeholder:text-slate-400',
  },
  variants: {
    tone: {
      default: {},
      dark: {
        input: 'text-zinc-100 placeholder:text-zinc-500',
      },
    },
    size: {
      sm: {
        input: 'leading-5',
      },
      md: {
        input: 'leading-6',
      },
      lg: {
        input: 'leading-7',
      },
    },
    isDisabled: {
      true: {
        input: 'cursor-not-allowed',
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: 'default',
    size: 'md',
    isDisabled: false,
  },
});

export type InputVariants = VariantProps<typeof inputStyle>;
export type InputClasses = VariantClasses<typeof inputStyle>;
export type InputClassNames = InputClasses;
