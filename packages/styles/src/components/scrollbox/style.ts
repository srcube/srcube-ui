import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const scrollbox = tv({
  slots: {
    wrapper: 'relative overflow-hidden',
    scrollview: 'w-full h-full',
    content: '',
    maskTop:
      'absolute top-0 left-0 right-0 z-10 w-full h-6 pointer-events-none transition-opacity duration-300 bg-gradient-to-b from-white to-transparent',
    maskBottom:
      'absolute bottom-0 left-0 right-0 z-10 w-full h-6 pointer-events-none transition-opacity duration-300 bg-gradient-to-t from-white to-transparent',
    maskLeft:
      'absolute top-0 left-0 bottom-0 z-10 w-6 h-full pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-white to-transparent',
    maskRight:
      'absolute top-0 right-0 bottom-0 z-10 w-6 h-full pointer-events-none transition-opacity duration-300 bg-gradient-to-l from-white to-transparent',
  },
  variants: {
    tone: {
      default: {},
      dark: {
        maskTop: 'from-zinc-950',
        maskBottom: 'from-zinc-950',
        maskLeft: 'from-zinc-950',
        maskRight: 'from-zinc-950',
      },
    },
    hideMasks: {
      true: {
        maskTop: 'hidden',
        maskBottom: 'hidden',
        maskLeft: 'hidden',
        maskRight: 'hidden',
      },
      false: {},
    },
    orientation: {
      y: {
        content: 'h-max',
        maskLeft: 'hidden',
        maskRight: 'hidden',
      },
      x: {
        content: 'w-max whitespace-nowrap',
        maskTop: 'hidden',
        maskBottom: 'hidden',
      },
      xy: {
        content: 'w-max h-max',
      },
    },
    showMaskTop: {
      true: { maskTop: 'opacity-100' },
      false: { maskTop: 'opacity-0' },
    },
    showMaskBottom: {
      true: { maskBottom: 'opacity-100' },
      false: { maskBottom: 'opacity-0' },
    },
    showMaskLeft: {
      true: { maskLeft: 'opacity-100' },
      false: { maskLeft: 'opacity-0' },
    },
    showMaskRight: {
      true: { maskRight: 'opacity-100' },
      false: { maskRight: 'opacity-0' },
    },
  },
  defaultVariants: {
    tone: 'default',
    orientation: 'y',
    showMaskTop: false,
    showMaskBottom: false,
    showMaskLeft: false,
    showMaskRight: false,
  },
});

export type ScrollboxVariants = Omit<
  VariantProps<typeof scrollbox>,
  'showMaskTop' | 'showMaskBottom' | 'showMaskLeft' | 'showMaskRight'
>;

export type ScrollboxClasses = VariantClasses<typeof scrollbox>;
