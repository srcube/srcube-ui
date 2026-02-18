import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const card = tv({
  slots: {
    base: 'w-full overflow-hidden bg-white',
    header: 'flex items-start gap-3 px-4 pt-4',
    headerMain: 'min-w-0 flex-1',
    title: 'text-base font-semibold text-slate-900',
    description: 'mt-1 text-sm text-slate-500',
    startContent: 'shrink-0',
    endContent: 'shrink-0',
    body: 'px-4 py-4',
    footer: 'flex items-center justify-end gap-2 px-4 pb-4',
    divider: 'mx-4 h-px bg-slate-200',
  },
  variants: {
    size: {
      sm: {
        header: 'px-3 pt-3',
        title: 'text-sm',
        description: 'text-xs',
        body: 'px-3 py-3',
        footer: 'px-3 pb-3',
        divider: 'mx-3',
      },
      md: {},
      lg: {
        header: 'px-5 pt-5',
        title: 'text-lg',
        description: 'text-sm',
        body: 'px-5 py-5',
        footer: 'px-5 pb-5',
        divider: 'mx-5',
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
        base: 'rounded-[999px]',
      },
    },
    shadow: {
      none: {
        base: 'shadow-none',
      },
      sm: {
        base: 'shadow-sm',
      },
      md: {
        base: 'shadow',
      },
      lg: {
        base: 'shadow-lg',
      },
    },
    isBordered: {
      true: {
        base: 'border border-slate-200',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    radius: 'md',
    shadow: 'sm',
    isBordered: true,
  },
});

export type CardVariants = VariantProps<typeof card>;
export type CardClasses = VariantClasses<typeof card>;
export type CardClassNames = CardClasses;
export type CardReactClassNames = CardClassNames;
export type CardMiniClassNames = CardClassNames;
