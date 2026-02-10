import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const switchStyle = tv({
  slots: {
    base: 'relative inline-flex items-center gap-2 select-none',
    track:
      'relative inline-flex shrink-0 items-center rounded-full bg-slate-300 transition-colors duration-200',
    thumb: [
      'absolute left-0.5 top-1/2 flex items-center justify-center rounded-full bg-white shadow-sm',
      '-translate-y-1/2 translate-x-0 transition duration-200',
    ],
    _iThumb: 'text-current',
    _iLoading: 'icon-spinner text-current',
    content: 'text-sm',
    nSwitch: 'absolute inset-0 opacity-0 pointer-events-none',
  },
  variants: {
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
        track: 'h-5 w-9',
        thumb: 'size-4',
        _iThumb: 'size-2',
        _iLoading: 'size-2',
        content: 'text-sm',
      },
      md: {
        track: 'h-6 w-11',
        thumb: 'size-5',
        _iThumb: 'size-2.5',
        _iLoading: 'size-2.5',
        content: 'text-base',
      },
      lg: {
        track: 'h-7 w-12',
        thumb: 'size-6',
        _iThumb: 'size-3',
        _iLoading: 'size-3',
        content: 'text-lg',
      },
    },
    isSelected: {
      true: {},
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
      false: {},
    },
    isLoading: {
      true: {
        base: 'cursor-wait',
      },
      false: {},
      auto: {},
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      class: {
        _iThumb: 'opacity-0',
      },
    },
    {
      isSelected: true,
      size: 'sm',
      class: {
        thumb: 'translate-x-4',
      },
    },
    {
      isSelected: true,
      size: 'md',
      class: {
        thumb: 'translate-x-5',
      },
    },
    {
      isSelected: true,
      size: 'lg',
      class: {
        thumb: 'translate-x-5',
      },
    },
    {
      isSelected: true,
      color: 'default',
      class: {
        track: 'bg-slate-700',
        _iThumb: 'text-slate-700',
        _iLoading: 'text-slate-700',
      },
    },
    {
      isSelected: true,
      color: 'primary',
      class: {
        track: 'bg-primary',
        _iThumb: 'text-primary',
        _iLoading: 'text-primary',
      },
    },
    {
      isSelected: true,
      color: 'secondary',
      class: {
        track: 'bg-secondary',
        _iThumb: 'text-secondary',
        _iLoading: 'text-secondary',
      },
    },
    {
      isSelected: true,
      color: 'success',
      class: {
        track: 'bg-success',
        _iThumb: 'text-success',
        _iLoading: 'text-success',
      },
    },
    {
      isSelected: true,
      color: 'warning',
      class: {
        track: 'bg-warning',
        _iThumb: 'text-warning',
        _iLoading: 'text-warning',
      },
    },
    {
      isSelected: true,
      color: 'danger',
      class: {
        track: 'bg-danger',
        _iThumb: 'text-danger',
        _iLoading: 'text-danger',
      },
    },
    {
      isLoading: true,
      class: {
        _iLoading: 'opacity-80',
      },
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

export type SwitchVariants = VariantProps<typeof switchStyle>;
export type SwitchClasses = VariantClasses<typeof switchStyle>;
export type SwitchClassNames = Omit<SwitchClasses, '_iThumb' | '_iLoading'>;
