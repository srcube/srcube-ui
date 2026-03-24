import { tv, type VariantClasses, type VariantProps } from "../../shared/tv";

export const textareaStyle = tv({
  slots: {
    control: "",
    endContent: "self-end h-[1.5em] leading-[1.5em]",
    clearButton: "self-end h-[1.5em] leading-[1.5em]",
    endMeta: "flex items-end gap-1 h-[1.5em] leading-[1.5em]",
    count: "shrink-0 text-xs leading-[1.5em] text-slate-500 tabular-nums",
    textarea:
      "block flex-1 min-w-0 resize-none border-none bg-transparent text-inherit outline-none whitespace-pre-wrap break-words placeholder:text-slate-400",
  },
  variants: {
    tone: {
      default: {},
      dark: {
        count: "text-zinc-400",
        textarea: "placeholder:text-zinc-500",
      },
    },
    size: {
      sm: {
        textarea: "leading-5",
      },
      md: {
        textarea: "leading-6",
      },
      lg: {
        textarea: "leading-7",
      },
    },
    isAutoHeight: {
      true: {
        textarea: "overflow-hidden",
      },
      false: {},
    },
    isDisabled: {
      true: {
        textarea: "cursor-not-allowed",
        count: "text-slate-400",
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
    isAutoHeight: false,
    isDisabled: false,
  },
});

export type TextareaVariants = VariantProps<typeof textareaStyle>;
export type TextareaClasses = VariantClasses<typeof textareaStyle>;
export type TextareaClassNames = TextareaClasses;
