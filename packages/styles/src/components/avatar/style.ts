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
      color: 'default',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,#cbd5e1,#64748b)]',
      },
    },
    {
      color: 'default',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,#52525b,#09090b)]',
      },
    },
    {
      color: 'primary',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-primary),color-mix(in_srgb,var(--color-primary)_70%,black))]',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-primary-600),color-mix(in_srgb,var(--color-primary-600)_68%,black))]',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-secondary),color-mix(in_srgb,var(--color-secondary)_70%,black))]',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-secondary-600),color-mix(in_srgb,var(--color-secondary-600)_68%,black))]',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-success),color-mix(in_srgb,var(--color-success)_70%,black))]',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-success-600),color-mix(in_srgb,var(--color-success-600)_68%,black))]',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-warning),color-mix(in_srgb,var(--color-warning)_70%,black))] text-black',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-warning-600),color-mix(in_srgb,var(--color-warning-600)_68%,black))] text-white',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-danger),color-mix(in_srgb,var(--color-danger)_70%,black))]',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        base: 'bg-[radial-gradient(circle_at_50%_20%,var(--color-danger-600),color-mix(in_srgb,var(--color-danger-600)_68%,black))]',
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
