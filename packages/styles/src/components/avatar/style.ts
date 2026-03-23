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
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    tone: {
      default: {},
      dark: {},
    },
    isBordered: {
      true: {
        base: 'ring-2 ring-white shadow-sm',
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: 'default',
      class: {
        fallbackOrb: 'opacity-50',
        fallbackGlow: 'opacity-[0.425]',
        fallbackHighlight: 'opacity-50',
      },
    },
    {
      tone: 'dark',
      class: {
        fallbackOrb: 'opacity-40',
        fallbackGlow: 'opacity-[0.3]',
        fallbackHighlight: 'opacity-35',
      },
    },
    {
      color: 'default',
      tone: 'default',
      class: {
        base: 'bg-slate-200 text-slate-700',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      class: {
        base: 'bg-zinc-800 text-zinc-100',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        base: 'bg-primary text-white',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        base: 'bg-primary-600 text-white',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        base: 'bg-secondary text-white',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        base: 'bg-secondary-600 text-white',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        base: 'bg-success text-white',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        base: 'bg-success-600 text-white',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        base: 'bg-warning text-black',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        base: 'bg-warning-600 text-black',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        base: 'bg-danger text-white',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        base: 'bg-danger-600 text-white',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    radius: 'full',
    color: 'default',
    tone: 'default',
    isBordered: false,
  },
});

export type AvatarVariants = VariantProps<typeof avatar>;
export type AvatarClasses = VariantClasses<typeof avatar>;
export type AvatarClassNames = AvatarClasses;
export type AvatarReactClassNames = AvatarClassNames;
export type AvatarMiniClassNames = AvatarClassNames;
