import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const tour = tv({
  slots: {
    base: '',
    $modal: '',
    modal: '',
    body: 'fixed inset-0 z-[1001] pointer-events-none',
    mask: 'fixed bg-transparent pointer-events-auto',
    highlight:
      'fixed box-border bg-transparent shadow-[0_0_0_9999px_rgba(15,23,42,0.55)] pointer-events-none',
    targetBlocker: 'fixed bg-transparent pointer-events-auto',
    popover:
      'fixed pointer-events-auto max-w-[min(360px,calc(100vw-24px))] rounded-2xl bg-white p-4 shadow-xl border border-slate-100',
    header: '',
    title: 'text-sm font-semibold text-slate-900',
    description: 'mt-1 text-xs leading-5 text-slate-600',
    progress: 'mt-2 text-[11px] text-slate-500',
    footer: 'mt-3 flex items-center justify-between gap-2',
    actions: 'flex items-center gap-2',
    skipButton: '',
    prevButton: '',
    nextButton: '',
  },
  variants: {
    tone: {
      default: {},
      dark: {
        highlight: 'shadow-[0_0_0_9999px_rgba(2,6,23,0.72)]',
        popover: 'bg-slate-950 border-slate-800',
        title: 'text-white',
        description: 'text-slate-200',
        progress: 'text-slate-300',
      },
    },
    isInteractive: {
      true: {
        targetBlocker: 'hidden',
      },
      false: {},
    },
  },
  defaultVariants: {
    tone: 'default',
    isInteractive: true,
  },
});

export type TourVariants = VariantProps<typeof tour>;
export type TourClasses = VariantClasses<typeof tour>;
export type TourClassNames = TourClasses;
export type TourReactClassNames = Omit<TourClassNames, '$modal'>;
export type TourMiniClassNames = TourClassNames;
