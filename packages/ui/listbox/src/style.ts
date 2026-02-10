import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const listbox = tv({
  slots: {
    base: 'relative overflow-hidden rounded-xl bg-white flex flex-col',
    $scrollbox: 'flex grow',
    scrollbox: 'w-full h-full',
    scrollboxContent: '',
    content: 'relative',
    item:
      'box-border flex items-center gap-2 px-3 text-sm leading-none transition-colors duration-150 min-h-11',
    itemLabel: 'truncate',
    emptyContent:
      'flex min-h-24 w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-slate-400',
    _iEmpty: 'icon-box-open text-2xl',
  },
  variants: {
    orientation: {
      y: {
        $scrollbox: 'min-h-0',
        scrollboxContent: 'w-full',
        content: 'w-full',
        item: 'w-full',
      },
      x: {
        $scrollbox: 'min-w-0',
        scrollboxContent: 'h-full',
        content: 'h-full whitespace-nowrap',
        item: 'h-full min-w-max justify-center',
      },
    },
    hasDivider: {
      true: {
        item: 'border-b border-slate-100 last:border-b-0',
      },
      false: {},
    },
  },
  defaultVariants: {
    orientation: 'y',
    hasDivider: false,
  },
});

export const listboxItemState = tv({
  base: '',
  variants: {
    orientation: {
      y: 'w-full',
      x: 'h-full min-w-max',
    },
    isSelected: {
      true: 'bg-primary text-white',
      false: 'text-slate-700',
    },
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
      false: 'cursor-pointer active:bg-slate-100',
    },
  },
  compoundVariants: [
    {
      isSelected: true,
      isDisabled: false,
      class: 'active:bg-primary',
    },
  ],
  defaultVariants: {
    orientation: 'y',
    isSelected: false,
    isDisabled: false,
  },
});

export type ListboxVariants = VariantProps<typeof listbox>;
export type ListboxClasses = VariantClasses<typeof listbox>;
export type ListboxClassNames = Omit<ListboxClasses, '_iEmpty'>;

export type ListboxReactClassNames = Omit<ListboxClassNames, '$scrollbox'>;
export type ListboxMiniClassNames = ListboxClassNames;
