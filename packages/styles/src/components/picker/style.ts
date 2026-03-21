import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const picker = tv({
  slots: {
    base: 'w-full',
    $field: 'w-full',
    field: 'w-full',
    $drawer: '',
    drawer: '',
    drawerTitle: 'w-full truncate text-center text-slate-900',
    drawerBody: 'px-4 py-3 overflow-hidden',
    drawerFooter: 'shrink-0 px-4 pt-2',
    rangeBody: 'space-y-3',
    $rangeTabs: '',
    rangeTabs: 'w-full',
    $modeTabs: '',
    modeTabs: 'w-full',
    modeTabButton: 'flex-1',
    $pickbox: '',
    pickbox: 'w-full rounded-2xl border-0',
    selectboxListbox: 'h-[50vh] max-h-[50vh]',
    selectboxListboxContent: 'pb-6 pb-safe-4',
    $confirmButton: '',
    confirmButton: 'w-full',
  },
  variants: {
    type: {
      default: {},
      calendar: {},
    },
    tone: {
      default: {},
      dark: {},
    },
    size: {
      sm: {
        drawerTitle: 'text-sm font-medium',
      },
      md: {
        drawerTitle: 'text-base font-semibold',
      },
      lg: {
        drawerTitle: 'text-lg font-semibold',
      },
    },
  },
  defaultVariants: {
    type: 'default',
    tone: 'default',
    size: 'md',
  },
});

export type PickerVariants = VariantProps<typeof picker>;
export type PickerClasses = VariantClasses<typeof picker>;
export type PickerClassNames = PickerClasses;
export type PickerReactClassNames = Omit<
  PickerClassNames,
  '$field' | '$drawer' | '$rangeTabs' | '$modeTabs' | '$pickbox' | '$confirmButton'
>;
export type PickerMiniClassNames = PickerClassNames;
