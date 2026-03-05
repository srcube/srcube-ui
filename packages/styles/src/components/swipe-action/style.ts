import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const swipeAction = tv({
  slots: {
    base: 'relative isolate w-full overflow-hidden',
    actions: 'pointer-events-none absolute inset-y-0 z-0 flex overflow-hidden',
    leftActions: 'left-0 flex-row',
    rightActions: 'right-0 flex-row-reverse',
    action: 'pointer-events-auto h-full',
    actionButton: 'h-full min-h-full rounded-none',
    actionIcon: 'shrink-0 text-base',
    actionLabel: 'truncate',
    content:
      'relative z-[1] w-full touch-pan-y select-none transition-transform duration-200 will-change-transform',
  },
  variants: {
    color: {
      default: {
        content: 'bg-white text-slate-900',
      },
      primary: {
        content: 'bg-white text-primary',
      },
      secondary: {
        content: 'bg-white text-secondary',
      },
      success: {
        content: 'bg-white text-success',
      },
      warning: {
        content: 'bg-white text-warning',
      },
      danger: {
        content: 'bg-white text-danger',
      },
    },
    size: {
      sm: {
        actionButton: 'px-2',
        content: 'min-h-10',
      },
      md: {
        actionButton: 'px-3',
        content: 'min-h-11',
      },
      lg: {
        actionButton: 'px-4',
        content: 'min-h-12',
      },
    },
    isDisabled: {
      true: {
        base: 'cursor-not-allowed opacity-60',
      },
      false: {},
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
    isDisabled: false,
  },
});

export const swipeActionActionTone = tv({
  base: 'flex h-full w-full items-center justify-center px-3 text-center font-medium leading-none transition-opacity duration-150 active:opacity-90',
  variants: {
    variant: {
      solid: '',
      soft: '',
      outline: 'border-2 bg-transparent',
    },
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    isDisabled: {
      true: 'pointer-events-none opacity-50',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'default',
      class: 'bg-slate-700 text-white',
    },
    {
      variant: 'solid',
      color: 'primary',
      class: 'bg-primary text-white',
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: 'bg-secondary text-white',
    },
    {
      variant: 'solid',
      color: 'success',
      class: 'bg-success text-white',
    },
    {
      variant: 'solid',
      color: 'warning',
      class: 'bg-warning text-white',
    },
    {
      variant: 'solid',
      color: 'danger',
      class: 'bg-danger text-white',
    },
    {
      variant: 'soft',
      color: 'default',
      class: 'bg-slate-200 text-slate-700',
    },
    {
      variant: 'soft',
      color: 'primary',
      class: 'bg-primary/20 text-primary',
    },
    {
      variant: 'soft',
      color: 'secondary',
      class: 'bg-secondary/20 text-secondary',
    },
    {
      variant: 'soft',
      color: 'success',
      class: 'bg-success/20 text-success',
    },
    {
      variant: 'soft',
      color: 'warning',
      class: 'bg-warning/20 text-warning',
    },
    {
      variant: 'soft',
      color: 'danger',
      class: 'bg-danger/20 text-danger',
    },
    {
      variant: 'outline',
      color: 'default',
      class: 'border-slate-400 text-slate-700',
    },
    {
      variant: 'outline',
      color: 'primary',
      class: 'border-primary text-primary',
    },
    {
      variant: 'outline',
      color: 'secondary',
      class: 'border-secondary text-secondary',
    },
    {
      variant: 'outline',
      color: 'success',
      class: 'border-success text-success',
    },
    {
      variant: 'outline',
      color: 'warning',
      class: 'border-warning text-warning',
    },
    {
      variant: 'outline',
      color: 'danger',
      class: 'border-danger text-danger',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'default',
    size: 'md',
    isDisabled: false,
  },
});

export type SwipeActionVariants = VariantProps<typeof swipeAction>;
export type SwipeActionClasses = VariantClasses<typeof swipeAction>;
export type SwipeActionClassNames = SwipeActionClasses;

export type SwipeActionReactClassNames = SwipeActionClassNames;
export type SwipeActionMiniClassNames = SwipeActionClassNames;

export type SwipeActionActionToneVariants = VariantProps<
  typeof swipeActionActionTone
>;
export type SwipeActionActionToneColors = NonNullable<
  SwipeActionActionToneVariants['color']
>;
