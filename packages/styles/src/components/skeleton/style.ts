import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const skeletonStyle = tv({
  slots: {
    base: 'relative inline-flex items-center',
    content: 'w-full transition-opacity duration-300',
    placeholder:
      'pointer-events-none absolute inset-0 transition-opacity duration-300 animate-pulse',
  },
  variants: {
    tone: {
      default: {
        placeholder: 'bg-gradient-to-r from-slate-100 to-slate-200',
      },
      dark: {
        placeholder: 'bg-gradient-to-r from-zinc-950 to-zinc-900',
      },
    },
    radius: {
      none: {
        placeholder: 'rounded-none',
      },
      sm: {
        placeholder: 'rounded-lg',
      },
      md: {
        placeholder: 'rounded-xl',
      },
      lg: {
        placeholder: 'rounded-2xl',
      },
      full: {
        placeholder: 'rounded-full',
      },
    },
    isLoaded: {
      true: {
        content: 'opacity-100',
        placeholder: 'opacity-0 invisible animate-none',
      },
      false: {
        content: 'opacity-0',
        placeholder: 'opacity-100',
      },
    },
  },
  defaultVariants: {
    tone: 'default',
    radius: 'md',
    isLoaded: false,
  },
});

export type SkeletonVariants = VariantProps<typeof skeletonStyle>;
export type SkeletonClasses = VariantClasses<typeof skeletonStyle>;
export type SkeletonClassNames = SkeletonClasses;
export type SkeletonReactClassNames = SkeletonClassNames;
export type SkeletonMiniClassNames = SkeletonClassNames;
