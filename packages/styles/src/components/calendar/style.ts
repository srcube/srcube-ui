import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

export type CalendarMode = 'single' | 'range';

export const calendarStyle = tv({
  slots: {
    base: 'relative w-full rounded-2xl bg-white p-3',
    header: 'mb-3 px-8',
    pickerTrigger: 'w-full',
    title: 'text-sm font-semibold text-slate-900',
    pickerIcon:
      'ml-1 inline-flex text-base leading-none text-slate-500 transition-transform duration-200',
    panel: 'relative',
    weekRow: 'mb-2 grid grid-cols-7 gap-1',
    weekCell: 'text-center text-xs text-slate-400',
    monthList: 'relative',
    monthHeader:
      'sticky top-0 z-10 flex items-center px-1 font-semibold bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80',
    monthBody: 'pb-2',
    grid: 'grid grid-cols-7 gap-y-1',
    dayCell: 'relative min-h-0',
    dayPlaceholder: 'h-full rounded-xl',
    dayButton:
      'inline-flex h-8 w-[calc(100%-8px)] mx-auto items-center justify-center rounded-lg border border-transparent transition-[background-color,border-color,color] duration-150 box-border leading-none',
    dayText: 'text-sm text-slate-900',
    helper: 'mt-3 text-xs text-slate-500',
    pickerBackdrop: 'absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px]',
    pickerOverlay: 'absolute inset-0 z-20 overflow-hidden bg-white',
    pickerPanel: 'h-full p-2',
    pickerPickbox: 'h-full border-none',
  },
  variants: {
    size: {
      sm: {
        title: 'text-xs',
        pickerIcon: 'text-sm',
        weekCell: 'text-[11px]',
        monthList: 'h-64',
        monthHeader: 'h-8 text-xs',
        monthBody: 'pb-1',
        dayButton: 'h-7 w-[calc(100%-8px)] rounded-lg',
        dayPlaceholder: 'rounded-lg',
        dayText: 'text-xs',
      },
      md: {
        title: 'text-sm',
        pickerIcon: 'text-base',
        weekCell: 'text-xs',
        monthList: 'h-72',
        monthHeader: 'h-9 text-sm',
        monthBody: 'pb-2',
        dayButton: 'h-8 w-[calc(100%-8px)] rounded-lg',
        dayPlaceholder: 'rounded-xl',
        dayText: 'text-sm',
      },
      lg: {
        title: 'text-base',
        pickerIcon: 'text-lg',
        weekCell: 'text-sm',
        monthList: 'h-80',
        monthHeader: 'h-10 text-base',
        monthBody: 'pb-3',
        dayButton: 'h-8.5 w-[calc(100%-8px)] rounded-xl',
        dayPlaceholder: 'rounded-xl',
        dayText: 'text-base',
      },
    },
    radius: {
      none: {
        base: 'rounded-none',
        dayButton: 'rounded-none',
        dayPlaceholder: 'rounded-none',
        pickerBackdrop: 'rounded-none',
        pickerOverlay: 'rounded-none',
      },
      sm: {
        base: 'rounded-lg',
        dayButton: 'rounded-lg',
        dayPlaceholder: 'rounded-lg',
        pickerBackdrop: 'rounded-lg',
        pickerOverlay: 'rounded-lg',
      },
      md: {
        base: 'rounded-xl',
        dayButton: 'rounded-xl',
        dayPlaceholder: 'rounded-xl',
        pickerBackdrop: 'rounded-xl',
        pickerOverlay: 'rounded-xl',
      },
      lg: {
        base: 'rounded-2xl',
        dayButton: 'rounded-2xl',
        dayPlaceholder: 'rounded-2xl',
        pickerBackdrop: 'rounded-2xl',
        pickerOverlay: 'rounded-2xl',
      },
      full: {
        base: 'rounded-[1.75rem]',
        dayButton: 'rounded-full',
        dayPlaceholder: 'rounded-full',
        pickerBackdrop: 'rounded-[1.75rem]',
        pickerOverlay: 'rounded-[1.25rem]',
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
    tone: {
      default: {},
      dark: {
        base: 'bg-zinc-950',
        title: 'text-zinc-50',
        pickerIcon: 'text-zinc-400',
        weekCell: 'text-zinc-500',
        monthHeader:
          'bg-zinc-950/95 supports-[backdrop-filter]:bg-zinc-950/80',
        helper: 'text-zinc-400',
        pickerBackdrop: 'bg-zinc-950/75',
        pickerOverlay: 'bg-zinc-950',
      },
    },
    dayStatus: {
      normal: {
        dayButton: 'hover:bg-slate-100 active:bg-slate-200',
        dayText: 'text-slate-900',
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
        dayButton: 'rounded-none bg-primary/10',
        dayText: 'text-primary',
      },
      disabled: {
        dayButton: 'pointer-events-none bg-transparent',
        dayText: 'text-slate-300',
      },
    },
    isPickerOpen: {
      true: {
        pickerIcon: 'rotate-180',
      },
      false: {
        pickerIcon: 'rotate-0',
      },
    },
    isRangeStart: {
      true: {
        dayButton: 'rounded-r-none',
      },
      false: {},
    },
    isRangeEnd: {
      true: {
        dayButton: 'rounded-l-none',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      isRangeStart: true,
      class: {
        dayButton: 'rounded-l-lg',
      },
    },
    {
      size: 'sm',
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-r-lg',
      },
    },
    {
      size: 'md',
      isRangeStart: true,
      class: {
        dayButton: 'rounded-l-xl',
      },
    },
    {
      size: 'md',
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-r-xl',
      },
    },
    {
      size: 'lg',
      isRangeStart: true,
      class: {
        dayButton: 'rounded-l-xl',
      },
    },
    {
      size: 'lg',
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-r-xl',
      },
    },
    {
      size: 'sm',
      isRangeStart: true,
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-lg',
      },
    },
    {
      size: 'md',
      isRangeStart: true,
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-xl',
      },
    },
    {
      size: 'lg',
      isRangeStart: true,
      isRangeEnd: true,
      class: {
        dayButton: 'rounded-xl',
      },
    },
    {
      color: 'default',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-slate-900 border-transparent',
        dayText: 'text-white',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-primary border-transparent',
        dayText: 'text-white',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-secondary border-transparent',
        dayText: 'text-white',
      },
    },
    {
      color: 'success',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-success border-transparent',
        dayText: 'text-white',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-warning border-transparent',
        dayText: 'text-black',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-danger border-transparent',
        dayText: 'text-white',
      },
    },
    {
      color: 'default',
      tone: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-slate-200/80',
        dayText: 'text-slate-800',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-secondary/15',
        dayText: 'text-secondary',
      },
    },
    {
      color: 'success',
      tone: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-success/15',
        dayText: 'text-success',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-warning/20',
        dayText: 'text-warning',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-danger/15',
        dayText: 'text-danger',
      },
    },
    {
      color: 'default',
      tone: 'default',
      class: {
        monthHeader: 'text-slate-700',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        monthHeader: 'text-primary',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        monthHeader: 'text-secondary',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        monthHeader: 'text-success',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        monthHeader: 'text-warning',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        monthHeader: 'text-danger',
      },
    },
    {
      tone: 'dark',
      dayStatus: 'normal',
      class: {
        dayButton: 'hover:bg-zinc-900 active:bg-zinc-800',
        dayText: 'text-zinc-100',
      },
    },
    {
      tone: 'dark',
      dayStatus: 'today',
      class: {
        dayButton: 'border-zinc-700',
      },
    },
    {
      tone: 'dark',
      dayStatus: 'disabled',
      class: {
        dayText: 'text-zinc-700',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-zinc-700 border-transparent shadow-none',
        dayText: 'text-zinc-50',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-primary-700 border-transparent shadow-none',
        dayText: 'text-white',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-secondary-700 border-transparent shadow-none',
        dayText: 'text-white',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-success-700 border-transparent shadow-none',
        dayText: 'text-white',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-warning-700 border-transparent shadow-none',
        dayText: 'text-white',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      dayStatus: 'selected',
      class: {
        dayButton: 'bg-danger-700 border-transparent shadow-none',
        dayText: 'text-white',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-zinc-900',
        dayText: 'text-zinc-100',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-primary-950',
        dayText: 'text-primary-100',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-secondary-950',
        dayText: 'text-secondary-100',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-success-950',
        dayText: 'text-success-100',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-warning-950',
        dayText: 'text-warning-100',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      dayStatus: 'inRange',
      class: {
        dayButton: 'bg-danger-950',
        dayText: 'text-danger-100',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      class: {
        monthHeader: 'text-zinc-300',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        monthHeader: 'text-primary-100',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        monthHeader: 'text-secondary-100',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        monthHeader: 'text-success-100',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        monthHeader: 'text-warning-100',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        monthHeader: 'text-danger-100',
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
    tone: 'default',
    dayStatus: 'normal',
    isPickerOpen: false,
    isRangeStart: false,
    isRangeEnd: false,
  },
});

export type CalendarVariants = VariantProps<typeof calendarStyle>;
export type CalendarClasses = VariantClasses<typeof calendarStyle>;
export type CalendarClassNames = CalendarClasses;
export type CalendarReactClassNames = CalendarClassNames;
export type CalendarMiniClassNames = CalendarClassNames;
