import { UIComponent } from '../../shared/ui-component';
import {
  closeToast,
  subscribeToasts,
  addToast,
  clearToasts,
  getToasts,
  showToast,
  toast,
} from './registry';
import { toasterStyle, toastStyle } from '@srcube-ui/styles/components/toaster/style';
import type { ToastItem } from './types';
import { toasterMiniProps, type ToasterMiniProps } from './props';

const MAX_VISIBLE_LAYERS = 3;

type ToasterMiniState = {
  _toasts: Omit<ToastItem, 'onClose'>[];
};

type ToasterMiniData = ToasterMiniProps & ToasterMiniState;

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    toasterMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _toasts: [] as Omit<ToastItem, 'onClose'>[],
  } satisfies ToasterMiniState,

  lifetimes: {
    attached() {
      (this as any)._unsubscribe = subscribeToasts((nextItems) => {
        this.setData({
          _toasts: nextItems,
        } satisfies Partial<ToasterMiniState>);
      });
    },
    detached() {
      (this as any)._unsubscribe?.();
      (this as any)._unsubscribe = null;
    },
  },

  computed: {
    $classNames(data: ToasterMiniData) {
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;
      const slots = toasterStyle();

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        stack: slots.stack({ class: custom.stack }),
        closeLayer: slots.closeLayer({ class: custom.closeLayer }),
      };
    },
    $renderToasts(data: ToasterMiniData) {
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;
      const list = getVisibleToasts(data._toasts);

      return list.map((item, index) => {
        const slots = toastStyle({
          color: item.color,
          tone: item.tone,
          state: item.state,
        });
        const layer = getLayerStyle(index, list.length);

        return {
          ...item,
          showClose: item.showClose && layer.depthFromTop === 0,
          layerStyle: layer.style,
          classes: {
            layer: slots.layer({ class: custom.layer }),
            toast: slots.toast({ class: custom.toast }),
            icon: slots.icon({ class: custom.icon }),
            _iIcon: slots._iIcon(),
            textWrap: slots.textWrap({ class: custom.textWrap }),
            title: slots.title({ class: custom.title }),
            description: slots.description({ class: custom.description }),
          },
        };
      });
    },
    $activeClose(data: ToasterMiniData) {
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;
      const list = getVisibleToasts(data._toasts);
      const topToast = list[list.length - 1];

      if (!topToast || topToast.showClose !== true) {
        return null;
      }

      const slots = toastStyle({
        color: topToast.color,
        tone: topToast.tone,
        state: topToast.state,
      });

      return {
        id: topToast.id,
        closeButtonClass: slots.closeButton({ class: custom.closeButton }),
        closeIconClass: slots._iClose(),
      };
    },
  },

  methods: {
    handleCloseTap(
      event: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            id?: string;
          };
        };
      },
    ) {
      const id = String(event.currentTarget?.dataset?.id ?? '');
      if (!id) {
        return;
      }

      closeToast(id);
    },
  },
});

function getVisibleToasts(toasts: Omit<ToastItem, 'onClose'>[]) {
  return toasts.slice(-MAX_VISIBLE_LAYERS);
}

function getLayerStyle(index: number, total: number) {
  const depthFromTop = total - 1 - index;
  const scale = Math.max(0.82, 1 - depthFromTop * 0.06);
  const translateY = depthFromTop * 10;
  const opacity = Math.max(0.5, 1 - depthFromTop * 0.16);

  return {
    depthFromTop,
    style: `transform: translateY(${translateY}px) scale(${scale}); opacity: ${opacity}; z-index: ${
      total - depthFromTop
    };`,
  };
}

export {
  addToast,
  clearToasts,
  closeToast,
  getToasts,
  showToast,
  subscribeToasts,
  toast,
};
export { toasterStyle, toastStyle } from '@srcube-ui/styles/components/toaster/style';
export type {
  AddToastResult,
  ToastColor,
  ToastLifecycleState,
  ToastItem,
  ToastOptions,
  ToastState,
  ToastTone,
} from './types';
export type { ToasterMiniProps } from './props';
export { toasterMiniProps } from './props';
