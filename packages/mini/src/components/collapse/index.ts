import { UIComponent } from '../../shared/ui-component';
import {
  collapse,
  collapseIconState,
  collapsePanelState,
  collapseState,
} from '@srcube-ui/styles/components/collapse/style';
import {
  collapseMiniProps,
  type CollapseMiniProps,
} from './props';

type CollapseMiniState = {
  _innerValue: boolean;
  _panelHeight: number;
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
    _panelHeight: 0,
  } satisfies CollapseMiniState,

  observers: {
    defaultValue() {
      if (this.data.value === null || this.data.value === undefined) {
        this.syncValue();
      }
      this.syncPanelHeight();
    },
    value() {
      this.syncValue();
      this.syncPanelHeight();
    },
    content() {
      this.syncPanelHeight();
    },
    title() {
      this.syncPanelHeight();
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        _innerValue: Boolean(this.data.defaultValue),
      } satisfies Partial<CollapseMiniState>);
      this.syncValue();
      this.syncPanelHeight();
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
      const panelState = collapsePanelState({ isExpanded });

      return {
        base: slots.base({ class: [custom.base, data.className, baseState] }),
        trigger: slots.trigger({ class: custom.trigger }),
        title: slots.title({ class: custom.title }),
        icon: slots.icon({ class: [custom.icon, iconState] }),
        iIndicator: slots._iIndicator(),
        panel: slots.panel({ class: [custom.panel, panelState] }),
        content: slots.content({ class: custom.content }),
      };
    },
    $isExpanded(data: CollapseMiniData) {
      return resolveExpanded(data);
    },
    $panelStyle(data: CollapseMiniData) {
      const expanded = resolveExpanded(data);
      const maxHeight = expanded
        ? Math.max(0, Number(data._panelHeight) || 0)
        : 0;

      return `max-height:${maxHeight}px;transition:max-height 300ms ease;`;
    },
  },

  methods: {
    syncPanelHeight() {
      wx.nextTick(() => {
        const query = this.createSelectorQuery();
        query
          .select('.sr-collapse__content-inner')
          .boundingClientRect((rect) => {
            const nextHeight = Math.ceil(rect?.height ?? 0);
            if (nextHeight === this.data._panelHeight) {
              return;
            }

            this.setData({
              _panelHeight: nextHeight,
            } satisfies Partial<CollapseMiniState>);
          })
          .exec();
      });
    },

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
        this.setData(
          {
            _innerValue: nextValue,
          } satisfies Partial<CollapseMiniState>,
          () => {
            if (nextValue) {
              this.syncPanelHeight();
            }
          },
        );
      } else if (nextValue) {
        this.syncPanelHeight();
      }

      this.triggerEvent('change', {
        value: nextValue,
      });
    },
  },
});

export { collapse } from '@srcube-ui/styles/components/collapse/style';
export type { CollapseMiniProps } from './props';
export { collapseMiniProps } from './props';
