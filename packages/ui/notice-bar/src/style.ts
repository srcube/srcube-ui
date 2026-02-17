import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const noticeBar = tv({
  slots: {
    base: 'flex w-full items-center gap-2 border px-3',
    icon: 'shrink-0 text-sm',
    content: 'min-w-0 flex-1',
    text: 'truncate',
    action: 'shrink-0 text-xs font-medium',
    close: 'shrink-0 text-xs opacity-70 transition-opacity duration-150 hover:opacity-100',
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
        action: 'text-[11px]',
      },
      md: {
        base: 'h-10 px-3 text-sm rounded-xl',
        icon: 'text-sm',
        action: 'text-xs',
      },
      lg: {
        base: 'h-12 px-4 text-base rounded-2xl',
        icon: 'text-base',
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
