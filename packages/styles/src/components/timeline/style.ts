import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export type TimelineColor =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export const timelineStyle = tv({
  slots: {
    base: "w-full",
    list: "flex w-full flex-col",
    item: "flex items-start gap-3",
    indicatorWrap:
      "relative z-[1] flex shrink-0 self-stretch flex-col items-center",
    node: "relative z-[1] inline-flex items-center justify-center rounded-full border-2 text-white",
    icon: "leading-none",
    lineStart: "h-0 w-px bg-slate-200",
    lineEnd: "w-px flex-1 bg-slate-200",
    content: "min-w-0 flex-1 pt-0",
    title: "text-sm font-medium text-slate-900",
    time: "mt-0.5 text-xs text-slate-400",
    description: "mt-1 text-sm text-slate-500",
  },
  variants: {
    tone: {
      default: {},
      dark: {
        lineStart: "bg-zinc-800",
        lineEnd: "bg-zinc-800",
        title: "text-zinc-100",
        time: "text-zinc-500",
        description: "text-zinc-400",
      },
    },
    size: {
      sm: {
        indicatorWrap: "w-5",
        node: "h-4 w-4",
        icon: "text-[10px]",
        title: "text-xs",
        time: "text-[11px]",
        description: "text-xs",
      },
      md: {
        indicatorWrap: "w-6",
        node: "h-5 w-5",
        icon: "text-xs",
        title: "text-sm",
        time: "text-xs",
        description: "text-sm",
      },
      lg: {
        indicatorWrap: "w-7",
        node: "h-6 w-6",
        icon: "text-sm",
        title: "text-base",
        time: "text-sm",
        description: "text-base",
      },
    },
    color: {
      default: {
        node: "border-slate-400 bg-slate-400",
        title: "text-slate-900",
      },
      primary: {
        node: "border-primary bg-primary",
        title: "text-primary",
      },
      success: {
        node: "border-success bg-success",
        title: "text-success",
      },
      warning: {
        node: "border-warning bg-warning text-black",
        title: "text-warning",
      },
      danger: {
        node: "border-danger bg-danger",
        title: "text-danger",
      },
    },
    lineStyle: {
      solid: {
        lineStart: "border-none",
        lineEnd: "border-none",
      },
      dashed: {
        lineStart: "border-l border-dashed border-slate-300 bg-transparent",
        lineEnd: "border-l border-dashed border-slate-300 bg-transparent",
      },
    },
    isPending: {
      true: {
        node: "bg-white text-slate-400",
      },
      false: {},
    },
    isLast: {
      true: {
        lineEnd: "bg-transparent",
      },
      false: {},
    },
    isFirst: {
      true: {
        lineStart: "bg-transparent border-transparent",
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: "dark",
      color: "default",
      class: {
        node: "border-zinc-700 bg-zinc-700",
        title: "text-zinc-100",
      },
    },
    {
      tone: "dark",
      color: "primary",
      class: {
        title: "text-primary-100",
      },
    },
    {
      tone: "dark",
      color: "success",
      class: {
        title: "text-success-100",
      },
    },
    {
      tone: "dark",
      color: "warning",
      class: {
        title: "text-warning-100",
      },
    },
    {
      tone: "dark",
      color: "danger",
      class: {
        title: "text-danger-100",
      },
    },
    {
      tone: "dark",
      lineStyle: "dashed",
      class: {
        lineStart: "border-zinc-700 bg-transparent",
        lineEnd: "border-zinc-700 bg-transparent",
      },
    },
    {
      tone: "dark",
      isPending: true,
      class: {
        node: "bg-zinc-950 text-zinc-500",
      },
    },
    {
      isPending: true,
      color: "default",
      class: {
        node: "border-slate-300",
      },
    },
    {
      isPending: true,
      color: "primary",
      class: {
        node: "border-primary/40",
      },
    },
    {
      isPending: true,
      color: "success",
      class: {
        node: "border-success/40",
      },
    },
    {
      isPending: true,
      color: "warning",
      class: {
        node: "border-warning/40 text-warning",
      },
    },
    {
      isPending: true,
      color: "danger",
      class: {
        node: "border-danger/40",
      },
    },
    {
      tone: "dark",
      isPending: true,
      color: "default",
      class: {
        node: "border-zinc-700",
      },
    },
    {
      tone: "dark",
      isPending: true,
      color: "primary",
      class: {
        node: "border-primary-600 text-primary-200",
      },
    },
    {
      tone: "dark",
      isPending: true,
      color: "success",
      class: {
        node: "border-success-600 text-success-200",
      },
    },
    {
      tone: "dark",
      isPending: true,
      color: "warning",
      class: {
        node: "border-warning-600 text-warning-200",
      },
    },
    {
      tone: "dark",
      isPending: true,
      color: "danger",
      class: {
        node: "border-danger-600 text-danger-200",
      },
    },
  ],
  defaultVariants: {
    tone: "default",
    size: "md",
    color: "default",
    lineStyle: "solid",
    isPending: false,
    isLast: false,
    isFirst: false,
  },
});

export type TimelineVariants = VariantProps<typeof timelineStyle>;
export type TimelineClasses = VariantClasses<typeof timelineStyle>;
export type TimelineClassNames = TimelineClasses;
export type TimelineReactClassNames = TimelineClassNames;
export type TimelineMiniClassNames = TimelineClassNames;
