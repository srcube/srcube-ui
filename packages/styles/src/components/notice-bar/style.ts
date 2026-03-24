import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const noticeBar = tv({
  slots: {
    base: "flex w-full items-center gap-2 border px-3 leading-none",
    icon: "inline-flex shrink-0 items-center text-sm leading-none",
    content: "flex h-full min-w-0 flex-1 items-center overflow-hidden",
    ticker: "relative flex h-full w-full items-center overflow-hidden",
    line: "flex h-full min-w-full items-center leading-none",
    lineAnimated: "animate-notice-bar-switch-down",
    text: "inline-flex items-center whitespace-nowrap leading-[1.2]",
    textMarquee: "animate-notice-bar-marquee",
    action:
      "inline-flex shrink-0 items-center text-xs font-medium leading-none",
    close:
      "inline-flex h-6 min-w-6 w-6 shrink-0 items-center justify-center rounded-full border border-transparent opacity-70 transition-[opacity,border-color,background-color] duration-150 hover:opacity-100",
    closeIcon: "icon-close text-sm leading-none",
  },
  variants: {
    color: {
      default: {},
      info: {},
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
        base: "h-8 px-2.5 text-xs rounded-lg",
        icon: "text-xs",
        close: "h-5 min-w-5 w-5",
        closeIcon: "text-xs",
        action: "text-[11px]",
      },
      md: {
        base: "h-10 px-3 text-sm rounded-xl",
        icon: "text-sm",
        close: "h-6 min-w-6 w-6",
        closeIcon: "text-sm",
        action: "text-xs",
      },
      lg: {
        base: "h-12 px-4 text-base rounded-2xl",
        icon: "text-base",
        close: "h-7 min-w-7 w-7",
        closeIcon: "text-base",
        action: "text-sm",
      },
    },
  },
  compoundVariants: [
    {
      color: "default",
      tone: "default",
      class: {
        base: "border-slate-200 bg-slate-50 text-slate-700",
        close: "border-slate-200/70 text-slate-500 active:bg-slate-100",
      },
    },
    {
      color: "default",
      tone: "dark",
      class: {
        base: "border-zinc-700 bg-zinc-900 text-zinc-100",
        close: "border-zinc-700 text-zinc-300 active:bg-zinc-800",
      },
    },
    {
      color: "info",
      tone: "default",
      class: {
        base: "border-primary/30 bg-primary/10 text-primary",
        close: "border-primary/25 text-primary/80 active:bg-primary/10",
      },
    },
    {
      color: "info",
      tone: "dark",
      class: {
        base: "border-primary-800 bg-primary-950 text-primary-100",
        close: "border-primary-800 text-primary-200 active:bg-primary-900/50",
      },
    },
    {
      color: "success",
      tone: "default",
      class: {
        base: "border-success/30 bg-success/10 text-success",
        close: "border-success/25 text-success/80 active:bg-success/10",
      },
    },
    {
      color: "success",
      tone: "dark",
      class: {
        base: "border-success-800 bg-success-950 text-success-100",
        close: "border-success-800 text-success-200 active:bg-success-900/50",
      },
    },
    {
      color: "warning",
      tone: "default",
      class: {
        base: "border-warning/30 bg-warning/10 text-warning",
        close: "border-warning/30 text-warning/80 active:bg-warning/10",
      },
    },
    {
      color: "warning",
      tone: "dark",
      class: {
        base: "border-warning-800 bg-warning-950 text-warning-100",
        close: "border-warning-800 text-warning-200 active:bg-warning-900/50",
      },
    },
    {
      color: "danger",
      tone: "default",
      class: {
        base: "border-danger/30 bg-danger/10 text-danger",
        close: "border-danger/25 text-danger/80 active:bg-danger/10",
      },
    },
    {
      color: "danger",
      tone: "dark",
      class: {
        base: "border-danger-800 bg-danger-950 text-danger-100",
        close: "border-danger-800 text-danger-200 active:bg-danger-900/50",
      },
    },
  ],
  defaultVariants: {
    color: "default",
    tone: "default",
    size: "md",
  },
});

export type NoticeBarVariants = VariantProps<typeof noticeBar>;
export type NoticeBarClasses = VariantClasses<typeof noticeBar>;
export type NoticeBarClassNames = NoticeBarClasses;
export type NoticeBarReactClassNames = NoticeBarClassNames;
export type NoticeBarMiniClassNames = NoticeBarClassNames;
