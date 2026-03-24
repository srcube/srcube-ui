import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const navbar = tv({
  slots: {
    base: "w-full",
    inner: "flex w-full items-center gap-2 px-3 min-h-[var(--navbar-height)]",
    start: "flex min-w-0 flex-1 items-center justify-start gap-1",
    title: "min-w-0 flex-1 truncate font-semibold",
    end: "flex min-w-0 flex-1 items-center justify-end gap-1",
    placeholder: "inline-flex h-10 w-10 shrink-0",
    back: "inline-flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full transition-colors duration-150",
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
        placeholder: "h-9 w-9",
        back: "h-9 w-9",
        title: "text-sm",
      },
      md: {
        inner: "min-h-12",
        placeholder: "h-10 w-10",
        back: "h-10 w-10",
        title: "text-base",
      },
      lg: {
        inner: "min-h-14",
        placeholder: "h-11 w-11",
        back: "h-11 w-11",
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
      true: {},
      false: {},
    },
    titleAlign: {
      start: {
        title: "text-left",
      },
      center: {
        title: "text-center",
      },
      end: {
        title: "text-right",
      },
      left: {
        title: "text-left",
      },
      right: {
        title: "text-right",
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
