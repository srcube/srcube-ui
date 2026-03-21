import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const drawer = tv({
  slots: {
    $modal: '',
    base: '',
    backdrop: '',
    content: 'bg-white shadow-lg flex flex-col overflow-hidden outline-none',
    header: 'shrink-0 p-3 text-center text-lg font-semibold text-slate-900',
    body: 'px-4 py-3',
    footer: 'shrink-0 px-3 pt-2',
  },
  variants: {
    tone: {
      default: {},
      dark: {
        content: 'bg-zinc-950 text-zinc-50',
        header: 'text-zinc-50',
      },
    },
    isOpen: {
      true: {},
      false: {},
    },
    placement: {
      left: {
        header: 'text-right px-8',
        content:
          'inset-y-0 left-0 right-auto h-full max-w-[90%] w-fit rounded-r-[2.5rem]',
        footer: 'pb-[calc(env(safe-area-inset-bottom)+16rpx)]',
      },
      right: {
        header: 'text-left px-8',
        content:
          'inset-y-0 right-0 left-auto h-full max-w-[90%] w-fit rounded-l-[2.5rem]',
        footer: 'pb-[calc(env(safe-area-inset-bottom)+16rpx)]',
      },
      top: {
        content:
          'inset-x-0 top-0 bottom-auto w-full h-fit max-h-[90vh] rounded-b-[3rem]',
        footer: 'pb-0',
      },
      bottom: {
        content:
          'inset-x-0 bottom-0 top-auto w-full h-fit max-h-[90vh] rounded-t-[3rem] pb-safe-4',
        footer: 'pb-0',
      },
    },
    backdrop: {
      transparent: {
        backdrop: 'bg-transparent',
      },
      opaque: {
        backdrop: 'bg-zinc-900/25',
      },
      blur: {
        backdrop: 'bg-zinc-900/25 backdrop-blur-sm',
      },
    },
    hasCustomNavigation: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      tone: 'default',
      placement: ['top', 'bottom'],
      class: {
        body: 'border-t border-slate-100',
      },
    },
    {
      tone: 'dark',
      placement: ['top', 'bottom'],
      class: {
        body: 'border-t border-zinc-900',
      },
    },
    {
      hasCustomNavigation: true,
      placement: 'top',
      class: {
        header: 'pt-[calc(env(safe-area-inset-top)+24rpx)]',
      },
    },
    {
      placement: ['left', 'right'],
      class: {
        body: 'min-h-0 flex-1 overflow-y-auto',
      },
    },
    {
      placement: ['top', 'bottom'],
      class: {
        body: 'max-h-[70vh] overflow-y-auto',
      },
    },
    {
      placement: 'left',
      isOpen: true,
      class: {
        content: 'animate-drawer-from-left-in',
      },
    },
    {
      placement: 'left',
      isOpen: false,
      class: {
        content: 'animate-drawer-from-left-out',
      },
    },
    {
      placement: 'right',
      isOpen: true,
      class: {
        content: 'animate-drawer-from-right-in',
      },
    },
    {
      placement: 'right',
      isOpen: false,
      class: {
        content: 'animate-drawer-from-right-out',
      },
    },
    {
      placement: 'top',
      isOpen: true,
      class: {
        content: 'animate-drawer-from-top-in',
      },
    },
    {
      placement: 'top',
      isOpen: false,
      class: {
        content: 'animate-drawer-from-top-out',
      },
    },
    {
      placement: 'bottom',
      isOpen: true,
      class: {
        content: 'animate-drawer-from-bottom-in',
      },
    },
    {
      placement: 'bottom',
      isOpen: false,
      class: {
        content: 'animate-drawer-from-bottom-out',
      },
    },
  ],
  defaultVariants: {
    tone: 'default',
    placement: 'bottom',
    backdrop: 'opaque',
    hasCustomNavigation: false,
  },
});

export type DrawerVariants = VariantProps<typeof drawer>;
export type DrawerPlacement = NonNullable<DrawerVariants['placement']>;
export type DrawerClasses = VariantClasses<typeof drawer>;
export type DrawerClassNames = DrawerClasses;

export type DrawerReactClassNames = Omit<DrawerClassNames, '$modal'>;
export type DrawerMiniClassNames = DrawerClassNames;
