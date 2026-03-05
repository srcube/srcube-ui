import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export type TimelineColor =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger';

export const timelineStyle = tv({
  slots: {
    base: 'w-full',
    list: 'flex w-full flex-col',
    item: 'relative flex gap-3 pb-5',
    head: 'flex shrink-0 items-start justify-center',
    node: 'relative z-[1] inline-flex items-center justify-center rounded-full border-2 text-white',
    icon: 'leading-none',
    line: 'absolute top-0 bottom-0 w-px bg-slate-200',
    content: 'min-w-0 flex-1 pt-0.5',
    title: 'text-sm font-medium text-slate-900',
    time: 'mt-0.5 text-xs text-slate-400',
    description: 'mt-1 text-sm text-slate-500',
  },
  variants: {
    size: {
      sm: {
        head: 'w-5',
        node: 'h-4 w-4',
        icon: 'text-[10px]',
        line: 'left-2.5',
        title: 'text-xs',
        time: 'text-[11px]',
        description: 'text-xs',
      },
      md: {
        head: 'w-6',
        node: 'h-5 w-5',
        icon: 'text-xs',
        line: 'left-3',
        title: 'text-sm',
        time: 'text-xs',
        description: 'text-sm',
      },
      lg: {
        head: 'w-7',
        node: 'h-6 w-6',
        icon: 'text-sm',
        line: 'left-3.5',
        title: 'text-base',
        time: 'text-sm',
        description: 'text-base',
      },
    },
    color: {
      default: {
        node: 'border-slate-400 bg-slate-400',
        title: 'text-slate-900',
      },
      primary: {
        node: 'border-primary bg-primary',
        title: 'text-primary',
      },
      success: {
        node: 'border-success bg-success',
        title: 'text-success',
      },
      warning: {
        node: 'border-warning bg-warning text-black',
        title: 'text-warning',
      },
      danger: {
        node: 'border-danger bg-danger',
        title: 'text-danger',
      },
    },
    lineStyle: {
      solid: {
        line: 'border-none',
      },
      dashed: {
        line: 'border-l border-dashed border-slate-300 bg-transparent',
      },
    },
    isPending: {
      true: {
        node: 'bg-white text-slate-400',
      },
      false: {},
    },
    isLast: {
      true: {
        line: 'hidden',
        item: 'pb-0',
      },
      false: {},
    },
    isFirst: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      isPending: true,
      color: 'default',
      class: {
        node: 'border-slate-300',
      },
    },
    {
      isPending: true,
      color: 'primary',
      class: {
        node: 'border-primary/40',
      },
    },
    {
      isPending: true,
      color: 'success',
      class: {
        node: 'border-success/40',
      },
    },
    {
      isPending: true,
      color: 'warning',
      class: {
        node: 'border-warning/40 text-warning',
      },
    },
    {
      isPending: true,
      color: 'danger',
      class: {
        node: 'border-danger/40',
      },
    },
    {
      isFirst: true,
      size: 'sm',
      class: {
        line: 'top-2',
      },
    },
    {
      isFirst: true,
      size: 'md',
      class: {
        line: 'top-2.5',
      },
    },
    {
      isFirst: true,
      size: 'lg',
      class: {
        line: 'top-3',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'default',
    lineStyle: 'solid',
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
