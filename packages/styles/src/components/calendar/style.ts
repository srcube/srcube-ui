import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

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
    grid: 'grid grid-cols-7 gap-1',
    dayCell: 'relative min-h-0',
    dayPlaceholder: 'h-full rounded-xl',
    dayButton:
      'inline-flex h-9 w-full items-center justify-center rounded-xl border border-transparent transition-colors duration-150',
    dayText: 'text-sm text-slate-900',
    helper: 'mt-3 text-xs text-slate-500',
    pickerBackdrop:
      'absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px]',
    pickerOverlay:
      'absolute inset-0 z-20 overflow-hidden bg-white',
    pickerPanel: 'h-full p-2',
    pickerPickbox: 'h-full',
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
        dayButton: 'h-8 rounded-lg',
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
        dayButton: 'h-9 rounded-xl',
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
        dayButton: 'h-10 rounded-xl',
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
        dayButton: 'bg-primary/10',
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
      color: 'default',
      class: {
        monthHeader: 'text-slate-700',
      },
    },
    {
      color: 'primary',
      class: {
        monthHeader: 'text-primary',
      },
    },
    {
      color: 'secondary',
      class: {
        monthHeader: 'text-secondary',
      },
    },
    {
      color: 'success',
      class: {
        monthHeader: 'text-success',
      },
    },
    {
      color: 'warning',
      class: {
        monthHeader: 'text-warning',
      },
    },
    {
      color: 'danger',
      class: {
        monthHeader: 'text-danger',
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
