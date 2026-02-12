import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const tabs = tv({
  slots: {
    base: 'flex w-full',
    tabsWrapper: 'inline-flex relative w-fit max-w-full overflow-hidden p-1',
    tabsList: 'relative flex w-full h-fit box-border',
    tab: 'relative z-0 inline-flex w-full cursor-pointer items-center justify-center border-none bg-transparent px-3 py-1.5 outline-none select-none transition-opacity',
    tabLabel: 'relative z-10 w-full whitespace-nowrap text-center transition-colors',
    indicator:
      'pointer-events-none absolute left-0 top-0 z-0 border border-transparent transition-all duration-200 ease-out',
    panels: 'min-w-0 flex-1',
    panel: 'w-full px-1 py-3',
  },
  variants: {
    orientation: {
      x: {
        base: 'flex-col gap-3',
        tabsWrapper: 'w-full',
        tabsList: 'flex-row items-center',
        tab: 'flex-1',
      },
      y: {
        base: 'flex-row items-stretch gap-3',
        tabsWrapper: 'w-40 shrink-0',
        tabsList: 'h-full flex-col',
        tab: 'justify-start',
        tabLabel: 'text-left',
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
        tabsWrapper: 'p-1',
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
      default: {
        tabsWrapper: 'bg-slate-100',
        indicator: 'bg-white',
      },
      primary: {
        tabsWrapper: 'bg-primary-100/60',
        indicator: 'bg-primary',
      },
      secondary: {
        tabsWrapper: 'bg-secondary-100/60',
        indicator: 'bg-secondary',
      },
      success: {
        tabsWrapper: 'bg-success-100/60',
        indicator: 'bg-success',
      },
      warning: {
        tabsWrapper: 'bg-warning-100/70',
        indicator: 'bg-warning',
      },
      danger: {
        tabsWrapper: 'bg-danger-100/60',
        indicator: 'bg-danger',
      },
    },
    isDisabled: {
      true: {
        base: 'opacity-60 pointer-events-none',
      },
      false: {},
    },
  },
  defaultVariants: {
    orientation: 'x',
    size: 'md',
    radius: 'md',
    color: 'default',
    isDisabled: false,
  },
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
      color: 'default',
      isSelected: true,
      class: 'text-slate-900',
    },
    {
      color: ['primary', 'secondary', 'success', 'warning', 'danger'],
      isSelected: true,
      class: 'text-white',
    },
    {
      isSelected: false,
      isDisabled: false,
      class: 'hover:text-slate-700',
    },
  ],
  defaultVariants: {
    color: 'default',
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
