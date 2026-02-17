import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const picker = tv({
  slots: {
    base: 'w-full',
    $field: 'w-full',
    field: 'w-full',
    $drawer: '',
    drawer: '',
    drawerBody: 'px-4 py-3',
    drawerFooter: 'shrink-0 px-4 pt-2',
    rangeBody: 'space-y-3',
    $rangeTabs: '',
    rangeTabs: 'w-full',
    $modeTabs: '',
    modeTabs: 'w-full',
    modeTabButton: 'flex-1',
    $pickbox: '',
    pickbox: 'w-full rounded-2xl border-0',
    $confirmButton: '',
    confirmButton: 'w-full',
  },
  variants: {
    type: {
      default: {},
      calendar: {},
    },
    size: {
      sm: {},
      md: {},
      lg: {},
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
  },
});

export type PickerVariants = VariantProps<typeof picker>;
export type PickerClasses = VariantClasses<typeof picker>;
export type PickerClassNames = PickerClasses;
export type PickerReactClassNames = Omit<
  PickerClassNames,
  '$field' | '$drawer' | '$rangeTabs' | '$pickbox' | '$confirmButton'
>;
export type PickerMiniClassNames = PickerClassNames;
