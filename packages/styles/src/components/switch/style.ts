import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const switchStyle = tv({
  slots: {
    base: "relative inline-flex items-center gap-2 select-none",
    track:
      "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200",
    thumb: [
      "absolute left-0.5 top-1/2 flex items-center justify-center rounded-full shadow-sm",
      "-translate-y-1/2 translate-x-0 transition duration-200",
    ],
    _iThumb:
      "flex shrink-0 items-center justify-center leading-none text-current",
    _iLoading: "icon-spinner text-current",
    content: "text-sm",
    nSwitch: "absolute inset-0 opacity-0 pointer-events-none",
  },
  variants: {
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    tone: {
      default: {
        track: "bg-slate-300",
        thumb: "bg-white",
        _iThumb: "text-slate-500",
        _iLoading: "text-slate-500",
        content: "text-slate-900",
      },
      dark: {
        track: "bg-zinc-700",
        thumb: "bg-white",
        _iThumb: "text-zinc-500",
        _iLoading: "text-zinc-500",
        content: "text-zinc-50",
      },
    },
    size: {
      sm: {
        track: "h-5 w-9",
        thumb: "size-4",
        _iThumb: "size-2",
        _iLoading: "size-2",
        content: "text-sm",
      },
      md: {
        track: "h-6 w-11",
        thumb: "size-5",
        _iThumb: "size-2.5",
        _iLoading: "size-2.5",
        content: "text-base",
      },
      lg: {
        track: "h-7 w-12",
        thumb: "size-6",
        _iThumb: "size-3",
        _iLoading: "size-3",
        content: "text-lg",
      },
    },
    isSelected: {
      true: {},
      false: {},
    },
    isReadOnly: {
      true: {
        base: "cursor-default",
      },
      false: {
        base: "cursor-pointer",
      },
    },
    isDisabled: {
      true: {
        base: "opacity-60 cursor-not-allowed",
      },
      false: {},
    },
    isLoading: {
      true: {
        base: "cursor-wait",
      },
      false: {},
      auto: {},
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      class: {
        _iThumb: "opacity-0",
      },
    },
    {
      isSelected: true,
      size: "sm",
      class: {
        thumb: "translate-x-4",
      },
    },
    {
      isSelected: true,
      size: "md",
      class: {
        thumb: "translate-x-5",
      },
    },
    {
      isSelected: true,
      size: "lg",
      class: {
        thumb: "translate-x-5",
      },
    },
    {
      isSelected: true,
      color: "default",
      tone: "default",
      class: {
        track: "bg-slate-700",
        _iThumb: "text-slate-700",
        _iLoading: "text-slate-700",
      },
    },
    {
      isSelected: true,
      color: "default",
      tone: "dark",
      class: {
        track: "bg-zinc-500",
        thumb: "bg-zinc-100",
        _iThumb: "text-zinc-600",
        _iLoading: "text-zinc-600",
      },
    },
    {
      isSelected: true,
      color: "primary",
      tone: "default",
      class: {
        track: "bg-primary",
        _iThumb: "text-primary",
        _iLoading: "text-primary",
      },
    },
    {
      isSelected: true,
      color: "primary",
      tone: "dark",
      class: {
        track: "bg-primary-600",
        thumb: "bg-primary-100",
        _iThumb: "text-primary-600",
        _iLoading: "text-primary-600",
      },
    },
    {
      isSelected: true,
      color: "secondary",
      tone: "default",
      class: {
        track: "bg-secondary",
        _iThumb: "text-secondary",
        _iLoading: "text-secondary",
      },
    },
    {
      isSelected: true,
      color: "secondary",
      tone: "dark",
      class: {
        track: "bg-secondary-600",
        thumb: "bg-secondary-100",
        _iThumb: "text-secondary-600",
        _iLoading: "text-secondary-600",
      },
    },
    {
      isSelected: true,
      color: "success",
      tone: "default",
      class: {
        track: "bg-success",
        _iThumb: "text-success",
        _iLoading: "text-success",
      },
    },
    {
      isSelected: true,
      color: "success",
      tone: "dark",
      class: {
        track: "bg-success-600",
        thumb: "bg-success-100",
        _iThumb: "text-success-600",
        _iLoading: "text-success-600",
      },
    },
    {
      isSelected: true,
      color: "warning",
      tone: "default",
      class: {
        track: "bg-warning",
        _iThumb: "text-warning",
        _iLoading: "text-warning",
      },
    },
    {
      isSelected: true,
      color: "warning",
      tone: "dark",
      class: {
        track: "bg-warning-600",
        thumb: "bg-warning-100",
        _iThumb: "text-warning-600",
        _iLoading: "text-warning-600",
      },
    },
    {
      isSelected: true,
      color: "danger",
      tone: "default",
      class: {
        track: "bg-danger",
        _iThumb: "text-danger",
        _iLoading: "text-danger",
      },
    },
    {
      isSelected: true,
      color: "danger",
      tone: "dark",
      class: {
        track: "bg-danger-600",
        thumb: "bg-danger-100",
        _iThumb: "text-danger-600",
        _iLoading: "text-danger-600",
      },
    },
    {
      isLoading: true,
      class: {
        _iLoading: "opacity-80",
      },
    },
  ],
  defaultVariants: {
    color: "default",
    tone: "default",
    size: "md",
    isSelected: false,
    isDisabled: false,
    isReadOnly: false,
    isLoading: false,
  },
});

export type SwitchVariants = VariantProps<typeof switchStyle>;
export type SwitchClasses = VariantClasses<typeof switchStyle>;
export type SwitchClassNames = Omit<SwitchClasses, "_iThumb" | "_iLoading">;
