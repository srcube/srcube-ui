import { UIComponent } from '@srcube-ui/mini';
import { modal } from '../style';
import { modalMiniProps } from './props';

const CLOSE_ANIMATION_MS = 500;

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    modalMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    isVisible: false,
    _innerOpen: false,
  },

  observers: {
    isOpen() {
      this.syncVisibility();
    },
  },

  lifetimes: {
    attached() {
      if (!this._isControlled()) {
        this.setData({ _innerOpen: this.data.defaultOpen }, () => {
          this.syncVisibility();
        });
        return;
      }
      this.syncVisibility();
    },
    detached() {
      if (this._closeTimer) {
        clearTimeout(this._closeTimer);
        this._closeTimer = null;
      }
    },
  },

  computed: {
    $classNames(data) {
      const custom = (data.classNames ?? {}) as Record<string, string>;
      const isOpen =
        data.isOpen !== null && data.isOpen !== undefined
          ? Boolean(data.isOpen)
          : data._innerOpen;
      const slots = modal({
        isOpen,
        motion: data.motion,
        backdrop: data.backdrop,
      });

      return {
        rootPortal: slots.rootPortal({ class: custom.rootPortal }),
        backdrop: slots.backdrop({ class: custom.backdrop }),
        content: slots.content({ class: custom.content }),
        header: slots.header({ class: custom.header }),
        body: slots.body({ class: custom.body }),
        footer: slots.footer({ class: custom.footer }),
      };
    },
  },

  methods: {
    _isControlled() {
      return this.data.isOpen !== null && this.data.isOpen !== undefined;
    },

    _getResolvedOpen() {
      return this._isControlled()
        ? Boolean(this.data.isOpen)
        : this.data._innerOpen;
    },

    syncVisibility() {
      const isOpen = this._getResolvedOpen();
      const { isVisible } = this.data;

      if (isOpen) {
        if (this._closeTimer) {
          clearTimeout(this._closeTimer);
          this._closeTimer = null;
        }

        if (!isVisible) {
          this.setData({ isVisible: true });
        }

        return;
      }

      if (!isVisible) return;

      this._closeTimer = setTimeout(() => {
        this.setData({ isVisible: false });
        this._closeTimer = null;
      }, CLOSE_ANIMATION_MS);
    },

    handleBackdropTap(e: WechatMiniprogram.CustomEvent) {
      if (!this.data.isDismissable) return;

      this.triggerEvent('backdropclick', e);
      this._setOpen(false, e);
    },

    _setOpen(nextOpen: boolean, event?: WechatMiniprogram.CustomEvent) {
      if (!this._isControlled() && this.data._innerOpen !== nextOpen) {
        this.setData({ _innerOpen: nextOpen }, () => {
          this.syncVisibility();
        });
      } else {
        this.syncVisibility();
      }

      this.triggerEvent('openchange', { isOpen: nextOpen });

      if (!nextOpen) {
        this.triggerEvent('close', event);
      }
    },
  },
});

export { modal } from '../style';
export type { ModalMiniProps } from './props';
export { modalMiniProps } from './props';
