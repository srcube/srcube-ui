import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '@srcube-ui/theme/tv';

export const drawer = tv({
  slots: {
    $modal: '',
    rootPortal: '',
    backdrop: '',
    content: 'bg-white shadow-lg flex flex-col',
    header: 'p-3 text-center text-lg font-semibold',
    body: 'px-4 py-3 flex-1',
    footer: 'px-3 pt-2 pb-safe',
  },
  variants: {
    isOpen: {
      true: {},
      false: {},
    },
    placement: {
      left: {
        header: 'text-right px-8',
        content: 'inset-y-0 left-0 right-auto h-full max-w-[90%] w-fit rounded-r-[2.5rem]',
      },
      right: {
        header: 'text-left px-8',
        content: 'inset-y-0 right-0 left-auto h-full max-w-[90%] w-fit rounded-l-[2.5rem]',
      },
      top: {
        content: 'inset-x-0 top-0 bottom-auto w-full h-fit rounded-b-[3rem]',
        footer: 'pb-0',
      },
      bottom: {
        content: 'inset-x-0 bottom-0 top-auto w-full h-fit rounded-t-[3rem]',
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
      hasCustomNavigation: true,
      placement: 'top',
      class: {
        header: 'pt-safe-3',
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
