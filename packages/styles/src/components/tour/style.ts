import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const tour = tv({
  slots: {
    base: "",
    $modal: "",
    modal: "",
    body: "fixed inset-0 z-[1001] pointer-events-none",
    mask: "fixed bg-transparent pointer-events-auto",
    highlight:
      "fixed box-border bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.55)] pointer-events-none",
    targetBlocker: "fixed bg-transparent pointer-events-auto",
    popover:
      "fixed pointer-events-auto max-w-[min(360px,calc(100vw-24px))] rounded-2xl bg-white p-4 shadow-xl border border-slate-100",
    header: "",
    title: "text-sm font-semibold text-slate-900",
    description: "mt-1 text-xs leading-5 text-slate-600",
    progress: "mt-2 text-[11px] text-slate-500",
    footer: "mt-3 flex items-center justify-between gap-2",
    actions: "flex items-center gap-2",
    skipButton: "text-zinc-400",
    prevButton: "",
    nextButton: "",
  },
  variants: {
    tone: {
      default: {},
      dark: {
        highlight: "shadow-[0_0_0_9999px_rgba(2,6,23,0.72)]",
        popover: "bg-zinc-900 border-zinc-700",
        title: "text-white",
        description: "text-zinc-100",
        progress: "text-slate-300",
      },
    },
    isInteractive: {
      true: {
        targetBlocker: "hidden",
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: "default",
    isInteractive: true,
  },
});

export type TourVariants = VariantProps<typeof tour>;
export type TourClasses = VariantClasses<typeof tour>;
export type TourClassNames = TourClasses;
export type TourReactClassNames = Omit<TourClassNames, "$modal">;
export type TourMiniClassNames = TourClassNames;
