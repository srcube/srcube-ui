import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const popover = tv({
  slots: {
    base: 'relative inline-flex',
    trigger: 'inline-flex',
    layer: 'absolute z-50',
    content: 'min-w-40 rounded-xl border border-slate-200 bg-white p-3 shadow-xl',
    title: 'text-sm font-semibold text-slate-900',
    description: 'mt-1 text-xs text-slate-600',
    arrow: 'absolute h-2 w-2 rotate-45 border border-slate-200 bg-white',
    backdrop: 'fixed inset-0 z-40 bg-transparent',
  },
  variants: {
    placement: {
      top: {
        layer: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
        arrow: '-bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0',
      },
      bottom: {
        layer: 'left-1/2 top-full mt-2 -translate-x-1/2',
        arrow: '-top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0',
      },
      left: {
        layer: 'right-full top-1/2 mr-2 -translate-y-1/2',
        arrow: '-right-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0',
      },
      right: {
        layer: 'left-full top-1/2 ml-2 -translate-y-1/2',
        arrow: '-left-1 top-1/2 -translate-y-1/2 border-t-0 border-r-0',
      },
    },
    size: {
      sm: {
        content: 'min-w-32 p-2',
        title: 'text-xs',
        description: 'text-[11px]',
      },
      md: {
        content: 'min-w-40 p-3',
        title: 'text-sm',
        description: 'text-xs',
      },
      lg: {
        content: 'min-w-48 p-4',
        title: 'text-base',
        description: 'text-sm',
      },
    },
    hasArrow: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    placement: 'bottom',
    size: 'md',
    hasArrow: true,
  },
});

export type PopoverVariants = VariantProps<typeof popover>;
export type PopoverClasses = VariantClasses<typeof popover>;
export type PopoverClassNames = PopoverClasses;
export type PopoverReactClassNames = PopoverClassNames;
export type PopoverMiniClassNames = PopoverClassNames;
