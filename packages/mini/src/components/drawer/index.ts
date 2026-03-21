import { UIComponent } from '../../shared/ui-component';
import { drawer } from '@srcube-ui/styles/components/drawer/style';
import { drawerMiniProps } from './props';
import type { DrawerMiniProps } from './props';

type DrawerMiniState = {
  _innerOpen: boolean;
};

type DrawerMiniData = DrawerMiniProps & DrawerMiniState;

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<DrawerMiniData, 'isOpen' | '_innerOpen'>) {
  return isControlledOpen(data.isOpen) ? Boolean(data.isOpen) : data._innerOpen;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    drawerMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
  } satisfies DrawerMiniState,

  lifetimes: {
    attached() {
      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
      } satisfies Partial<DrawerMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: DrawerMiniData) {
      return resolveOpen(data);
    },
    $classNames(data: DrawerMiniData) {
      const slots = drawer({
        tone: data.tone,
        isOpen: resolveOpen(data),
        placement: data.placement,
        backdrop: data.backdrop,
      });
      const classNames = data.classNames ?? {};

      return {
        $modal: slots.$modal({ class: classNames.$modal }),
        base: slots.base({ class: classNames.base }),
        backdrop: slots.backdrop({ class: classNames.backdrop }),
        content: slots.content({ class: classNames.content }),
        header: slots.header({ class: classNames.header }),
        body: slots.body({ class: classNames.body }),
        footer: slots.footer({ class: classNames.footer }),
      };
    },
    $modalClassNames(data: DrawerMiniData) {
      const slots = drawer({
        tone: data.tone,
        isOpen: resolveOpen(data),
        placement: data.placement,
        backdrop: data.backdrop,
      });
      const classNames = data.classNames ?? {};

      return {
        base: slots.base({ class: classNames.base }),
        backdrop: slots.backdrop({ class: classNames.backdrop }),
        content: slots.content({ class: classNames.content }),
        header: slots.header({ class: classNames.header }),
        body: slots.body({ class: classNames.body }),
        footer: slots.footer({ class: classNames.footer }),
      };
    },
  },

  methods: {
    _isControlled() {
      return isControlledOpen(this.data.isOpen);
    },

    handleOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const nextOpen = Boolean(e.detail?.isOpen);
      if (!this._isControlled()) {
        this.setData({
          _innerOpen: nextOpen,
        } satisfies Partial<DrawerMiniState>);
      }

      this.triggerEvent('openchange', { isOpen: nextOpen });
    },

    handleClose(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('close', e.detail);
    },

    handleBackdropClick(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('backdropclick', e.detail);
    },
  },
});

export { drawer } from '@srcube-ui/styles/components/drawer/style';
export type { DrawerMiniProps } from './props';
export { drawerMiniProps } from './props';
