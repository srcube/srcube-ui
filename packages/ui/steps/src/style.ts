import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

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
      variant: 'flat',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-slate-200 text-slate-500',
      },
    },
    {
      variant: 'text',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-slate-400',
      },
    },
    {
      variant: 'twotone',
      status: 'wait',
      isDot: false,
      class: {
        indicator: 'border-slate-200 bg-slate-100 text-slate-500',
      },
    },
    {
      variant: 'outline',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger bg-white text-danger',
      },
    },
    {
      variant: 'flat',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-danger-100 text-danger',
      },
    },
    {
      variant: 'text',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-transparent bg-transparent text-danger',
      },
    },
    {
      variant: 'twotone',
      status: 'error',
      isDot: false,
      class: {
        indicator: 'border-danger bg-danger-100 text-danger',
      },
    },
    {
      isDot: true,
      status: 'wait',
      class: {
        indicator: 'bg-slate-300',
      },
    },
    {
      isDot: true,
      status: 'error',
      class: {
        indicator: 'bg-danger',
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
    ...STEP_COLORS.flatMap((tone) => [
      {
        color: tone.color,
        status: 'error' as const,
        class: {
          lineStart: tone.line,
          lineEnd: 'bg-slate-200',
        },
      },
      {
        color: tone.color,
        status: 'process' as const,
        class: {
          title: tone.title,
          lineStart: tone.line,
        },
      },
      {
        color: tone.color,
        status: 'finish' as const,
        class: {
          lineStart: tone.line,
          lineEnd: tone.line,
        },
      },
      {
        color: tone.color,
        status: 'process' as const,
        variant: 'solid' as const,
        isDot: false,
        class: {
          indicator: `${tone.solidIndicator} shadow-sm`,
        },
      },
      {
        color: tone.color,
        status: 'finish' as const,
        variant: 'solid' as const,
        isDot: false,
        class: {
          indicator: tone.solidIndicator,
        },
      },
      {
        color: tone.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'outline' as const,
        isDot: false,
        class: {
          indicator: tone.outlineIndicator,
        },
      },
      {
        color: tone.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'flat' as const,
        isDot: false,
        class: {
          indicator: tone.flatIndicator,
        },
      },
      {
        color: tone.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'text' as const,
        isDot: false,
        class: {
          indicator: tone.textIndicator,
        },
      },
      {
        color: tone.color,
        status: PROCESS_AND_FINISH_STATUSES,
        variant: 'twotone' as const,
        isDot: false,
        class: {
          indicator: tone.twotoneIndicator,
        },
      },
      {
        color: tone.color,
        status: PROCESS_AND_FINISH_STATUSES,
        isDot: true,
        class: {
          indicator: tone.dotIndicator,
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
