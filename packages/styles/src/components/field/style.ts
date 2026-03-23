import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

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
    placeholder: 'flex min-w-0 flex-1 items-center truncate opacity-45',
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
    tone: {
      default: {},
      dark: {
        label: 'text-zinc-50',
        description: 'text-zinc-400',
        clearButton: 'text-zinc-400',
        control: 'text-zinc-100',
        input: 'text-zinc-100',
        placeholder: 'text-zinc-500',
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
        placeholder: 'text-sm',
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
        placeholder: 'text-base',
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
        placeholder: 'text-lg',
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
    isMultiline: {
      true: {
        controlWrapper: 'py-2',
        control: 'h-auto min-h-0 items-start',
        input:
          'items-start py-0.5 overflow-visible whitespace-normal text-clip',
        placeholder:
          'items-start py-0.5 overflow-visible whitespace-normal text-clip',
        startContent: 'self-start h-[1.5em]',
        endContent: 'self-start h-[1.5em]',
        clearButton: 'self-start h-[1.5em]',
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
      labelPlacement: 'outside-left',
      isMultiline: true,
      class: {
        base: 'items-start',
        label: 'pt-2',
      },
    },
    {
      labelPlacement: 'inside',
      isMultiline: true,
      class: {
        controlWrapper: 'items-start gap-2',
        label: 'self-start pt-[0.625rem]',
      },
    },
    {
      tone: 'dark',
      color: 'default',
      class: {
        controlWrapper: 'bg-zinc-950 text-zinc-100',
      },
    },
    {
      tone: 'dark',
      color: 'primary',
      class: {
        controlWrapper: 'bg-primary-950 text-primary-100',
      },
    },
    {
      tone: 'dark',
      color: 'secondary',
      class: {
        controlWrapper: 'bg-secondary-950 text-secondary-100',
      },
    },
    {
      tone: 'dark',
      color: 'success',
      class: {
        controlWrapper: 'bg-success-950 text-success-100',
      },
    },
    {
      tone: 'dark',
      color: 'warning',
      class: {
        controlWrapper: 'bg-warning-950 text-warning-100',
      },
    },
    {
      tone: 'dark',
      color: 'danger',
      class: {
        controlWrapper: 'bg-danger-950 text-danger-100',
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
      tone: 'default',
      class: {
        controlWrapper: 'border-slate-300',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'primary',
      tone: 'default',
      class: {
        controlWrapper: 'border-primary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'secondary',
      tone: 'default',
      class: {
        controlWrapper: 'border-secondary',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'success',
      tone: 'default',
      class: {
        controlWrapper: 'border-success',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'warning',
      tone: 'default',
      class: {
        controlWrapper: 'border-warning',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'danger',
      tone: 'default',
      class: {
        controlWrapper: 'border-danger',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'default',
      tone: 'dark',
      class: {
        controlWrapper: 'border-zinc-800',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'primary',
      tone: 'dark',
      class: {
        controlWrapper: 'border-primary-900',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'secondary',
      tone: 'dark',
      class: {
        controlWrapper: 'border-secondary-900',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'success',
      tone: 'dark',
      class: {
        controlWrapper: 'border-success-900',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'warning',
      tone: 'dark',
      class: {
        controlWrapper: 'border-warning-900',
      },
    },
    {
      variant: ['outline', 'twotone', 'underline'],
      color: 'danger',
      tone: 'dark',
      class: {
        controlWrapper: 'border-danger-900',
      },
    },
    {
      isDisabled: true,
      color: 'default',
      tone: 'default',
      class: {
        controlWrapper: 'text-slate-900/40',
      },
    },
    {
      isDisabled: true,
      color: 'primary',
      tone: 'default',
      class: {
        controlWrapper: 'text-primary/40',
      },
    },
    {
      isDisabled: true,
      color: 'secondary',
      tone: 'default',
      class: {
        controlWrapper: 'text-secondary/40',
      },
    },
    {
      isDisabled: true,
      color: 'success',
      tone: 'default',
      class: {
        controlWrapper: 'text-success/40',
      },
    },
    {
      isDisabled: true,
      color: 'warning',
      tone: 'default',
      class: {
        controlWrapper: 'text-warning/40',
      },
    },
    {
      isDisabled: true,
      color: 'danger',
      tone: 'default',
      class: {
        controlWrapper: 'text-danger/40',
      },
    },
    {
      isDisabled: true,
      color: 'default',
      tone: 'dark',
      class: {
        controlWrapper: 'text-zinc-100/40',
      },
    },
    {
      isDisabled: true,
      color: 'primary',
      tone: 'dark',
      class: {
        controlWrapper: 'text-primary-100/40',
      },
    },
    {
      isDisabled: true,
      color: 'secondary',
      tone: 'dark',
      class: {
        controlWrapper: 'text-secondary-100/40',
      },
    },
    {
      isDisabled: true,
      color: 'success',
      tone: 'dark',
      class: {
        controlWrapper: 'text-success-100/40',
      },
    },
    {
      isDisabled: true,
      color: 'warning',
      tone: 'dark',
      class: {
        controlWrapper: 'text-warning-100/40',
      },
    },
    {
      isDisabled: true,
      color: 'danger',
      tone: 'dark',
      class: {
        controlWrapper: 'text-danger-100/40',
      },
    },
    {
      tone: 'dark',
      isDisabled: true,
      class: {
        controlWrapper: 'before:bg-zinc-50/6',
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
    tone: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
    labelPlacement: 'outside',
    isDisabled: false,
    isReadOnly: false,
    isInvalid: false,
    isLoading: false,
    isMultiline: false,
    isClearable: false,
  },
});

export type FieldVariants = VariantProps<typeof fieldStyle>;
export type FieldClasses = VariantClasses<typeof fieldStyle>;
export type FieldClassNames = FieldClasses;
