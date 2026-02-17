import { UIComponent } from '@srcube-ui/runtime/mini';
import { tabbar, tabbarItemState } from '../style';
import type { TabbarMiniItem, TabbarMiniProps, TabbarMiniValue } from './props';
import { tabbarMiniProps } from './props';

type TabbarMiniState = {
  _innerValue: TabbarMiniValue | null;
};

type TabbarMiniData = TabbarMiniProps & TabbarMiniState;

function resolveColor(value?: string | null) {
  if (
    value === 'primary' ||
    value === 'secondary' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  ) {
    return value;
  }

  return 'default';
}

function resolveItems(raw: unknown): TabbarMiniItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const candidate = item as TabbarMiniItem;
      return {
        value: candidate.value,
        label: String(candidate.label ?? ''),
        icon: typeof candidate.icon === 'string' ? candidate.icon : '',
        isDisabled: candidate.isDisabled === true,
      };
    })
    .filter((item) => item.value !== undefined && item.value !== null);
}

function resolveDefaultValue(items: TabbarMiniItem[]) {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

function resolveActiveValue(data: TabbarMiniData) {
  if (data.value !== null && data.value !== undefined) {
    return data.value;
  }

  if (data._innerValue !== null && data._innerValue !== undefined) {
    return data._innerValue;
  }

  return resolveDefaultValue(resolveItems(data.items));
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    tabbarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: null,
  } satisfies TabbarMiniState,

  observers: {
    value() {
      this.syncValue();
    },
    items() {
      this.syncValue();
    },
    defaultValue() {
      if (this.data.value !== null && this.data.value !== undefined) {
        return;
      }

      this.syncValue();
    },
  },

  lifetimes: {
    attached() {
      const items = resolveItems(this.data.items);
      const initial =
        this.data.value ?? this.data.defaultValue ?? resolveDefaultValue(items);

      this.setData({
        _innerValue: initial,
      } satisfies Partial<TabbarMiniState>);
    },
  },

  computed: {
    $classNames(data: TabbarMiniData) {
      const slots = tabbar({
        size: data.size,
        isBordered: Boolean(data.isBordered),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        list: slots.list({ class: custom.list }),
        item: slots.item({ class: custom.item }),
        icon: slots.icon({ class: custom.icon }),
        label: slots.label({ class: custom.label }),
      };
    },
    $renderItems(data: TabbarMiniData) {
      const items = resolveItems(data.items);
      const activeValue = resolveActiveValue(data);
      const color = resolveColor(data.color);

      return items.map((item, index) => ({
        ...item,
        key: `${typeof item.value}:${String(item.value)}`,
        index,
        itemClassName: tabbarItemState({
          isActive: activeValue === item.value,
          isDisabled: Boolean(item.isDisabled),
          color,
        }),
      }));
    },
  },

  methods: {
    syncValue() {
      const items = resolveItems(this.data.items);
      const nextValue = resolveActiveValue(this.data as TabbarMiniData);
      const fallback = resolveDefaultValue(items);

      this.setData({
        _innerValue:
          nextValue !== null && nextValue !== undefined ? nextValue : fallback,
      } satisfies Partial<TabbarMiniState>);
    },

    handleItemTap(
      e: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            index?: number;
          };
        };
      },
    ) {
      const index = Number(e.currentTarget?.dataset?.index);
      if (Number.isNaN(index)) {
        return;
      }

      const items = resolveItems(this.data.items);
      const target = items[index];
      if (!target || target.isDisabled) {
        return;
      }

      if (this.data.value === null || this.data.value === undefined) {
        this.setData({
          _innerValue: target.value,
        } satisfies Partial<TabbarMiniState>);
      }

      this.triggerEvent('change', {
        value: target.value,
        index,
      });
    },
  },
});

export { tabbar } from '../style';
export type { TabbarMiniItem, TabbarMiniProps, TabbarMiniValue } from './props';
export { tabbarMiniProps } from './props';
