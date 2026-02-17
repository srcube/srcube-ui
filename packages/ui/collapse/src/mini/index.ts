import { UIComponent } from '@srcube-ui/runtime/mini';
import { collapse, collapseIconState, collapseState } from '../style';
import {
  collapseMiniProps,
  type CollapseMiniProps,
} from './props';

type CollapseMiniState = {
  _innerValue: boolean;
};

type CollapseMiniData = CollapseMiniProps & CollapseMiniState;

function resolveExpanded(data: CollapseMiniData) {
  if (data.value !== null && data.value !== undefined) {
    return Boolean(data.value);
  }

  return Boolean(data._innerValue);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    collapseMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: false,
  } satisfies CollapseMiniState,

  observers: {
    defaultValue() {
      if (this.data.value === null || this.data.value === undefined) {
        this.syncValue();
      }
    },
    value() {
      this.syncValue();
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerValue: Boolean(this.data.defaultValue),
      } satisfies Partial<CollapseMiniState>);
      this.syncValue();
    },
  },

  computed: {
    $classNames(data: CollapseMiniData) {
      const slots = collapse({
        variant: data.variant,
        size: data.size,
        radius: data.radius,
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;
      const isExpanded = resolveExpanded(data);
      const baseState = collapseState({
        isExpanded,
        isDisabled: Boolean(data.isDisabled),
      });
      const iconState = collapseIconState({ isExpanded });

      return {
        base: slots.base({ class: [custom.base, data.className, baseState] }),
        trigger: slots.trigger({ class: custom.trigger }),
        title: slots.title({ class: custom.title }),
        icon: slots.icon({ class: [custom.icon, iconState] }),
        panel: slots.panel({ class: custom.panel }),
        content: slots.content({ class: custom.content }),
      };
    },
    $isExpanded(data: CollapseMiniData) {
      return resolveExpanded(data);
    },
  },

  methods: {
    syncValue() {
      if (this.data.value !== null && this.data.value !== undefined) {
        this.setData({
          _innerValue: Boolean(this.data.value),
        } satisfies Partial<CollapseMiniState>);
      }
    },

    handleTriggerTap() {
      if (this.data.isDisabled) {
        return;
      }

      const nextValue = !resolveExpanded(this.data as CollapseMiniData);

      if (this.data.value === null || this.data.value === undefined) {
        this.setData({
          _innerValue: nextValue,
        } satisfies Partial<CollapseMiniState>);
      }

      this.triggerEvent('change', {
        value: nextValue,
      });
    },
  },
});

export { collapse } from '../style';
export type { CollapseMiniProps } from './props';
export { collapseMiniProps } from './props';
