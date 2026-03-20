import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const checkbox = tv({
  slots: {
    base: "relative inline-flex items-center gap-2 select-none",
    checkbox: [
      "relative flex shrink-0 items-center justify-center",
      "before:absolute before:inset-0 before:border-2",
      "after:absolute after:inset-0 after:transition after:duration-200 after:opacity-0 after:scale-50",
    ],
    spinner: "icon-spinner z-10 text-current",
    content: "relative text-sm",
    iconWrapper:
      "relative z-10 flex items-center justify-center transition duration-200 opacity-0 scale-50 invisible pointer-events-none",
    iDefault: "icon-check w-[inherit] h-[inherit]",
    iIndeterminate: "icon-indeterminate w-[inherit] h-[inherit]",
    nCheckbox: "absolute inset-0 opacity-0 pointer-events-none",
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
        checkbox: "before:border-slate-300",
        spinner: "text-slate-700",
        content: "text-slate-900",
      },
      dark: {
        checkbox: "before:border-zinc-600",
        spinner: "text-zinc-50",
        content: "text-zinc-50",
      },
    },
    size: {
      sm: {
        checkbox: "size-4",
        iconWrapper: "size-2",
        content: "text-sm",
      },
      md: {
        checkbox: "size-5",
        iconWrapper: "size-2.5",
        content: "text-base",
      },
      lg: {
        checkbox: "size-6",
        iconWrapper: "size-3",
        content: "text-lg",
      },
    },
    radius: {
      none: {
        checkbox: "before:rounded-none after:rounded-none",
      },
      sm: {
        checkbox: "before:rounded-md after:rounded-md",
      },
      md: {
        checkbox: "before:rounded-lg after:rounded-lg",
      },
      lg: {
        checkbox: "before:rounded-xl after:rounded-xl",
      },
      full: {
        checkbox: "before:rounded-full after:rounded-full",
      },
    },
    isSelected: {
      true: {
        iconWrapper: "opacity-100 scale-100 visible pointer-events-auto",
        checkbox: "after:opacity-100 after:scale-100",
      },
      false: {},
    },
    isIndeterminate: {
      true: {
        iconWrapper: "opacity-100 scale-100 visible pointer-events-auto",
        checkbox: "after:opacity-100 after:scale-100",
      },
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
      false: {
        base: "",
      },
    },
    isLoading: {
      true: {
        base: "cursor-wait",
      },
      false: {
        base: "",
      },
      auto: {
        base: "",
      },
    },
    isLineThrough: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      color: "default",
      tone: "default",
      class: {
        checkbox: "after:bg-slate-300",
        iconWrapper: "text-slate-700",
      },
    },
    {
      color: "default",
      tone: "dark",
      class: {
        checkbox: "after:bg-zinc-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: "primary",
      tone: "default",
      class: {
        checkbox: "after:bg-primary",
        iconWrapper: "text-white",
      },
    },
    {
      color: "primary",
      tone: "dark",
      class: {
        checkbox: "after:bg-primary-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: "secondary",
      tone: "default",
      class: {
        checkbox: "after:bg-secondary",
        iconWrapper: "text-white",
      },
    },
    {
      color: "secondary",
      tone: "dark",
      class: {
        checkbox: "after:bg-secondary-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: "success",
      tone: "default",
      class: {
        checkbox: "after:bg-success",
        iconWrapper: "text-white",
      },
    },
    {
      color: "success",
      tone: "dark",
      class: {
        checkbox: "after:bg-success-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: "warning",
      tone: "default",
      class: {
        checkbox: "after:bg-warning",
        iconWrapper: "text-white",
      },
    },
    {
      color: "warning",
      tone: "dark",
      class: {
        checkbox: "after:bg-warning-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: "danger",
      tone: "default",
      class: {
        checkbox: "after:bg-danger",
        iconWrapper: "text-white",
      },
    },
    {
      color: "danger",
      tone: "dark",
      class: {
        checkbox: "after:bg-danger-600",
        iconWrapper: "text-white",
      },
    },
    {
      color: ["primary", "secondary", "success", "warning", "danger"],
      class: {
        spinner: "text-white",
      },
    },
    {
      isLoading: true,
      class: { spinner: "opacity-80" },
    },
    {
      isLineThrough: true,
      isSelected: true,
      tone: "default",
      class: {
        content: [
          "before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300",
          "text-slate-500",
        ],
      },
    },
    {
      isLineThrough: true,
      isIndeterminate: true,
      tone: "default",
      class: {
        content: [
          "before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300",
          "text-slate-500",
        ],
      },
    },
    {
      isLineThrough: true,
      isSelected: true,
      tone: "dark",
      class: {
        content: [
          "before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300",
          "text-zinc-400",
        ],
      },
    },
    {
      isLineThrough: true,
      isIndeterminate: true,
      tone: "dark",
      class: {
        content: [
          "before:absolute before:top-1/2 before:h-0.5 before:w-full before:bg-current before:transition before:duration-300",
          "text-zinc-400",
        ],
      },
    },
  ],
  defaultVariants: {
    color: "default",
    tone: "default",
    size: "md",
    radius: "md",
    isSelected: false,
    isIndeterminate: false,
    isDisabled: false,
    isReadOnly: false,
    isLoading: false,
    isLineThrough: false,
  },
});

export const checkboxGroup = tv({
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

export type CheckboxVariants = VariantProps<typeof checkbox>;
export type CheckboxClasses = VariantClasses<typeof checkbox>;
export type CheckboxGroupVariants = VariantProps<typeof checkboxGroup>;
