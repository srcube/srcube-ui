import { UIComponent } from '@srcube-ui/runtime/mini';
import {
  closeToast,
  subscribeToasts,
  addToast,
  clearToasts,
  getToasts,
  showToast,
  toast,
} from '../registry';
import { toasterStyle, toastStyle } from '../style';
import type { ToastItem } from '../types';
import { toasterMiniProps, type ToasterMiniProps } from './props';

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
      };
    },
    $renderToasts(data: ToasterMiniData) {
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;
      const maxCount = normalizeMax(data.max);
      const list = getVisibleToasts(data._toasts, maxCount);

      return list.map((item, index) => {
        const slots = toastStyle({
          tone: item.tone,
          state: item.state,
        });
        const layer = getLayerStyle(index, list.length);

        return {
          ...item,
          layerStyle: layer.style,
          classes: {
            layer: slots.layer({ class: custom.layer }),
            toast: slots.toast({ class: custom.toast }),
            icon: slots.icon({ class: custom.icon }),
            _iIcon: slots._iIcon(),
            textWrap: slots.textWrap({ class: custom.textWrap }),
            title: slots.title({ class: custom.title }),
            description: slots.description({ class: custom.description }),
            closeButton: slots.closeButton({ class: custom.closeButton }),
            _iClose: slots._iClose(),
          },
        };
      });
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

function normalizeMax(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.floor(value);
}

function getVisibleToasts(
  toasts: Omit<ToastItem, 'onClose'>[],
  maxCount: number,
) {
  if (!Number.isFinite(maxCount)) {
    return toasts;
  }

  // Overflow strategy: keep the latest `max` items and drop older ones.
  // This is stable and predictable as new toasts always replace from the oldest side.
  return toasts.slice(-maxCount);
}

function getLayerStyle(index: number, total: number) {
  const depthFromTop = total - 1 - index;
  const scale = Math.max(0.82, 1 - depthFromTop * 0.06);
  const translateY = -depthFromTop * 10;
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
export { toasterStyle, toastStyle } from '../style';
export type {
  AddToastResult,
  ToastItem,
  ToastOptions,
  ToastState,
  ToastTone,
} from '../types';
export type { ToasterMiniProps } from './props';
export { toasterMiniProps } from './props';
