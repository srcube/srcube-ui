import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const radio = tv({
  slots: {
    base: "relative inline-flex items-center gap-2 select-none",
    radio: [
      "relative flex shrink-0 items-center justify-center",
      "before:absolute before:inset-0 before:rounded-full before:border-2",
    ],
    _iLoading: "icon-spinner z-10 text-current",
    content: "relative text-sm",
    iconWrapper:
      "relative z-10 flex items-center justify-center transition duration-200",
    iDefault: "icon-circle-solid",
    nRadio: "absolute inset-0 opacity-0 pointer-events-none",
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
        radio: "before:border-slate-300",
        content: "text-slate-900",
      },
      dark: {
        radio: "before:border-zinc-600",
        content: "text-zinc-50",
      },
    },
    size: {
      sm: {
        radio: "size-4",
        iconWrapper: "size-2",
        iDefault: "size-2",
        _iLoading: "size-2.5",
        content: "text-sm",
      },
      md: {
        radio: "size-5",
        iconWrapper: "size-2.5",
        iDefault: "size-2.5",
        _iLoading: "size-3",
        content: "text-base",
      },
      lg: {
        radio: "size-6",
        iconWrapper: "size-3",
        iDefault: "size-3",
        _iLoading: "size-3.5",
        content: "text-lg",
      },
    },
    isSelected: {
      true: {
        iconWrapper: "opacity-100 scale-100",
      },
      false: {
        iconWrapper: "opacity-0 scale-50 pointer-events-none",
      },
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
      false: {
        base: "",
      },
    },
    isLoading: {
      true: {
        base: "cursor-wait",
        iconWrapper: "opacity-100 scale-100",
      },
      false: {
        base: "",
      },
      auto: {
        base: "",
      },
    },
  },
  compoundVariants: [
    {
      color: "default",
      tone: "default",
      class: { iconWrapper: "text-slate-700", _iLoading: "text-slate-700" },
    },
    {
      color: "default",
      tone: "dark",
      class: { iconWrapper: "text-zinc-100", _iLoading: "text-zinc-100" },
    },
    {
      color: "primary",
      tone: "default",
      class: { iconWrapper: "text-primary", _iLoading: "text-primary" },
    },
    {
      color: "primary",
      tone: "dark",
      class: { iconWrapper: "text-primary-300", _iLoading: "text-primary-300" },
    },
    {
      color: "secondary",
      tone: "default",
      class: { iconWrapper: "text-secondary", _iLoading: "text-secondary" },
    },
    {
      color: "secondary",
      tone: "dark",
      class: { iconWrapper: "text-secondary-300", _iLoading: "text-secondary-300" },
    },
    {
      color: "success",
      tone: "default",
      class: { iconWrapper: "text-success", _iLoading: "text-success" },
    },
    {
      color: "success",
      tone: "dark",
      class: { iconWrapper: "text-success-300", _iLoading: "text-success-300" },
    },
    {
      color: "warning",
      tone: "default",
      class: { iconWrapper: "text-warning", _iLoading: "text-warning" },
    },
    {
      color: "warning",
      tone: "dark",
      class: { iconWrapper: "text-warning-300", _iLoading: "text-warning-300" },
    },
    {
      color: "danger",
      tone: "default",
      class: { iconWrapper: "text-danger", _iLoading: "text-danger" },
    },
    {
      color: "danger",
      tone: "dark",
      class: { iconWrapper: "text-danger-300", _iLoading: "text-danger-300" },
    },
    {
      color: "default",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-slate-400" },
    },
    {
      color: "default",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-zinc-500" },
    },
    {
      color: "primary",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-primary-200" },
    },
    {
      color: "secondary",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-secondary-200" },
    },
    {
      color: "success",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-success-200" },
    },
    {
      color: "warning",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-warning-200" },
    },
    {
      color: "danger",
      tone: "default",
      isSelected: true,
      class: { radio: "before:border-danger-200" },
    },
    {
      color: "primary",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-primary-600" },
    },
    {
      color: "secondary",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-secondary-600" },
    },
    {
      color: "success",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-success-600" },
    },
    {
      color: "warning",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-warning-600" },
    },
    {
      color: "danger",
      tone: "dark",
      isSelected: true,
      class: { radio: "before:border-danger-600" },
    },
    {
      isLoading: true,
      class: { _iLoading: "opacity-80 animate-spin" },
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

export const radioGroup = tv({
  base: "flex gap-2",
  variants: {
    orientation: {
      y: "flex-col",
      x: "flex-row gap-4",
    },
    isBlock: {
      true: "w-full",
    },
  },
  defaultVariants: {
    orientation: "y",
    isBlock: false,
  },
});

export type RadioVariants = VariantProps<typeof radio>;
export type RadioClasses = VariantClasses<typeof radio>;
export type RadioGroupVariants = VariantProps<typeof radioGroup>;
