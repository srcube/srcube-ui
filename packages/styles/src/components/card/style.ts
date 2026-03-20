import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const card = tv({
  slots: {
    base: 'w-full overflow-hidden',
    header: 'px-4 pt-4 text-base font-semibold',
    body: 'px-4 py-4 text-sm',
    footer: 'px-4 pb-4 text-sm',
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
    tone: {
      default: {},
      dark: {},
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
  compoundVariants: [
    {
      color: 'default',
      tone: 'default',
      class: {
        base: 'bg-white text-slate-900',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      class: {
        base: 'bg-zinc-900 text-white',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        base: 'bg-primary/10 text-primary',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        base: 'bg-primary-950 text-primary-100',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        base: 'bg-secondary/10 text-secondary',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        base: 'bg-secondary-950 text-secondary-100',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        base: 'bg-success/10 text-success',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        base: 'bg-success-950 text-success-100',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        base: 'bg-warning/10 text-warning',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        base: 'bg-warning-950 text-warning-100',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        base: 'bg-danger/10 text-danger',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        base: 'bg-danger-950 text-danger-100',
      },
    },
  ],
  defaultVariants: {
    color: 'default',
    tone: 'default',
    size: 'md',
    radius: 'md',
  },
});

export type CardVariants = VariantProps<typeof card>;
export type CardClasses = VariantClasses<typeof card>;
export type CardClassNames = CardClasses;
export type CardReactClassNames = CardClassNames;
export type CardMiniClassNames = CardClassNames;
