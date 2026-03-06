import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const navbar = tv({
  slots: {
    base: 'w-full bg-white',
    inner: 'relative flex w-full items-center gap-3 p-2',
    start: 'flex min-w-0 shrink-0 items-center justify-start',
    title: 'min-w-0 truncate font-semibold text-slate-900',
    end: 'flex min-w-0 shrink-0 items-center justify-end',
    placeholder: 'inline-flex h-10 w-10 shrink-0',
    back: 'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-700 transition-colors duration-150 active:bg-slate-100',
    _iBack: 'icon-chevron-left text-2xl leading-none',
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
        title: 'flex-1 text-left',
      },
      center: {
        start: 'grow basis-0',
        end: 'grow basis-0 justify-end',
        title: 'pointer-events-none absolute left-1/2 -translate-x-1/2 text-center max-w-[calc(100%-7rem)]',
      },
      end: {
        title: 'flex-1 text-right',
      },
      left: {
        title: 'flex-1 text-left',
      },
      right: {
        title: 'flex-1 text-right',
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
export type NavbarClassNames = Omit<NavbarClasses, '_iBack'>;
export type NavbarReactClassNames = NavbarClassNames;
export type NavbarMiniClassNames = NavbarClassNames;
