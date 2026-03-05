import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const noticeBar = tv({
  slots: {
    base: 'flex w-full items-center gap-2 border px-3 leading-none',
    icon: 'inline-flex shrink-0 items-center text-sm leading-none',
    content: 'flex h-full min-w-0 flex-1 items-center overflow-hidden',
    ticker: 'relative flex h-full w-full items-center overflow-hidden',
    line: 'flex h-full min-w-full items-center leading-none',
    lineAnimated: 'animate-notice-bar-switch-down',
    text: 'inline-flex items-center whitespace-nowrap leading-[1.2]',
    textMarquee: 'animate-notice-bar-marquee',
    action: 'inline-flex shrink-0 items-center text-xs font-medium leading-none',
    close:
      'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity duration-150 hover:opacity-100',
    closeIcon: 'icon-close text-sm leading-none',
  },
  variants: {
    color: {
      default: {
        base: 'border-slate-200 bg-slate-50 text-slate-700',
      },
      info: {
        base: 'border-primary/30 bg-primary/10 text-primary',
      },
      success: {
        base: 'border-success/30 bg-success/10 text-success',
      },
      warning: {
        base: 'border-warning/30 bg-warning/10 text-warning',
      },
      danger: {
        base: 'border-danger/30 bg-danger/10 text-danger',
      },
    },
    size: {
      sm: {
        base: 'h-8 px-2.5 text-xs rounded-lg',
        icon: 'text-xs',
        close: 'h-5 w-5',
        closeIcon: 'text-xs',
        action: 'text-[11px]',
      },
      md: {
        base: 'h-10 px-3 text-sm rounded-xl',
        icon: 'text-sm',
        close: 'h-6 w-6',
        closeIcon: 'text-sm',
        action: 'text-xs',
      },
      lg: {
        base: 'h-12 px-4 text-base rounded-2xl',
        icon: 'text-base',
        close: 'h-7 w-7',
        closeIcon: 'text-base',
        action: 'text-sm',
      },
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
  },
});

export type NoticeBarVariants = VariantProps<typeof noticeBar>;
export type NoticeBarClasses = VariantClasses<typeof noticeBar>;
export type NoticeBarClassNames = NoticeBarClasses;
export type NoticeBarReactClassNames = NoticeBarClassNames;
export type NoticeBarMiniClassNames = NoticeBarClassNames;
