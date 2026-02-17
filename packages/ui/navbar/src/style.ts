import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const navbar = tv({
  slots: {
    base: 'w-full bg-white',
    inner: 'flex w-full items-center gap-3 px-4',
    start: 'flex min-w-0 flex-1 items-center justify-start',
    title: 'min-w-0 flex-none truncate text-center font-semibold text-slate-900',
    end: 'flex min-w-0 flex-1 items-center justify-end',
  },
  variants: {
    size: {
      sm: {
        inner: 'h-11',
        title: 'text-sm',
      },
      md: {
        inner: 'h-12',
        title: 'text-base',
      },
      lg: {
        inner: 'h-14',
        title: 'text-lg',
      },
    },
    isBordered: {
      true: {
        base: 'border-b border-slate-200',
      },
      false: {},
    },
    hasSafeTop: {
      true: {
        base: 'pt-safe',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    isBordered: true,
    hasSafeTop: false,
  },
});

export type NavbarVariants = VariantProps<typeof navbar>;
export type NavbarClasses = VariantClasses<typeof navbar>;
export type NavbarClassNames = NavbarClasses;
export type NavbarReactClassNames = NavbarClassNames;
export type NavbarMiniClassNames = NavbarClassNames;
