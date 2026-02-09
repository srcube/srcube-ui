import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const checkbox = tv({
  slots: {
    base: 'relative inline-flex items-center gap-2 select-none',
    checkbox: [
      'relative flex shrink-0 items-center justify-center',
      'before:absolute before:inset-0 before:border-2 before:border-slate-300',
      'after:absolute after:inset-0 after:transition after:duration-200 after:opacity-0 after:scale-50',
    ],
    spinner: 'icon-spinner z-10 text-current',
    content: 'relative text-sm',
    iconWrapper:
      'relative z-10 flex items-center justify-center transition duration-200 opacity-0 scale-50 pointer-events-none',
    iDefault: 'icon-check w-[inherit] h-[inherit]',
    iIndeterminate: 'icon-indeterminate w-[inherit] h-[inherit]',
    nCheckbox: 'absolute inset-0 opacity-0 pointer-events-none',
  },
  variants: {
    color: {
      default: {
        checkbox: 'after:bg-slate-300',
        iconWrapper: 'text-slate-700',
      },
      primary: {
        checkbox: 'after:bg-primary',
      },
      secondary: {
        checkbox: 'after:bg-secondary',
      },
      success: {
        checkbox: 'after:bg-success',
      },
      warning: {
        checkbox: 'after:bg-warning',
      },
      danger: {
        checkbox: 'after:bg-danger',
      },
    },
    size: {
      sm: {
        checkbox: 'size-4',
        iconWrapper: 'size-2',
        content: 'text-sm',
      },
      md: {
        checkbox: 'size-5',
        iconWrapper: 'size-2.5',
        content: 'text-base',
      },
      lg: {
        checkbox: 'size-6',
        iconWrapper: 'size-3',
        content: 'text-lg',
      },
    },
    radius: {
      none: {
        checkbox: 'before:rounded-none after:rounded-none',
      },
      sm: {
        checkbox: 'before:rounded-md after:rounded-md',
      },
      md: {
        checkbox: 'before:rounded-lg after:rounded-lg',
      },
      lg: {
        checkbox: 'before:rounded-xl after:rounded-xl',
      },
      full: {
        checkbox: 'before:rounded-full after:rounded-full',
      },
    },
    isSelected: {
      true: {
        iconWrapper: 'opacity-100 scale-100 pointer-events-auto',
        checkbox: 'after:opacity-100 after:scale-100',
      },
      false: {},
    },
    isIndeterminate: {
      true: {
        iconWrapper: 'opacity-100 scale-100 pointer-events-auto',
        checkbox: 'after:opacity-100 after:scale-100',
      },
      false: {},
    },
    isReadOnly: {
      true: {
        base: 'cursor-default',
      },
      false: {
        base: 'cursor-pointer',
      },
    },
    isDisabled: {
      true: {
        base: 'opacity-60 cursor-not-allowed',
      },
      false: {
        base: '',
      },
    },
    isLoading: {
      true: {
        base: 'cursor-wait',
      },
      false: {
        base: '',
      },
      auto: {
        base: '',
      },
    },
    isLineThrough: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      color: ['primary', 'secondary', 'success', 'warning', 'danger'],
      class: {
        iconWrapper: 'text-white',
        spinner: 'text-white',
      },
    },
    {
      isLoading: true,
      class: { spinner: 'opacity-80' },
    },
    {
      isLineThrough: true,
      isSelected: true,
      class: {
        content: [
          'before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300',
          'text-black/75',
        ],
      },
    },
    {
      isLineThrough: true,
      isIndeterminate: true,
      class: {
        content: [
          'before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300',
          'text-black/75',
        ],
      },
    },
  ],
  defaultVariants: {
    color: 'default',
    size: 'md',
    radius: 'md',
    isSelected: false,
    isIndeterminate: false,
    isDisabled: false,
    isReadOnly: false,
    isLoading: false,
    isLineThrough: false,
  },
});

export const checkboxGroup = tv({
  base: 'flex gap-2',
  variants: {
    orientation: {
      y: 'flex-col',
      x: 'flex-row gap-4',
    },
    isBlock: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    orientation: 'y',
    isBlock: false,
  },
});

export type CheckboxVariants = VariantProps<typeof checkbox>;
export type CheckboxClasses = VariantClasses<typeof checkbox>;
export type CheckboxGroupVariants = VariantProps<typeof checkboxGroup>;
