import { UIComponent } from '@srcube-ui/runtime/mini';
import { popover } from '../style';
import { popoverMiniProps, type PopoverMiniProps } from './props';

type PopoverMiniState = {
  _innerOpen: boolean;
};

type PopoverMiniData = PopoverMiniProps & PopoverMiniState;

function resolveOpen(data: PopoverMiniData) {
  return Boolean(data._innerOpen);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    popoverMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
  } satisfies PopoverMiniState,

  observers: {
    isOpen(nextOpen: boolean) {
      this.setData({
        _innerOpen: Boolean(nextOpen),
      } satisfies Partial<PopoverMiniState>);
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerOpen: Boolean(this.data.isOpen || this.data.defaultOpen),
      } satisfies Partial<PopoverMiniState>);
    },
  },

  computed: {
    $classNames(data: PopoverMiniData) {
      const slots = popover({
        placement: data.placement,
        size: data.size,
        hasArrow: Boolean(data.hasArrow),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        trigger: slots.trigger({ class: custom.trigger }),
        layer: slots.layer({ class: custom.layer }),
        content: slots.content({ class: custom.content }),
        title: slots.title({ class: custom.title }),
        description: slots.description({ class: custom.description }),
        arrow: slots.arrow({ class: custom.arrow }),
        backdrop: slots.backdrop({ class: custom.backdrop }),
      };
    },
    $isOpen(data: PopoverMiniData) {
      return resolveOpen(data);
    },
  },

  methods: {
    updateOpen(nextOpen: boolean) {
      this.setData({
        _innerOpen: nextOpen,
      } satisfies Partial<PopoverMiniState>);
      this.triggerEvent('change', {
        isOpen: nextOpen,
      });
    },

    handleTriggerTap() {
      if (this.data.isDisabled) {
        return;
      }

      this.updateOpen(!resolveOpen(this.data as PopoverMiniData));
    },

    handleBackdropTap() {
      if (!this.data.shouldCloseOnOutsidePress) {
        return;
      }

      this.updateOpen(false);
    },
  },
});

export { popover } from '../style';
export type { PopoverMiniProps } from './props';
export { popoverMiniProps } from './props';
