import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

const TAB_COLORS = [
  {
    color: 'default',
    containerBg: 'bg-slate-100',
    defaultIndicatorBg: 'bg-white',
    twotoneIndicatorBg: 'bg-slate-100',
    indicatorBorder: 'border-slate-300',
    text: 'text-slate-700',
  },
  {
    color: 'primary',
    containerBg: 'bg-primary/10',
    defaultIndicatorBg: 'bg-primary',
    twotoneIndicatorBg: 'bg-primary/10',
    indicatorBorder: 'border-primary',
    text: 'text-primary',
  },
  {
    color: 'secondary',
    containerBg: 'bg-secondary/10',
    defaultIndicatorBg: 'bg-secondary',
    twotoneIndicatorBg: 'bg-secondary/10',
    indicatorBorder: 'border-secondary',
    text: 'text-secondary',
  },
  {
    color: 'success',
    containerBg: 'bg-success/10',
    defaultIndicatorBg: 'bg-success',
    twotoneIndicatorBg: 'bg-success/10',
    indicatorBorder: 'border-success',
    text: 'text-success',
  },
  {
    color: 'warning',
    containerBg: 'bg-warning/10',
    defaultIndicatorBg: 'bg-warning',
    twotoneIndicatorBg: 'bg-warning/10',
    indicatorBorder: 'border-warning',
    text: 'text-warning',
  },
  {
    color: 'danger',
    containerBg: 'bg-danger/10',
    defaultIndicatorBg: 'bg-danger',
    twotoneIndicatorBg: 'bg-danger/10',
    indicatorBorder: 'border-danger',
    text: 'text-danger',
  },
] as const;

export const tabs = tv({
  slots: {
    base: 'flex w-full min-w-0',
    tabsWrapper:
      'relative inline-flex w-fit max-w-full overflow-hidden border-0',
    $scrollbox: '',
    scrollbox: 'h-full overflow-visible',
    scrollboxContent: '',
    tabsList: 'relative',
    tab: 'absolute left-0 top-0 z-10 inline-flex cursor-pointer items-center justify-center border-none bg-transparent px-3 py-1.5 outline-none select-none',
    tabLabel:
      'relative z-10 w-full whitespace-nowrap text-center transition-colors',
    indicator:
      'pointer-events-none absolute left-0 top-0 z-0 border border-transparent transition-all duration-200 ease-out',
    panels: 'min-w-0 flex-1',
    panel: 'w-full px-1 py-3',
  },
  variants: {
    orientation: {
      x: {
        $scrollbox: 'w-fit max-w-full min-w-0',
        scrollbox: 'w-fit max-w-full',
        scrollboxContent: 'h-full',
        tabsList: 'h-full',
      },
      y: {
        tabsWrapper: 'h-full w-40 shrink-0',
        $scrollbox: 'h-full min-h-0 w-full min-w-0',
        scrollbox: 'h-full w-full',
        scrollboxContent: 'w-full',
        tabsList: 'w-full',
      },
    },
    size: {
      sm: {
        tabsWrapper: 'p-0.5',
        tab: 'min-h-7 px-2',
        tabLabel: 'text-xs',
      },
      md: {
        tabsWrapper: 'p-1',
        tab: 'min-h-8 px-3',
        tabLabel: 'text-sm',
      },
      lg: {
        tabsWrapper: 'p-1.5',
        tab: 'min-h-9 px-4',
        tabLabel: 'text-base',
      },
    },
    radius: {
      none: {
        tabsWrapper: 'rounded-none',
        tab: 'rounded-none',
        indicator: 'rounded-none',
        panel: 'rounded-none',
      },
      sm: {
        tabsWrapper: 'rounded-lg',
        tab: 'rounded-md',
        indicator: 'rounded-md',
        panel: 'rounded-md',
      },
      md: {
        tabsWrapper: 'rounded-xl',
        tab: 'rounded-lg',
        indicator: 'rounded-lg',
        panel: 'rounded-lg',
      },
      lg: {
        tabsWrapper: 'rounded-2xl',
        tab: 'rounded-xl',
        indicator: 'rounded-xl',
        panel: 'rounded-xl',
      },
      full: {
        tabsWrapper: 'rounded-full',
        tab: 'rounded-full',
        indicator: 'rounded-full',
        panel: 'rounded-xl',
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
      default: {},
      outline: {
        indicator: 'border-2 bg-transparent',
      },
      twotone: {
        indicator: 'border-2',
      },
      flat: {
        indicator: 'border-0',
      },
      underline: {
        indicator: 'rounded-none border-0 bg-transparent',
      },
    },
    placement: {
      top: {
        base: 'flex-col',
      },
      start: {
        tabsWrapper: 'flex-col',
        panel: 'px-3 py-0',
      },
      end: {
        base: 'flex-row-reverse',
        tabsWrapper: 'flex-col',
        panel: 'px-3 py-0',
      },
      bottom: {
        base: 'flex-col-reverse',
      },
    },
    isDisabled: {
      true: {
        base: 'pointer-events-none opacity-60',
      },
      false: {},
    },
  },
  defaultVariants: {
    orientation: 'x',
    size: 'md',
    radius: 'md',
    color: 'default',
    variant: 'default',
    placement: 'top',
    isDisabled: false,
  },
  compoundVariants: [
    {
      orientation: 'x',
      size: 'sm',
      class: {
        scrollbox: 'h-7',
      },
    },
    {
      orientation: 'x',
      size: 'md',
      class: {
        scrollbox: 'h-8',
      },
    },
    {
      orientation: 'x',
      size: 'lg',
      class: {
        scrollbox: 'h-9',
      },
    },
    {
      variant: 'underline',
      orientation: 'x',
      placement: 'top',
      class: {
        indicator: 'border-b-2',
      },
    },
    {
      variant: 'underline',
      orientation: 'x',
      placement: 'bottom',
      class: {
        indicator: 'border-t-2',
      },
    },
    {
      variant: 'underline',
      orientation: 'y',
      placement: 'start',
      class: {
        indicator: 'border-r-2',
      },
    },
    {
      variant: 'underline',
      orientation: 'y',
      placement: 'end',
      class: {
        indicator: 'border-l-2',
      },
    },
    ...TAB_COLORS.flatMap((tone) => [
      {
        color: tone.color,
        class: {
          tabsWrapper: tone.containerBg,
        },
      },
      {
        color: tone.color,
        variant: 'default',
        class: {
          indicator: tone.defaultIndicatorBg,
        },
      },
      {
        color: tone.color,
        variant: 'outline',
        class: {
          indicator: tone.indicatorBorder,
        },
      },
      {
        color: tone.color,
        variant: 'twotone',
        class: {
          indicator: `${tone.indicatorBorder} ${tone.twotoneIndicatorBg}`,
        },
      },
      {
        color: tone.color,
        variant: 'flat',
        class: {
          indicator: tone.twotoneIndicatorBg,
        },
      },
      {
        color: tone.color,
        variant: 'underline',
        class: {
          indicator: tone.indicatorBorder,
        },
      },
    ]),
    {
      variant: 'twotone',
      class: {
        tabsWrapper: 'bg-transparent',
      },
    },
    {
      variant: 'flat',
      class: {
        tabsWrapper: 'bg-transparent',
      },
    },
    {
      variant: 'underline',
      class: {
        tabsWrapper: 'bg-transparent',
      },
    },
  ],
});

export const tabsTabState = tv({
  base: '',
  variants: {
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    variant: {
      default: {},
      outline: {},
      twotone: {},
      flat: {},
      underline: {},
    },
    isSelected: {
      true: 'font-semibold',
      false: 'text-slate-500',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-45',
      false: 'cursor-pointer',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      color: 'default',
      isSelected: true,
      class: 'text-slate-900',
    },
    {
      variant: 'default',
      color: ['primary', 'secondary', 'success', 'warning', 'danger'],
      isSelected: true,
      class: 'text-white',
    },
    ...TAB_COLORS.map((tone) => ({
      variant: ['outline', 'twotone', 'flat', 'underline'] as const,
      color: tone.color,
      isSelected: true,
      class: tone.text,
    })),
    {
      isSelected: false,
      isDisabled: false,
      class: 'hover:text-slate-700',
    },
  ],
  defaultVariants: {
    color: 'default',
    variant: 'default',
    isSelected: false,
    isDisabled: false,
  },
});

export const tabPanel = tv({
  slots: {
    base: 'w-full',
  },
  variants: {
    isActive: {
      true: {
        base: 'block',
      },
      false: {
        base: 'hidden',
      },
    },
  },
  defaultVariants: {
    isActive: true,
  },
});

export type TabsVariants = VariantProps<typeof tabs>;
export type TabsClasses = VariantClasses<typeof tabs>;
export type TabsClassNames = TabsClasses;

export type TabPanelVariants = VariantProps<typeof tabPanel>;
export type TabPanelClasses = VariantClasses<typeof tabPanel>;
export type TabPanelClassNames = TabPanelClasses;
