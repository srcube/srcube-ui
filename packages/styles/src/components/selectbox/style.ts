import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const selectbox = tv({
  slots: {
    base: 'w-full',
    $listbox: 'w-full',
    listbox: 'w-full',
    item: '',
    itemLabel: '',
    itemIcon: 'icon-check shrink-0',
  },
  variants: {
    orientation: {
      y: {},
      x: {},
    },
    size: {
      sm: {
        itemIcon: 'text-sm',
      },
      md: {
        itemIcon: 'text-base',
      },
      lg: {
        itemIcon: 'text-lg',
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
  },
  defaultVariants: {
    orientation: 'y',
    size: 'md',
    color: 'default',
  },
});

export const selectboxItemState = tv({
  base: 'transition-colors duration-150',
  variants: {
    orientation: {
      y: '',
      x: '',
    },
    color: {
      default: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
      danger: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    isSelected: {
      true: '',
      false: '',
    },
    isDisabled: {
      true: 'opacity-40',
      false: '',
    },
    blockPosition: {
      none: '',
      single: '',
      start: '',
      middle: '',
      end: '',
    },
  },
  compoundVariants: [
    {
      isSelected: false,
      class: 'text-slate-700',
    },
    {
      isSelected: true,
      color: 'default',
      class: 'bg-slate-100 text-slate-900',
    },
    {
      isSelected: true,
      color: 'primary',
      class: 'bg-primary-50 text-primary-700',
    },
    {
      isSelected: true,
      color: 'secondary',
      class: 'bg-secondary-50 text-secondary-700',
    },
    {
      isSelected: true,
      color: 'success',
      class: 'bg-success-50 text-success-700',
    },
    {
      isSelected: true,
      color: 'warning',
      class: 'bg-warning-50 text-warning-700',
    },
    {
      isSelected: true,
      color: 'danger',
      class: 'bg-danger-50 text-danger-700',
    },
    {
      isSelected: true,
      size: 'sm',
      class: 'font-medium',
    },
    {
      isSelected: true,
      size: 'md',
      class: 'font-semibold',
    },
    {
      isSelected: true,
      size: 'lg',
      class: 'font-semibold',
    },
    {
      orientation: 'y',
      size: 'sm',
      blockPosition: 'single',
      class: 'rounded-xl',
    },
    {
      orientation: 'y',
      size: 'sm',
      blockPosition: 'start',
      class: 'rounded-t-xl rounded-b-none',
    },
    {
      orientation: 'y',
      size: 'sm',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'y',
      size: 'sm',
      blockPosition: 'end',
      class: 'rounded-t-none rounded-b-xl',
    },
    {
      orientation: 'y',
      size: 'md',
      blockPosition: 'single',
      class: 'rounded-2xl',
    },
    {
      orientation: 'y',
      size: 'md',
      blockPosition: 'start',
      class: 'rounded-t-2xl rounded-b-none',
    },
    {
      orientation: 'y',
      size: 'md',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'y',
      size: 'md',
      blockPosition: 'end',
      class: 'rounded-t-none rounded-b-2xl',
    },
    {
      orientation: 'x',
      size: 'sm',
      blockPosition: 'single',
      class: 'rounded-xl',
    },
    {
      orientation: 'x',
      size: 'sm',
      blockPosition: 'start',
      class: 'rounded-l-xl rounded-r-none',
    },
    {
      orientation: 'x',
      size: 'sm',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'x',
      size: 'sm',
      blockPosition: 'end',
      class: 'rounded-l-none rounded-r-xl',
    },
    {
      orientation: 'x',
      size: 'md',
      blockPosition: 'single',
      class: 'rounded-2xl',
    },
    {
      orientation: 'x',
      size: 'md',
      blockPosition: 'start',
      class: 'rounded-l-2xl rounded-r-none',
    },
    {
      orientation: 'x',
      size: 'md',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'x',
      size: 'md',
      blockPosition: 'end',
      class: 'rounded-l-none rounded-r-2xl',
    },
    {
      orientation: 'y',
      size: 'lg',
      blockPosition: 'single',
      class: 'rounded-3xl',
    },
    {
      orientation: 'y',
      size: 'lg',
      blockPosition: 'start',
      class: 'rounded-t-3xl rounded-b-none',
    },
    {
      orientation: 'y',
      size: 'lg',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'y',
      size: 'lg',
      blockPosition: 'end',
      class: 'rounded-t-none rounded-b-3xl',
    },
    {
      orientation: 'x',
      size: 'lg',
      blockPosition: 'single',
      class: 'rounded-3xl',
    },
    {
      orientation: 'x',
      size: 'lg',
      blockPosition: 'start',
      class: 'rounded-l-3xl rounded-r-none',
    },
    {
      orientation: 'x',
      size: 'lg',
      blockPosition: 'middle',
      class: 'rounded-none',
    },
    {
      orientation: 'x',
      size: 'lg',
      blockPosition: 'end',
      class: 'rounded-l-none rounded-r-3xl',
    },
  ],
  defaultVariants: {
    orientation: 'y',
    size: 'md',
    color: 'default',
    isSelected: false,
    isDisabled: false,
    blockPosition: 'none',
  },
});

export type SelectboxVariants = VariantProps<typeof selectbox>;
export type SelectboxClasses = VariantClasses<typeof selectbox>;
export type SelectboxClassNames = SelectboxClasses;
export type SelectboxReactClassNames = Omit<SelectboxClassNames, '$listbox'>;
export type SelectboxMiniClassNames = SelectboxClassNames;
