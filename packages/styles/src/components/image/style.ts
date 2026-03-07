import { tv, type VariantClasses, type VariantProps } from '../../shared/tv';

export const imageStyle = tv({
  slots: {
    base: 'relative inline-flex overflow-hidden bg-slate-100 align-middle',
    image: 'h-full w-full transition-opacity duration-200',
    placeholder:
      'pointer-events-none absolute inset-0 hidden items-center justify-center px-2 text-center text-xs text-slate-500',
    previewMask: 'fixed inset-0 z-[1000] bg-black/70',
    previewBody:
      'fixed inset-0 z-[1001] flex items-center justify-center px-4 pb-28 pt-6',
    previewImage: 'max-h-full max-w-full object-contain select-none',
    previewClose:
      'absolute bottom-8 left-1/2 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white/65 text-4xl leading-none text-black',
  },
  variants: {
    size: {
      sm: {
        base: 'h-20 w-20',
      },
      md: {
        base: 'h-28 w-28',
      },
      lg: {
        base: 'h-36 w-36',
      },
      xl: {
        base: 'h-44 w-44',
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
    fit: {
      cover: {
        image: 'object-cover',
      },
      contain: {
        image: 'object-contain bg-slate-50',
      },
      fill: {
        image: 'object-fill',
      },
      none: {
        image: 'object-none',
      },
    },
    ratio: {
      auto: {},
      square: {
        base: 'aspect-square h-auto w-full',
      },
      video: {
        base: 'aspect-video h-auto w-full',
      },
      photo: {
        base: 'aspect-[4/3] h-auto w-full',
      },
    },
    isBlock: {
      true: {
        base: 'flex w-full',
      },
      false: {},
    },
    status: {
      normal: {
        image: 'opacity-100',
        placeholder: 'hidden',
      },
      loading: {
        image: 'opacity-0',
        placeholder: 'flex animate-pulse',
      },
      error: {
        image: 'opacity-0',
        placeholder: 'flex',
      },
    },
    isPreviewable: {
      true: {
        base: 'cursor-zoom-in',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    radius: 'md',
    fit: 'cover',
    ratio: 'auto',
    isBlock: false,
    status: 'normal',
    isPreviewable: false,
  },
});

export type ImageVariants = VariantProps<typeof imageStyle>;
export type ImageClasses = VariantClasses<typeof imageStyle>;
export type ImageClassNames = ImageClasses;
export type ImageReactClassNames = ImageClassNames;
export type ImageMiniClassNames = ImageClassNames;
