import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const navbar = tv({
  slots: {
    base: "w-full",
    inner: "relative flex w-full items-center gap-3 px-3 py-2",
    start: "flex min-w-[2.75rem] shrink-0 items-center justify-start",
    title: "min-w-0 truncate font-semibold",
    end: "flex min-w-[2.75rem] shrink-0 items-center justify-end",
    placeholder: "inline-flex h-10 w-11 shrink-0",
    back: "relative z-[1] inline-flex h-10 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150",
    _iBack: "icon-chevron-left text-2xl leading-none",
  },
  variants: {
    tone: {
      default: {
        base: "bg-white text-slate-900",
        title: "text-slate-900",
        back: "text-slate-700 active:bg-slate-100",
      },
      dark: {
        base: "bg-zinc-950 text-white",
        title: "text-white",
        back: "text-zinc-200 active:bg-zinc-800",
      },
    },
    size: {
      sm: {
        inner: "min-h-11",
        start: "min-w-[2.5rem]",
        end: "min-w-[2.5rem]",
        placeholder: "h-9 w-10",
        back: "h-9 w-10",
        title: "text-sm",
      },
      md: {
        inner: "min-h-12",
        start: "min-w-[2.75rem]",
        end: "min-w-[2.75rem]",
        placeholder: "h-10 w-11",
        back: "h-10 w-11",
        title: "text-base",
      },
      lg: {
        inner: "min-h-14",
        start: "min-w-[3rem]",
        end: "min-w-[3rem]",
        placeholder: "h-11 w-12",
        back: "h-11 w-12",
        title: "text-lg",
      },
    },
    isBordered: {
      true: {
        base: "border-b",
      },
      false: {},
    },
    hasSafeTop: {
      true: {
        base: "pt-safe",
        inner: "pt-1",
      },
      false: {},
    },
    titleAlign: {
      start: {
        title: "flex-1 text-left",
      },
      center: {
        start: "grow basis-0",
        end: "grow basis-0 justify-end",
        title:
          "pointer-events-none absolute left-1/2 right-1/2 z-0 w-max max-w-[calc(100%-7rem)] -translate-x-1/2 text-center",
      },
      end: {
        title: "flex-1 text-right",
      },
      left: {
        title: "flex-1 text-left",
      },
      right: {
        title: "flex-1 text-right",
      },
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    isBordered: true,
    hasSafeTop: true,
    titleAlign: "center",
  },
  compoundVariants: [
    {
      tone: "default",
      isBordered: true,
      class: {
        base: "border-slate-200",
      },
    },
    {
      tone: "dark",
      isBordered: true,
      class: {
        base: "border-zinc-800",
      },
    },
  ],
});

export type NavbarVariants = VariantProps<typeof navbar>;
export type NavbarClasses = VariantClasses<typeof navbar>;
export type NavbarClassNames = Omit<NavbarClasses, "_iBack">;
export type NavbarReactClassNames = NavbarClassNames;
export type NavbarMiniClassNames = NavbarClassNames;
