import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const collapse = tv({
  slots: {
    base: 'overflow-hidden',
    trigger:
      'flex w-full items-center justify-between gap-3 text-left transition-colors duration-150',
    title: 'min-w-0 flex-1 truncate font-medium',
    icon: 'inline-flex shrink-0 items-center justify-center leading-none transition-transform duration-200',
    _iIndicator: 'icon-chevron-down text-base',
    panel: 'overflow-hidden transition-all duration-300 ease-out',
    content: 'pt-1',
  },
  variants: {
    tone: {
      default: {
        trigger: 'text-slate-900',
        icon: 'text-slate-500',
        panel: 'text-slate-600',
      },
      dark: {
        trigger: 'text-zinc-50',
        icon: 'text-zinc-400',
        panel: 'text-zinc-300',
      },
    },
    variant: {
      default: {
        base: 'border-transparent bg-transparent',
      },
      flat: {
        base: 'bg-slate-100/80 border-transparent',
      },
      outline: {
        base: 'border border-slate-200 bg-transparent',
      },
    },
    size: {
      sm: {
        trigger: 'h-9 gap-2 px-3',
        title: 'text-sm',
        icon: 'text-sm',
        panel: 'px-3',
        content: 'pb-3 text-xs',
      },
      md: {
        trigger: 'h-10 gap-2 px-4',
        title: 'text-base',
        icon: 'text-base',
        panel: 'px-4',
        content: 'pb-4 text-sm',
      },
      lg: {
        trigger: 'h-12 gap-3 px-5',
        title: 'text-lg',
        icon: 'text-lg',
        panel: 'px-5',
        content: 'pb-5 text-base',
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
    },
  },
  compoundVariants: [
    {
      tone: 'dark',
      variant: 'flat',
      class: {
        base: 'bg-zinc-900/80',
      },
    },
    {
      tone: 'dark',
      variant: 'outline',
      class: {
        base: 'border-zinc-800 bg-transparent',
      },
    },
  ],
  defaultVariants: {
    tone: 'default',
    variant: 'default',
    size: 'md',
    radius: 'md',
  },
});

export const collapseState = tv({
  base: '',
  variants: {
    isExpanded: {
      true: '',
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
      true: 'rotate-0',
      false: '-rotate-90',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export const collapsePanelState = tv({
  base: '',
  variants: {
    isExpanded: {
      true: '',
      false: 'pointer-events-none',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export type CollapseVariants = VariantProps<typeof collapse>;
export type CollapseClasses = VariantClasses<typeof collapse>;
export type CollapseClassNames = Omit<CollapseClasses, '_iIndicator'>;
export type CollapseReactClassNames = CollapseClassNames;
export type CollapseMiniClassNames = CollapseClassNames;
