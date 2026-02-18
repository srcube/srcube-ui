import { tv, type VariantClasses } from '@srcube-ui/theme/tv';

export const cascader = tv({
  slots: {
    base: 'w-full',
    $picker: 'w-full',
    picker: 'w-full',
  },
});

export type CascaderClasses = VariantClasses<typeof cascader>;
export type CascaderClassNames = CascaderClasses;
export type CascaderReactClassNames = Omit<CascaderClassNames, '$picker'>;
export type CascaderMiniClassNames = CascaderClassNames;
