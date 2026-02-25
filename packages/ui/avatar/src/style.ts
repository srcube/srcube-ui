import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const avatar = tv({
  slots: {
    base: 'relative inline-flex select-none items-center justify-center overflow-hidden text-white',
    image: 'h-full w-full object-cover',
    fallback: 'inline-flex items-center justify-center font-medium',
  },
  variants: {
    size: {
      sm: {
        base: 'h-8 w-8 text-xs',
      },
      md: {
        base: 'h-10 w-10 text-sm',
      },
      lg: {
        base: 'h-12 w-12 text-base',
      },
      xl: {
        base: 'h-16 w-16 text-lg',
      },
    },
    radius: {
      none: {
        base: 'rounded-none',
      },
      sm: {
        base: 'rounded-lg',
      },
      md: {
        base: 'rounded-xl',
      },
      lg: {
        base: 'rounded-2xl',
      },
      full: {
        base: 'rounded-full',
      },
    },
    color: {
      default: {
        base: 'bg-slate-200',
      },
      primary: {
        base: 'bg-primary',
      },
      secondary: {
        base: 'bg-secondary',
      },
      success: {
        base: 'bg-success',
      },
      warning: {
        base: 'bg-warning text-black',
      },
      danger: {
        base: 'bg-danger',
      },
    },
    isBordered: {
      true: {
        base: 'ring-2 ring-white shadow-sm',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    radius: 'full',
    color: 'default',
    isBordered: false,
  },
});

export type AvatarVariants = VariantProps<typeof avatar>;
export type AvatarClasses = VariantClasses<typeof avatar>;
export type AvatarClassNames = AvatarClasses;
export type AvatarReactClassNames = AvatarClassNames;
export type AvatarMiniClassNames = AvatarClassNames;
