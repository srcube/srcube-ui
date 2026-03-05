import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const radio = tv({
  slots: {
    base: 'relative inline-flex items-center gap-2 select-none',
    radio: [
      'relative flex shrink-0 items-center justify-center',
      'before:absolute before:inset-0 before:rounded-full before:border-2 before:border-slate-300',
    ],
    _iLoading: 'icon-spinner z-10 text-current rounded-full',
    content: 'relative text-sm',
    iconWrapper:
      'relative z-10 flex items-center justify-center transition duration-200',
    iDefault: 'icon-circle-solid',
    nRadio: 'absolute inset-0 opacity-0 pointer-events-none',
  },
  variants: {
    color: {
      default: {
        iconWrapper: 'text-slate-700',
      },
      primary: {
        iconWrapper: 'text-primary',
      },
      secondary: {
        iconWrapper: 'text-secondary',
      },
      success: {
        iconWrapper: 'text-success',
      },
      warning: {
        iconWrapper: 'text-warning',
      },
      danger: {
        iconWrapper: 'text-danger',
      },
    },
    size: {
      sm: {
        radio: 'size-4',
        iconWrapper: 'size-2',
        iDefault: 'size-2',
        _iLoading: 'size-2',
        content: 'text-sm',
      },
      md: {
        radio: 'size-5',
        iconWrapper: 'size-2.5',
        iDefault: 'size-2.5',
        _iLoading: 'size-2.5',
        content: 'text-base',
      },
      lg: {
        radio: 'size-6',
        iconWrapper: 'size-3',
        iDefault: 'size-3',
        _iLoading: 'size-3',
        content: 'text-lg',
      },
    },
    isSelected: {
      true: {
        iconWrapper: 'opacity-100 scale-100',
      },
      false: {
        iconWrapper: 'opacity-0 scale-50 pointer-events-none',
      },
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
        iconWrapper: 'opacity-100 scale-100',
      },
      false: {
        base: '',
      },
      auto: {
        base: '',
      },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      isSelected: true,
      class: { radio: 'before:border-primary-200' },
    },
    {
      color: 'secondary',
      isSelected: true,
      class: { radio: 'before:border-secondary-200' },
    },
    {
      color: 'success',
      isSelected: true,
      class: { radio: 'before:border-success-200' },
    },
    {
      color: 'warning',
      isSelected: true,
      class: { radio: 'before:border-warning-200' },
    },
    {
      color: 'danger',
      isSelected: true,
      class: { radio: 'before:border-danger-200' },
    },
    {
      isLoading: true,
      class: { _iLoading: 'opacity-80 text-black' },
    },
  ],
  defaultVariants: {
    color: 'default',
    size: 'md',
    isSelected: false,
    isDisabled: false,
    isReadOnly: false,
    isLoading: false,
  },
});

export const radioGroup = tv({
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

export type RadioVariants = VariantProps<typeof radio>;
export type RadioClasses = VariantClasses<typeof radio>;
export type RadioGroupVariants = VariantProps<typeof radioGroup>;
