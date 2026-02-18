import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export type CalendarMode = 'single' | 'range';

export const calendarStyle = tv({
  slots: {
    base: 'w-full rounded-2xl bg-white p-3',
    header: 'mb-3 flex items-center justify-between',
    title: 'text-sm font-semibold text-slate-900',
    navButton:
      'inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors duration-150 hover:bg-slate-100 active:bg-slate-200',
    weekRow: 'mb-2 grid grid-cols-7 gap-1',
    weekCell: 'text-center text-xs text-slate-400',
    grid: 'grid grid-cols-7 gap-1',
    dayCell: 'relative',
    dayButton:
      'inline-flex h-9 w-full items-center justify-center rounded-xl border border-transparent transition-colors duration-150',
    dayText: 'text-sm text-slate-900',
    helper: 'mt-3 text-xs text-slate-500',
  },
  variants: {
    size: {
      sm: {
        title: 'text-xs',
        navButton: 'h-7 w-7',
        weekCell: 'text-[11px]',
        dayButton: 'h-8 rounded-lg',
        dayText: 'text-xs',
      },
      md: {
        title: 'text-sm',
        navButton: 'h-8 w-8',
        weekCell: 'text-xs',
        dayButton: 'h-9 rounded-xl',
        dayText: 'text-sm',
      },
      lg: {
        title: 'text-base',
        navButton: 'h-9 w-9',
        weekCell: 'text-sm',
        dayButton: 'h-10 rounded-xl',
        dayText: 'text-base',
      },
    },
    radius: {
      none: {
        base: 'rounded-none',
        dayButton: 'rounded-none',
      },
      sm: {
        base: 'rounded-lg',
        dayButton: 'rounded-lg',
      },
      md: {
        base: 'rounded-xl',
        dayButton: 'rounded-xl',
      },
      lg: {
        base: 'rounded-2xl',
        dayButton: 'rounded-2xl',
      },
      full: {
        base: 'rounded-[1.75rem]',
        dayButton: 'rounded-full',
      },
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    dayStatus: {
      normal: {
        dayButton: 'hover:bg-slate-100 active:bg-slate-200',
        dayText: 'text-slate-900',
      },
      outside: {
        dayButton: 'hover:bg-slate-50',
        dayText: 'text-slate-300',
      },
      today: {
        dayButton: 'border-slate-300',
        dayText: 'font-semibold text-primary',
      },
      selected: {
        dayButton: 'text-white',
        dayText: 'text-white',
      },
      inRange: {
        dayButton: 'bg-primary/10',
        dayText: 'text-primary',
      },
      disabled: {
        dayButton: 'pointer-events-none bg-transparent',
        dayText: 'text-slate-300',
      },
    },
    isRangeStart: {
      true: {
        dayButton: 'rounded-r-md',
      },
      false: {},
    },
    isRangeEnd: {
      true: {
        dayButton: 'rounded-l-md',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      color: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-slate-900',
      },
    },
    {
      color: 'primary',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-primary',
      },
    },
    {
      color: 'secondary',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-secondary',
      },
    },
    {
      color: 'success',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-success',
      },
    },
    {
      color: 'warning',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-warning',
        dayText: 'text-black',
      },
    },
    {
      color: 'danger',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-danger',
      },
    },
    {
      color: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-slate-200/80',
        dayText: 'text-slate-800',
      },
    },
    {
      color: 'secondary',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-secondary/15',
        dayText: 'text-secondary',
      },
    },
    {
      color: 'success',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-success/15',
        dayText: 'text-success',
      },
    },
    {
      color: 'warning',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-warning/20',
        dayText: 'text-warning',
      },
    },
    {
      color: 'danger',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-danger/15',
        dayText: 'text-danger',
      },
    },
    {
      dayStatus: 'disabled',
      isRangeStart: true,
      class: {
        dayButton: 'rounded-xl',
      },
    },
    {
      dayStatus: 'disabled',
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-xl',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    radius: 'md',
    color: 'primary',
    dayStatus: 'normal',
    isRangeStart: false,
    isRangeEnd: false,
  },
});

export type CalendarVariants = VariantProps<typeof calendarStyle>;
export type CalendarClasses = VariantClasses<typeof calendarStyle>;
export type CalendarClassNames = CalendarClasses;
export type CalendarReactClassNames = CalendarClassNames;
export type CalendarMiniClassNames = CalendarClassNames;
