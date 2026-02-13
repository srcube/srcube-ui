import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const fieldStyle = tv({
  slots: {
    base: 'relative flex w-full min-w-0 outline-none',
    outsideWrapper: 'w-full min-w-0',
    controlWrapper:
      'inline-flex w-full min-w-0 items-center transition-colors duration-200',
    label: 'shrink-0 text-slate-900',
    requiredMark: 'ml-0.5 text-danger',
    control: 'flex w-full min-w-0 items-center',
    input: 'flex min-w-0 flex-1 items-center truncate',
    helperWrapper: 'mt-1 w-full',
    description: 'w-full text-slate-500',
    errorMessage: 'w-full text-danger',
    startContent: 'flex shrink-0 items-center justify-center',
    endContent: 'flex shrink-0 items-center justify-center',
    clearButton:
      'flex shrink-0 items-center justify-center leading-none opacity-70 transition-opacity duration-150 active:opacity-100',
    _iClear: 'icon-clear size-[1em]',
  },
  variants: {
    variant: {
      default: {
        controlWrapper: 'bg-slate-50',
      },
      outline: {
        controlWrapper: 'border-2 bg-transparent',
      },
      twotone: {
        controlWrapper: 'border-2',
      },
      underline: {
        controlWrapper: 'rounded-none border-b-2 bg-transparent',
      },
    },
    color: {
      default: {
        controlWrapper: 'bg-slate-50 text-slate-900',
      },
      primary: {
        controlWrapper: 'bg-primary/10 text-primary',
      },
      secondary: {
        controlWrapper: 'bg-secondary/10 text-secondary',
      },
      success: {
        controlWrapper: 'bg-success/10 text-success',
      },
      warning: {
        controlWrapper: 'bg-warning/10 text-warning',
      },
      danger: {
        controlWrapper: 'bg-danger/10 text-danger',
      },
    },
    size: {
      sm: {
        base: 'gap-1.5',
        controlWrapper: 'px-3',
        control: 'h-9 gap-2',
        label: 'text-sm',
        requiredMark: 'text-xs',
        input: 'text-sm',
        helperWrapper: 'text-xs',
        startContent: 'text-sm',
        endContent: 'text-sm',
        clearButton: 'text-sm',
      },
      md: {
        base: 'gap-2',
        controlWrapper: 'px-4',
        control: 'h-10 gap-2',
        label: 'text-base',
        requiredMark: 'text-sm',
        input: 'text-base',
        helperWrapper: 'text-sm',
        startContent: 'text-base',
        endContent: 'text-base',
        clearButton: 'text-base',
      },
      lg: {
        base: 'gap-2',
        controlWrapper: 'px-5',
        control: 'h-12 gap-3',
        label: 'text-lg',
        requiredMark: 'text-base',
        input: 'text-lg',
        helperWrapper: 'text-base',
        startContent: 'text-lg',
        endContent: 'text-lg',
        clearButton: 'text-lg',
      },
    },
    radius: {
      none: {
        controlWrapper: 'rounded-none',
      },
      sm: {
        controlWrapper: 'rounded-lg',
      },
      md: {
        controlWrapper: 'rounded-xl',
      },
      lg: {
        controlWrapper: 'rounded-2xl',
      },
      full: {
        controlWrapper: 'rounded-full',
      },
    },
    labelPlacement: {
      outside: {
        base: 'flex-col',
        outsideWrapper: 'flex flex-col',
      },
      'outside-left': {
        base: 'flex-row items-center',
        outsideWrapper: 'flex flex-col',
      },
      inside: {
        base: 'flex-col',
        outsideWrapper: 'flex flex-col',
        controlWrapper: 'gap-3',
      },
    },
    isDisabled: {
      true: {
        base: 'cursor-not-allowed',
        label: 'opacity-50',
        controlWrapper:
          'relative cursor-not-allowed overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-slate-900/5 before:content-[""]',
        clearButton: 'invisible',
      },
      false: {},
    },
    isReadOnly: {
      true: {
        controlWrapper: 'cursor-default',
      },
      false: {},
    },
    isInvalid: {
      true: {
        controlWrapper: 'border-2 border-danger ring-0',
      },
      false: {},
    },
    isLoading: {
      true: {
        base: 'cursor-wait',
      },
      false: {},
    },
    isClearable: {
      true: {
        clearButton: '',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: 'underline',
      class: {
        controlWrapper: 'rounded-none',
      },
    },
    {
      variant: ['outline', 'underline'],
      color: [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
      ],
      class: {
        controlWrapper: 'bg-transparent',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'default',
      class: {
        controlWrapper: 'border-slate-300',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'primary',
      class: {
        controlWrapper: 'border-primary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'secondary',
      class: {
        controlWrapper: 'border-secondary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'success',
      class: {
        controlWrapper: 'border-success',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'warning',
      class: {
        controlWrapper: 'border-warning',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'danger',
      class: {
        controlWrapper: 'border-danger',
      },
    },
    {
      isDisabled: true,
      color: 'default',
      class: {
        controlWrapper: 'text-slate-900/40',
      },
    },
    {
      isDisabled: true,
      color: 'primary',
      class: {
        controlWrapper: 'text-primary/40',
      },
    },
    {
      isDisabled: true,
      color: 'secondary',
      class: {
        controlWrapper: 'text-secondary/40',
      },
    },
    {
      isDisabled: true,
      color: 'success',
      class: {
        controlWrapper: 'text-success/40',
      },
    },
    {
      isDisabled: true,
      color: 'warning',
      class: {
        controlWrapper: 'text-warning/40',
      },
    },
    {
      isDisabled: true,
      color: 'danger',
      class: {
        controlWrapper: 'text-danger/40',
      },
    },
    {
      isInvalid: true,
      variant: 'underline',
      class: {
        controlWrapper: 'border-x-0 border-t-0 border-b-2 border-danger ring-0',
      },
    },
  ],
  defaultVariants: {
    color: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
    labelPlacement: 'outside',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isLoading: false,
    isClearable: false,
  },
});

export type FieldVariants = VariantProps<typeof fieldStyle>;
export type FieldClasses = VariantClasses<typeof fieldStyle>;
export type FieldClassNames = FieldClasses;
