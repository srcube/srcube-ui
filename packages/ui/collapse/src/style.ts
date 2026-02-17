import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const collapse = tv({
  slots: {
    base: 'overflow-hidden border border-slate-200 bg-white',
    trigger:
      'flex w-full items-center justify-between gap-3 text-left text-slate-900 transition-colors duration-150',
    title: 'min-w-0 flex-1 truncate font-medium',
    icon: 'shrink-0 text-slate-500 transition-transform duration-200',
    panel: 'text-sm text-slate-600',
    content: 'pt-1',
  },
  variants: {
    variant: {
      outline: {
        base: 'bg-white border-slate-200',
      },
      twotone: {
        base: 'bg-slate-50 border-slate-200',
      },
      soft: {
        base: 'bg-slate-100/80 border-transparent',
      },
    },
    size: {
      sm: {
        trigger: 'px-3 py-2 text-sm',
        panel: 'px-3 pb-3',
      },
      md: {
        trigger: 'px-4 py-3 text-sm',
        panel: 'px-4 pb-4',
      },
      lg: {
        trigger: 'px-5 py-4 text-base',
        panel: 'px-5 pb-5',
      },
    },
    radius: {
      none: {
        base: 'rounded-none',
      },
      sm: {
        base: 'rounded-lg',
      },
      md: {
        base: 'rounded-xl',
      },
      lg: {
        base: 'rounded-2xl',
      },
      full: {
        base: 'rounded-full',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    radius: 'md',
  },
});

export const collapseState = tv({
  base: '',
  variants: {
    isExpanded: {
      true: 'border-primary/50',
      false: '',
    },
    isDisabled: {
      true: 'opacity-40',
      false: '',
    },
  },
  defaultVariants: {
    isExpanded: false,
    isDisabled: false,
  },
});

export const collapseIconState = tv({
  base: '',
  variants: {
    isExpanded: {
      true: 'rotate-180 text-primary',
      false: '',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export type CollapseVariants = VariantProps<typeof collapse>;
export type CollapseClasses = VariantClasses<typeof collapse>;
export type CollapseClassNames = CollapseClasses;
export type CollapseReactClassNames = CollapseClassNames;
export type CollapseMiniClassNames = CollapseClassNames;
