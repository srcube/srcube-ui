import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const listbox = tv({
  slots: {
    base: 'relative z-0 isolate overflow-hidden rounded-xl bg-white flex flex-col',
    $scrollbox: 'flex grow',
    scrollbox: 'w-full h-full',
    scrollboxContent: '',
    sticky: 'absolute z-[1]',
    stickyItem: 'bg-white',
    content: 'relative',
    item:
      'box-border flex items-center gap-2 leading-none transition-colors duration-150',
    itemInner: 'flex w-full min-w-0 items-center gap-2',
    itemLabel: 'truncate',
    itemIcon: 'shrink-0',
    emptyContent:
      'flex min-h-24 w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center text-sm text-slate-400',
    _iEmpty: 'icon-box-open text-2xl',
  },
  variants: {
    orientation: {
      y: {
        $scrollbox: 'min-h-0',
        scrollboxContent: 'w-full',
        sticky: 'top-0 left-0 right-0',
        content: 'w-full',
        item: 'w-full',
        itemInner: 'w-full',
      },
      x: {
        $scrollbox: 'min-w-0',
        scrollboxContent: 'h-full',
        sticky: 'top-0 left-0 bottom-0',
        content: 'h-full whitespace-nowrap',
        item: 'h-full min-w-max justify-center',
        itemInner: 'w-auto',
      },
    },
    size: {
      sm: {
        item: 'min-h-9 px-2 text-xs',
        itemIcon: 'text-sm',
        emptyContent: 'min-h-20 text-xs',
        _iEmpty: 'text-xl',
      },
      md: {
        item: 'min-h-11 px-3 text-sm',
        itemIcon: 'text-base',
      },
      lg: {
        item: 'min-h-12 px-4 text-base',
        itemIcon: 'text-lg',
        emptyContent: 'text-base',
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
    size: 'md',
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
    isDisabled: {
      true: 'cursor-not-allowed opacity-50',
      false: 'text-slate-700',
    },
  },
  defaultVariants: {
    orientation: 'y',
    isDisabled: false,
  },
});

export type ListboxVariants = VariantProps<typeof listbox>;
export type ListboxClasses = VariantClasses<typeof listbox>;
export type ListboxClassNames = Omit<ListboxClasses, '_iEmpty'>;

export type ListboxReactClassNames = Omit<ListboxClassNames, '$scrollbox'>;
export type ListboxMiniClassNames = ListboxClassNames;
