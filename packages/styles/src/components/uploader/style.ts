import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const uploaderStyle = tv({
  slots: {
    base: 'w-full',
    list: 'flex flex-wrap gap-3',
    item: 'relative overflow-hidden border border-slate-200 bg-slate-100',
    preview: 'h-full w-full object-cover',
    removeButton:
      'absolute -right-1 -top-1 z-[1] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-white',
    _iRemove: 'icon-close size-2.5',
    addButton:
      'inline-flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 transition-colors duration-150 active:bg-slate-100',
    addIcon: 'text-lg leading-none',
    addText: 'mt-1 text-xs leading-none',
    helperText: 'mt-2 text-xs text-slate-500',
  },
  variants: {
    size: {
      sm: {
        item: 'h-16 w-16',
        addButton: 'h-16 w-16',
      },
      md: {
        item: 'h-20 w-20',
        addButton: 'h-20 w-20',
      },
      lg: {
        item: 'h-24 w-24',
        addButton: 'h-24 w-24',
      },
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    tone: {
      default: {},
      dark: {
        item: 'border-zinc-800 bg-zinc-900',
        addButton:
          'border-zinc-700 bg-zinc-900 text-zinc-300 active:bg-zinc-800',
        helperText: 'text-zinc-400',
      },
    },
    radius: {
      none: {
        item: 'rounded-none',
        addButton: 'rounded-none',
      },
      sm: {
        item: 'rounded-lg',
        addButton: 'rounded-lg',
      },
      md: {
        item: 'rounded-xl',
        addButton: 'rounded-xl',
      },
      lg: {
        item: 'rounded-2xl',
        addButton: 'rounded-2xl',
      },
      full: {
        item: 'rounded-full',
        addButton: 'rounded-full',
      },
    },
    isDisabled: {
      true: {
        base: 'cursor-not-allowed',
        list: 'opacity-60',
        addButton: 'pointer-events-none',
        removeButton: 'pointer-events-none',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
    tone: 'default',
    radius: 'md',
    isDisabled: false,
  },
  compoundVariants: [
    {
      color: 'default',
      tone: 'default',
      class: {
        addButton: 'border-slate-300 text-slate-500',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        addButton: 'border-primary/45 text-primary',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        addButton: 'border-secondary/45 text-secondary',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        addButton: 'border-success/45 text-success',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        addButton: 'border-warning/45 text-warning',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        addButton: 'border-danger/45 text-danger',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        addButton:
          'border-primary-800 bg-primary-950/40 text-primary-200 active:bg-primary-950',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        addButton:
          'border-secondary-800 bg-secondary-950/40 text-secondary-200 active:bg-secondary-950',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        addButton:
          'border-success-800 bg-success-950/40 text-success-200 active:bg-success-950',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        addButton:
          'border-warning-800 bg-warning-950/40 text-warning-200 active:bg-warning-950',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        addButton:
          'border-danger-800 bg-danger-950/40 text-danger-200 active:bg-danger-950',
      },
    },
  ],
});

export type UploaderVariants = VariantProps<typeof uploaderStyle>;
export type UploaderClasses = VariantClasses<typeof uploaderStyle>;
export type UploaderClassNames = UploaderClasses;
export type UploaderReactClassNames = UploaderClassNames;
export type UploaderMiniClassNames = UploaderClassNames;
