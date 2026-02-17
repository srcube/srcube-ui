import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const accordion = tv({
  slots: {
    base: 'flex flex-col',
    item: 'overflow-hidden border border-slate-200 bg-white',
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
        item: 'bg-white border-slate-200',
      },
      twotone: {
        item: 'bg-slate-50 border-slate-200',
      },
      soft: {
        item: 'bg-slate-100/80 border-transparent',
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
        item: 'rounded-none',
      },
      sm: {
        item: 'rounded-lg',
      },
      md: {
        item: 'rounded-xl',
      },
      lg: {
        item: 'rounded-2xl',
      },
      full: {
        item: 'rounded-full',
      },
    },
    isSeparated: {
      true: {
        base: 'gap-3',
      },
      false: {
        base: 'gap-0',
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md',
    radius: 'md',
    isSeparated: true,
  },
});

export const accordionItemState = tv({
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

export const accordionIconState = tv({
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

export type AccordionVariants = VariantProps<typeof accordion>;
export type AccordionClasses = VariantClasses<typeof accordion>;
export type AccordionClassNames = AccordionClasses;
export type AccordionReactClassNames = AccordionClassNames;
export type AccordionMiniClassNames = AccordionClassNames;
