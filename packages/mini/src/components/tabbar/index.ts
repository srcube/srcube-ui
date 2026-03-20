import {
  tabbar,
  tabbarItemState,
} from '@srcube-ui/styles/components/tabbar/style';
import { UIComponent } from '../../shared/ui-component';
import type { TabbarMiniItem, TabbarMiniProps, TabbarMiniValue } from './props';
import { tabbarMiniProps } from './props';

type TabbarMiniState = {
  _innerValue: TabbarMiniValue | null;
};

type TabbarMiniData = TabbarMiniProps & TabbarMiniState;

type TabbarMiniResolvedBadge = {
  hasBadge: boolean;
  isDot: boolean;
  text: string;
};

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
        badge: candidate.badge,
        isDisabled: candidate.isDisabled === true,
      };
    })
    .filter((item) => item.value !== undefined && item.value !== null);
}

function resolveBadge(value: unknown): TabbarMiniResolvedBadge {
  if (value === true) {
    return {
      hasBadge: true,
      isDot: true,
      text: '',
    };
  }

  if (value === false || value === null || value === undefined) {
    return {
      hasBadge: false,
      isDot: false,
      text: '',
    };
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return {
      hasBadge: true,
      isDot: false,
      text: String(value),
    };
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (normalized.length > 0) {
      return {
        hasBadge: true,
        isDot: false,
        text: normalized,
      };
    }
  }

  return {
    hasBadge: false,
    isDot: false,
    text: '',
  };
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
        tone: data.tone,
        size: data.size,
        isBordered: Boolean(data.isBordered),
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        list: slots.list({ class: custom.list }),
        item: slots.item({ class: custom.item }),
        main: slots.main({ class: custom.main }),
        iconWrap: slots.iconWrap({ class: custom.iconWrap }),
        icon: slots.icon({ class: custom.icon }),
        label: slots.label({ class: custom.label }),
        badge: slots.badge({ class: custom.badge }),
        badgeDot: slots.badgeDot({ class: custom.badgeDot }),
        badgeContent: slots.badgeContent({ class: custom.badgeContent }),
      };
    },
    $renderItems(data: TabbarMiniData) {
      const items = resolveItems(data.items);
      const activeValue = resolveActiveValue(data);
      const color = resolveColor(data.color);

      return items.map((item, index) => {
        const badge = resolveBadge(item.badge);

        return {
          ...item,
          key: `${typeof item.value}:${String(item.value)}`,
          index,
          hasBadge: badge.hasBadge,
          badgeIsDot: badge.isDot,
          badgeText: badge.text,
          itemClassName: tabbarItemState({
            isActive: activeValue === item.value,
            isDisabled: Boolean(item.isDisabled),
            color,
            tone: data.tone,
          }),
        };
      });
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

export { tabbar } from '@srcube-ui/styles/components/tabbar/style';
export type { TabbarMiniItem, TabbarMiniProps, TabbarMiniValue } from './props';
export { tabbarMiniProps } from './props';
