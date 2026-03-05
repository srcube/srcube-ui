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
      default: {
        addButton: 'border-slate-300 text-slate-500',
      },
      primary: {
        addButton: 'border-primary/45 text-primary',
      },
      secondary: {
        addButton: 'border-secondary/45 text-secondary',
      },
      success: {
        addButton: 'border-success/45 text-success',
      },
      warning: {
        addButton: 'border-warning/45 text-warning',
      },
      danger: {
        addButton: 'border-danger/45 text-danger',
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
    radius: 'md',
    isDisabled: false,
  },
});

export type UploaderVariants = VariantProps<typeof uploaderStyle>;
export type UploaderClasses = VariantClasses<typeof uploaderStyle>;
export type UploaderClassNames = UploaderClasses;
export type UploaderReactClassNames = UploaderClassNames;
export type UploaderMiniClassNames = UploaderClassNames;
