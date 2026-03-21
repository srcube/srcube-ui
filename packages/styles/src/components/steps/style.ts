import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error';
export type StepColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
export type StepVariant = 'solid' | 'outline' | 'flat' | 'text' | 'twotone';
const PROCESS_AND_FINISH_STATUSES: StepStatus[] = ['process', 'finish'];

const STEP_COLORS: Array<{
  tone: 'default' | 'dark';
  color: StepColor;
  line: string;
  title: string;
  solidIndicator: string;
  outlineIndicator: string;
  flatIndicator: string;
  textIndicator: string;
  twotoneIndicator: string;
  dotIndicator: string;
}> = [
  {
    tone: 'default',
    color: 'default',
    line: 'bg-slate-500',
    title: 'text-slate-700',
    solidIndicator: 'border-slate-700 bg-slate-700 text-white',
    outlineIndicator: 'border-slate-500 bg-white text-slate-700',
    flatIndicator: 'border-transparent bg-slate-200 text-slate-700',
    textIndicator: 'border-transparent bg-transparent text-slate-700',
    twotoneIndicator: 'border-slate-700 bg-slate-100 text-slate-700',
    dotIndicator: 'bg-slate-700',
  },
  {
    tone: 'default',
    color: 'primary',
    line: 'bg-primary',
    title: 'text-primary',
    solidIndicator: 'border-primary bg-primary text-white',
    outlineIndicator: 'border-primary bg-white text-primary',
    flatIndicator: 'border-transparent bg-primary-100 text-primary',
    textIndicator: 'border-transparent bg-transparent text-primary',
    twotoneIndicator: 'border-primary bg-primary-100 text-primary',
    dotIndicator: 'bg-primary',
  },
  {
    tone: 'default',
    color: 'secondary',
    line: 'bg-secondary',
    title: 'text-secondary',
    solidIndicator: 'border-secondary bg-secondary text-white',
    outlineIndicator: 'border-secondary bg-white text-secondary',
    flatIndicator: 'border-transparent bg-secondary-100 text-secondary',
    textIndicator: 'border-transparent bg-transparent text-secondary',
    twotoneIndicator: 'border-secondary bg-secondary-100 text-secondary',
    dotIndicator: 'bg-secondary',
  },
  {
    tone: 'default',
    color: 'success',
    line: 'bg-success',
    title: 'text-success',
    solidIndicator: 'border-success bg-success text-white',
    outlineIndicator: 'border-success bg-white text-success',
    flatIndicator: 'border-transparent bg-success-100 text-success',
    textIndicator: 'border-transparent bg-transparent text-success',
    twotoneIndicator: 'border-success bg-success-100 text-success',
    dotIndicator: 'bg-success',
  },
  {
    tone: 'default',
    color: 'warning',
    line: 'bg-warning',
    title: 'text-warning',
    solidIndicator: 'border-warning bg-warning text-white',
    outlineIndicator: 'border-warning bg-white text-warning',
    flatIndicator: 'border-transparent bg-warning-100 text-warning',
    textIndicator: 'border-transparent bg-transparent text-warning',
    twotoneIndicator: 'border-warning bg-warning-100 text-warning',
    dotIndicator: 'bg-warning',
  },
  {
    tone: 'default',
    color: 'danger',
    line: 'bg-danger',
    title: 'text-danger',
    solidIndicator: 'border-danger bg-danger text-white',
    outlineIndicator: 'border-danger bg-white text-danger',
    flatIndicator: 'border-transparent bg-danger-100 text-danger',
    textIndicator: 'border-transparent bg-transparent text-danger',
    twotoneIndicator: 'border-danger bg-danger-100 text-danger',
    dotIndicator: 'bg-danger',
  },
  {
    tone: 'dark',
    color: 'default',
    line: 'bg-zinc-500',
    title: 'text-zinc-100',
    solidIndicator: 'border-zinc-100 bg-zinc-100 text-zinc-950',
    outlineIndicator: 'border-zinc-500 bg-zinc-950 text-zinc-100',
    flatIndicator: 'border-transparent bg-zinc-800 text-zinc-100',
    textIndicator: 'border-transparent bg-transparent text-zinc-100',
    twotoneIndicator: 'border-zinc-700 bg-zinc-900 text-zinc-100',
    dotIndicator: 'bg-zinc-100',
  },
  {
    tone: 'dark',
    color: 'primary',
    line: 'bg-primary-500',
    title: 'text-primary-100',
    solidIndicator: 'border-primary-600 bg-primary-600 text-white',
    outlineIndicator: 'border-primary-600 bg-zinc-950 text-primary-100',
    flatIndicator: 'border-transparent bg-primary-950 text-primary-100',
    textIndicator: 'border-transparent bg-transparent text-primary-100',
    twotoneIndicator: 'border-primary-700 bg-primary-950 text-primary-100',
    dotIndicator: 'bg-primary-300',
  },
  {
    tone: 'dark',
    color: 'secondary',
    line: 'bg-secondary-500',
    title: 'text-secondary-100',
    solidIndicator: 'border-secondary-600 bg-secondary-600 text-white',
    outlineIndicator: 'border-secondary-600 bg-zinc-950 text-secondary-100',
    flatIndicator: 'border-transparent bg-secondary-950 text-secondary-100',
    textIndicator: 'border-transparent bg-transparent text-secondary-100',
    twotoneIndicator: 'border-secondary-700 bg-secondary-950 text-secondary-100',
    dotIndicator: 'bg-secondary-300',
  },
  {
    tone: 'dark',
    color: 'success',
    line: 'bg-success-500',
    title: 'text-success-100',
    solidIndicator: 'border-success-600 bg-success-600 text-white',
    outlineIndicator: 'border-success-600 bg-zinc-950 text-success-100',
    flatIndicator: 'border-transparent bg-success-950 text-success-100',
    textIndicator: 'border-transparent bg-transparent text-success-100',
    twotoneIndicator: 'border-success-700 bg-success-950 text-success-100',
    dotIndicator: 'bg-success-300',
  },
  {
    tone: 'dark',
    color: 'warning',
    line: 'bg-warning-500',
    title: 'text-warning-100',
    solidIndicator: 'border-warning-600 bg-warning-600 text-black',
    outlineIndicator: 'border-warning-600 bg-zinc-950 text-warning-100',
    flatIndicator: 'border-transparent bg-warning-950 text-warning-100',
    textIndicator: 'border-transparent bg-transparent text-warning-100',
    twotoneIndicator: 'border-warning-700 bg-warning-950 text-warning-100',
    dotIndicator: 'bg-warning-300',
  },
  {
    tone: 'dark',
    color: 'danger',
    line: 'bg-danger-500',
    title: 'text-danger-100',
    solidIndicator: 'border-danger-600 bg-danger-600 text-white',
    outlineIndicator: 'border-danger-600 bg-zinc-950 text-danger-100',
    flatIndicator: 'border-transparent bg-danger-950 text-danger-100',
    textIndicator: 'border-transparent bg-transparent text-danger-100',
    twotoneIndicator: 'border-danger-700 bg-danger-950 text-danger-100',
    dotIndicator: 'bg-danger-300',
  },
];

export const stepsStyle = tv({
  slots: {
    base: 'w-full',
    list: 'w-full',
    item: 'relative min-w-0',
    indicatorWrap: 'relative',
    indicator:
      'relative z-[1] inline-flex items-center justify-center rounded-full border font-medium leading-none transition-colors duration-150',
    indicatorIcon: 'inline-flex leading-none',
    indicatorText: 'inline-flex items-center justify-center leading-none',
    line: '',
    lineStart: 'z-0 bg-slate-200',
    lineEnd: 'z-0 bg-slate-200',
    content: 'min-w-0',
    titleSpacer: 'hidden',
    title: 'truncate',
    description: 'text-slate-500',
  },
  variants: {
    orientation: {
      x: {
        list: 'flex w-full items-start',
        item: 'flex flex-1 flex-col items-center',
        indicatorWrap: 'relative flex w-full items-center gap-1',
        indicator: 'order-2',
        lineStart: 'order-1 h-px flex-1',
        lineEnd: 'order-3 h-px flex-1',
        content: 'mt-2 text-center',
      },
      y: {
        list: 'flex w-full flex-col',
        item: 'flex items-start gap-3',
        indicatorWrap:
          'relative z-[1] flex shrink-0 self-stretch flex-col items-center gap-1',
        indicator: 'order-2',
        lineStart: 'order-1 w-px flex-1',
        lineEnd: 'order-3 w-px flex-1',
        content: 'flex flex-1 flex-col pt-0.5 text-left',
        titleSpacer: 'block invisible',
      },
    },
    size: {
      sm: {
        indicator: 'h-5 w-5',
        indicatorText: 'text-[11px]',
        indicatorIcon: 'text-[11px]',
        title: 'text-xs',
        titleSpacer: 'text-[11px]',
        description: 'mt-0.5 text-[11px]',
      },
      md: {
        indicator: 'h-6 w-6',
        indicatorText: 'text-xs',
        indicatorIcon: 'text-xs',
        title: 'text-sm',
        titleSpacer: 'text-xs',
        description: 'mt-0.5 text-xs',
      },
      lg: {
        indicator: 'h-7 w-7',
        indicatorText: 'text-sm',
        indicatorIcon: 'text-sm',
        title: 'text-base',
        titleSpacer: 'text-sm',
        description: 'mt-1 text-sm',
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
      dark: {},
    },
    variant: {
      solid: {},
      outline: {},
      flat: {},
      text: {},
      twotone: {},
    },
    status: {
      wait: {
        indicator: 'border-slate-300 bg-white text-slate-400',
        title: 'text-slate-400',
        description: 'text-slate-400',
        lineStart: 'bg-slate-200',
        lineEnd: 'bg-slate-200',
      },
      process: {
        title: 'font-semibold',
        description: 'text-slate-500',
        lineEnd: 'bg-slate-200',
      },
      finish: {
        indicatorIcon: 'icon-steps-success',
        title: 'text-slate-900',
        description: 'text-slate-500',
      },
      error: {
        indicator: 'border-danger bg-danger text-white',
        indicatorIcon: 'icon-steps-error',
        title: 'text-danger',
        description: 'text-danger',
      },
    },
    isDot: {
      true: {
        indicator: 'border-none p-0 text-[0]',
      },
      false: {},
    },
    isLast: {
      true: {
        lineEnd: 'bg-transparent',
      },
      false: {},
    },
    isFirst: {
      true: {
        lineStart: 'bg-transparent',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: 'default',
      variant: 'flat',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-slate-200 text-slate-500',
      },
    },
    {
      tone: 'default',
      variant: 'text',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-slate-400',
      },
    },
    {
      tone: 'default',
      variant: 'twotone',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-slate-200 bg-slate-100 text-slate-500',
      },
    },
    {
      tone: 'default',
      variant: 'outline',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger bg-white text-danger',
      },
    },
    {
      tone: 'default',
      variant: 'flat',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-danger-100 text-danger',
      },
    },
    {
      tone: 'default',
      variant: 'text',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-danger',
      },
    },
    {
      tone: 'default',
      variant: 'twotone',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger bg-danger-100 text-danger',
      },
    },
    {
      tone: 'default',
      isDot: true,
      status: 'wait',
      class: {
        indicator: 'bg-slate-300',
      },
    },
    {
      tone: 'default',
      isDot: true,
      status: 'error',
      class: {
        indicator: 'bg-danger',
      },
    },
    {
      tone: 'dark',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-zinc-700 bg-zinc-950 text-zinc-500',
        title: 'text-zinc-500',
        description: 'text-zinc-500',
        lineStart: 'bg-zinc-800',
        lineEnd: 'bg-zinc-800',
      },
    },
    {
      tone: 'dark',
      status: 'process',
      class: {
        description: 'text-zinc-400',
        lineEnd: 'bg-zinc-800',
      },
    },
    {
      tone: 'dark',
      status: 'finish',
      class: {
        title: 'text-zinc-50',
        description: 'text-zinc-400',
      },
    },
    {
      tone: 'dark',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger-600 bg-danger-600 text-white',
        title: 'text-danger-200',
        description: 'text-danger-200',
      },
    },
    {
      tone: 'dark',
      variant: 'flat',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-zinc-900 text-zinc-400',
      },
    },
    {
      tone: 'dark',
      variant: 'text',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-zinc-500',
      },
    },
    {
      tone: 'dark',
      variant: 'twotone',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-zinc-800 bg-zinc-900 text-zinc-400',
      },
    },
    {
      tone: 'dark',
      variant: 'outline',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger-500 bg-zinc-950 text-danger-200',
      },
    },
    {
      tone: 'dark',
      variant: 'flat',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-danger-950 text-danger-200',
      },
    },
    {
      tone: 'dark',
      variant: 'text',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-danger-200',
      },
    },
    {
      tone: 'dark',
      variant: 'twotone',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger-700 bg-danger-950 text-danger-200',
      },
    },
    {
      tone: 'dark',
      isDot: true,
      status: 'wait',
      class: {
        indicator: 'bg-zinc-600',
      },
    },
    {
      tone: 'dark',
      isDot: true,
      status: 'error',
      class: {
        indicator: 'bg-danger-500',
      },
    },
    {
      orientation: 'x',
      size: 'sm',
      isDot: false,
      class: {
        indicatorWrap: 'gap-1',
      },
    },
    {
      orientation: 'x',
      size: 'md',
      isDot: false,
      class: {
        indicatorWrap: 'gap-1.5',
      },
    },
    {
      orientation: 'x',
      size: 'lg',
      isDot: false,
      class: {
        indicatorWrap: 'gap-2',
      },
    },
    {
      orientation: 'x',
      isDot: true,
      size: 'sm',
      class: {
        indicatorWrap: 'gap-0.5',
        indicator: 'h-1.5 w-1.5',
      },
    },
    {
      orientation: 'x',
      isDot: true,
      size: 'md',
      class: {
        indicatorWrap: 'gap-1',
        indicator: 'h-2 w-2',
      },
    },
    {
      orientation: 'x',
      isDot: true,
      size: 'lg',
      class: {
        indicatorWrap: 'gap-1.5',
        indicator: 'h-2.5 w-2.5',
      },
    },
    {
      orientation: 'y',
      size: 'sm',
      isDot: false,
      class: {
        indicatorWrap: 'w-5 gap-1',
        content: 'gap-1',
        description: 'mt-0',
      },
    },
    {
      orientation: 'y',
      size: 'md',
      isDot: false,
      class: {
        indicatorWrap: 'w-6 gap-1.5',
        content: 'gap-1.5',
        description: 'mt-0',
      },
    },
    {
      orientation: 'y',
      size: 'lg',
      isDot: false,
      class: {
        indicatorWrap: 'w-7 gap-2',
        content: 'gap-2',
        description: 'mt-0',
      },
    },
    {
      orientation: 'y',
      isDot: true,
      size: 'sm',
      class: {
        indicatorWrap: 'w-5 gap-1',
        content: 'gap-1',
        description: 'mt-0',
        indicator: 'h-1.5 w-1.5',
      },
    },
    {
      orientation: 'y',
      isDot: true,
      size: 'md',
      class: {
        indicatorWrap: 'w-6 gap-1',
        content: 'gap-1',
        description: 'mt-0',
        indicator: 'h-2 w-2',
      },
    },
    {
      orientation: 'y',
      isDot: true,
      size: 'lg',
      class: {
        indicatorWrap: 'w-7 gap-1.5',
        content: 'gap-1.5',
        description: 'mt-0',
        indicator: 'h-2.5 w-2.5',
      },
    },
    ...STEP_COLORS.flatMap((stepColor) => [
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: 'error' as const,
        class: {
          lineStart: stepColor.line,
          lineEnd: stepColor.tone === 'dark' ? 'bg-zinc-800' : 'bg-slate-200',
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: 'process' as const,
        class: {
          title: stepColor.title,
          lineStart: stepColor.line,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: 'finish' as const,
        class: {
          lineStart: stepColor.line,
          lineEnd: stepColor.line,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: 'process' as const,
        variant: 'solid' as const,
        isDot: false,
        class: {
          indicator: `${stepColor.solidIndicator} shadow-sm`,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: 'finish' as const,
        variant: 'solid' as const,
        isDot: false,
        class: {
          indicator: stepColor.solidIndicator,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'outline' as const,
        isDot: false,
        class: {
          indicator: stepColor.outlineIndicator,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'flat' as const,
        isDot: false,
        class: {
          indicator: stepColor.flatIndicator,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'text' as const,
        isDot: false,
        class: {
          indicator: stepColor.textIndicator,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'twotone' as const,
        isDot: false,
        class: {
          indicator: stepColor.twotoneIndicator,
        },
      },
      {
        tone: stepColor.tone,
        color: stepColor.color,
        status: PROCESS_AND_FINISH_STATUSES,
        isDot: true,
        class: {
          indicator: stepColor.dotIndicator,
        },
      },
    ]),
    {
      isFirst: true,
      class: {
        lineStart: 'bg-transparent',
      },
    },
  ],
  defaultVariants: {
    orientation: 'x',
    size: 'md',
    color: 'primary',
    tone: 'default',
    variant: 'solid',
    status: 'wait',
    isDot: false,
    isLast: false,
    isFirst: false,
  },
});

export type StepsVariants = VariantProps<typeof stepsStyle>;
export type StepsClasses = VariantClasses<typeof stepsStyle>;
export type StepsClassNames = StepsClasses;
export type StepsReactClassNames = StepsClassNames;
export type StepsMiniClassNames = StepsClassNames;
