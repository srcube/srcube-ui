import {
  tv,
  type VariantClasses,
  type VariantProps,
} from '../../shared/tv';

export const toasterStyle = tv({
  slots: {
    base: 'fixed inset-0 z-[1400] pointer-events-none grid place-items-center px-4',
    stack: 'relative grid w-full max-w-[23rem] place-items-center pb-safe-4',
    closeLayer:
      'pointer-events-none absolute inset-0 z-10 grid place-items-center',
  },
});

export const toastStyle = tv({
  slots: {
    layer:
      'col-start-1 row-start-1 transition-[transform,opacity] duration-200 ease-out will-change-transform',
    toast:
      'pointer-events-auto relative flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-3xl border border-transparent px-4 py-4 text-center shadow-lg backdrop-blur-md',
    icon: 'inline-flex h-10 w-10 shrink-0 items-center justify-center text-3xl leading-none',
    _iIcon: 'icon-info size-[1em]',
    textWrap: 'min-w-0 w-full',
    title: 'truncate text-sm font-semibold leading-5',
    description: 'mt-1 line-clamp-2 text-xs leading-4',
    closeButton:
      'pointer-events-auto relative z-[1] inline-flex h-10 w-10 translate-y-[7.5rem] items-center justify-center rounded-full bg-black/10 text-current/80 transition-[background-color,transform,opacity] duration-150 active:scale-95',
    _iClose: 'icon-close size-4',
  },
  variants: {
    color: {
      default: {},
      primary: {},
      secondary: {},
      success: {},
      warning: {},
      danger: {},
    },
    tone: {
      default: {
        toast: 'bg-slate-100/92 text-slate-900',
        description: 'text-slate-700',
      },
      dark: {
        toast: 'bg-slate-950/88 text-white',
        description: 'text-white/80',
      },
    },
    state: {
      enter: {},
      leave: {},
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      tone: 'default',
      class: {
        toast: 'bg-primary-50/92 text-primary',
        title: 'text-primary',
        description: 'text-primary/80',
      },
    },
    {
      color: 'primary',
      tone: 'dark',
      class: {
        toast: 'bg-primary-600/92 text-white',
        title: 'text-white',
        description: 'text-white/80',
      },
    },
    {
      color: 'secondary',
      tone: 'default',
      class: {
        toast: 'bg-secondary-50/92 text-secondary',
        title: 'text-secondary',
        description: 'text-secondary/80',
      },
    },
    {
      color: 'secondary',
      tone: 'dark',
      class: {
        toast: 'bg-secondary-600/92 text-white',
        title: 'text-white',
        description: 'text-white/80',
      },
    },
    {
      color: 'success',
      tone: 'default',
      class: {
        toast: 'bg-success-50/92 text-success',
        title: 'text-success',
        description: 'text-success/80',
        _iIcon: 'icon-toast-success size-[1em]',
      },
    },
    {
      color: 'success',
      tone: 'dark',
      class: {
        toast: 'bg-success-600/92 text-white',
        title: 'text-white',
        description: 'text-white/80',
        _iIcon: 'icon-toast-success size-[1em]',
      },
    },
    {
      color: 'warning',
      tone: 'default',
      class: {
        toast: 'bg-warning-50/92 text-warning',
        title: 'text-warning',
        description: 'text-warning/80',
        _iIcon: 'icon-toast-warning size-[1em]',
      },
    },
    {
      color: 'warning',
      tone: 'dark',
      class: {
        toast: 'bg-warning-600/92 text-white',
        title: 'text-white',
        description: 'text-white/80',
        _iIcon: 'icon-toast-warning size-[1em]',
      },
    },
    {
      color: 'danger',
      tone: 'default',
      class: {
        toast: 'bg-danger-50/92 text-danger',
        title: 'text-danger',
        description: 'text-danger/80',
        _iIcon: 'icon-toast-danger size-[1em]',
      },
    },
    {
      color: 'danger',
      tone: 'dark',
      class: {
        toast: 'bg-danger-600/92 text-white',
        title: 'text-white',
        description: 'text-white/80',
        _iIcon: 'icon-toast-danger size-[1em]',
      },
    },
    {
      state: 'enter',
      class: {
        toast: 'animate-toast-from-center-in',
      },
    },
    {
      state: 'leave',
      class: {
        toast: 'animate-toast-from-center-out',
      },
    },
  ],
  defaultVariants: {
    color: 'default',
    tone: 'default',
    state: 'enter',
  },
});

export type ToasterVariants = VariantProps<typeof toasterStyle>;
export type ToasterClasses = VariantClasses<typeof toasterStyle>;
export type ToastVariants = VariantProps<typeof toastStyle>;
export type ToastClasses = VariantClasses<typeof toastStyle>;

export type ToasterClassNames = ToasterClasses & ToastClasses;
export type ToasterReactClassNames = ToasterClassNames;
export type ToasterMiniClassNames = ToasterClassNames;
