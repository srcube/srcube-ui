import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const card = tv({
  slots: {
    base: 'w-full overflow-hidden',
    header: 'px-4 pt-4 text-base font-semibold',
    body: 'px-4 py-4 text-sm',
    footer: 'px-4 pb-4 text-sm',
  },
  variants: {
    color: {
      default: {
        base: 'bg-white text-slate-900',
      },
      primary: {
        base: 'bg-primary/10 text-primary',
      },
      secondary: {
        base: 'bg-secondary/10 text-secondary',
      },
      success: {
        base: 'bg-success/10 text-success',
      },
      warning: {
        base: 'bg-warning/10 text-warning',
      },
      danger: {
        base: 'bg-danger/10 text-danger',
      },
    },
    size: {
      sm: {
        header: 'px-3 pt-3 text-sm',
        body: 'px-3 py-3 text-xs',
        footer: 'px-3 pb-3 text-xs',
      },
      md: {
        header: 'px-4 pt-4 text-base',
        body: 'px-4 py-4 text-sm',
        footer: 'px-4 pb-4 text-sm',
      },
      lg: {
        header: 'px-5 pt-5 text-lg',
        body: 'px-5 py-5 text-base',
        footer: 'px-5 pb-5 text-base',
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
    color: 'default',
    size: 'md',
    radius: 'md',
  },
});

export type CardVariants = VariantProps<typeof card>;
export type CardClasses = VariantClasses<typeof card>;
export type CardClassNames = CardClasses;
export type CardReactClassNames = CardClassNames;
export type CardMiniClassNames = CardClassNames;
