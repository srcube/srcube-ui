import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

export const avatar = tv({
  slots: {
    base: 'relative inline-flex select-none items-center justify-center overflow-hidden text-white',
    image: 'h-full w-full object-cover',
    fallback:
      'relative inline-flex h-full w-full items-center justify-center overflow-hidden',
    fallbackOrb: 'pointer-events-none absolute inset-0 rounded-[inherit]',
    fallbackGlow:
      'pointer-events-none absolute -inset-1 rounded-[inherit] opacity-85 blur-sm',
    fallbackHighlight:
      'pointer-events-none absolute left-[8%] top-[8%] h-[42%] w-[52%] rounded-full bg-white/60 blur-sm',
    fallbackText:
      'relative z-10 inline-flex max-w-full items-center justify-center truncate px-[0.2em] font-medium leading-none tracking-tight text-inherit',
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
