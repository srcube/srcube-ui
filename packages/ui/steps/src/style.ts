import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export const stepsStyle = tv({
  slots: {
    base: 'w-full',
    list: 'w-full',
    item: 'relative min-w-0',
    indicatorWrap: 'relative',
    indicator:
      'inline-flex items-center justify-center rounded-full border font-medium transition-colors duration-150',
    line: 'absolute bg-slate-200',
    content: 'min-w-0',
    title: 'truncate',
    description: 'text-slate-500',
  },
  variants: {
    direction: {
      horizontal: {
        list: 'flex w-full items-start',
        item: 'flex flex-1 flex-col items-center',
        indicatorWrap: 'flex w-full flex-col items-center',
        line: 'left-1/2 top-1/2 h-px w-full -translate-y-1/2',
        content: 'mt-2 text-center',
      },
      vertical: {
        list: 'flex w-full flex-col',
        item: 'flex items-start gap-3 pb-6',
        indicatorWrap: 'shrink-0',
        line: 'left-1/2 top-5 h-full w-px -translate-x-1/2',
        content: 'flex-1 pt-0.5 text-left',
      },
    },
    size: {
      sm: {
        indicator: 'h-5 w-5 text-[11px]',
        title: 'text-xs',
        description: 'mt-0.5 text-[11px]',
      },
      md: {
        indicator: 'h-6 w-6 text-xs',
        title: 'text-sm',
        description: 'mt-0.5 text-xs',
      },
      lg: {
        indicator: 'h-7 w-7 text-sm',
        title: 'text-base',
        description: 'mt-1 text-sm',
      },
    },
    status: {
      wait: {
        indicator: 'border-slate-300 bg-white text-slate-400',
        title: 'text-slate-400',
        description: 'text-slate-400',
        line: 'bg-slate-200',
      },
      process: {
        indicator: 'border-primary bg-primary text-white shadow-sm',
        title: 'font-semibold text-primary',
        description: 'text-slate-500',
        line: 'bg-slate-200',
      },
      finish: {
        indicator: 'border-primary bg-primary text-white',
        title: 'text-slate-900',
        description: 'text-slate-500',
        line: 'bg-primary',
      },
      error: {
        indicator: 'border-danger bg-danger text-white',
        title: 'text-danger',
        description: 'text-danger',
        line: 'bg-danger/40',
      },
    },
    isDot: {
      true: {
        indicator: 'h-2.5 w-2.5 border-none p-0 text-[0]',
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
  },
  compoundVariants: [
    {
      isDot: true,
      status: 'wait',
      class: {
        indicator: 'bg-slate-300',
      },
    },
    {
      isDot: true,
      status: 'process',
      class: {
        indicator: 'bg-primary',
      },
    },
    {
      isDot: true,
      status: 'finish',
      class: {
        indicator: 'bg-primary',
      },
    },
    {
      isDot: true,
      status: 'error',
      class: {
        indicator: 'bg-danger',
      },
    },
  ],
  defaultVariants: {
    direction: 'horizontal',
    size: 'md',
    status: 'wait',
    isDot: false,
    isLast: false,
  },
});

export type StepsVariants = VariantProps<typeof stepsStyle>;
export type StepsClasses = VariantClasses<typeof stepsStyle>;
export type StepsClassNames = StepsClasses;
export type StepsReactClassNames = StepsClassNames;
export type StepsMiniClassNames = StepsClassNames;
