import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const navbar = tv({
  slots: {
    base: 'w-full bg-white',
    inner: 'flex w-full items-center gap-3 px-4',
    start: 'flex min-w-0 shrink-0 items-center justify-start',
    title: 'min-w-0 flex-1 truncate font-semibold text-slate-900',
    end: 'flex min-w-0 shrink-0 items-center justify-end',
    back: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors duration-150 active:bg-slate-100',
    backIcon: 'icon-chevron-left text-lg leading-none',
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
    titleAlign: {
      start: {
        title: 'text-left',
      },
      center: {
        title: 'text-center',
      },
      end: {
        title: 'text-right',
      },
      left: {
        title: 'text-left',
      },
      right: {
        title: 'text-right',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    isBordered: true,
    hasSafeTop: false,
    titleAlign: 'center',
  },
});

export type NavbarVariants = VariantProps<typeof navbar>;
export type NavbarClasses = VariantClasses<typeof navbar>;
export type NavbarClassNames = NavbarClasses;
export type NavbarReactClassNames = NavbarClassNames;
export type NavbarMiniClassNames = NavbarClassNames;
