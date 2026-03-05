import { UIComponent } from '../../shared/ui-component';
import { menu, menuItemState } from '@srcube-ui/styles/components/menu/style';
import {
  menuMiniProps,
  type MenuMiniItem,
  type MenuMiniProps,
  type MenuMiniValue,
} from './props';

type MenuMiniState = {
  _innerOpen: boolean;
  _innerValue: MenuMiniValue | null;
};

type MenuMiniData = MenuMiniProps & MenuMiniState;

function resolveItems(raw: unknown): MenuMiniItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const candidate = item as MenuMiniItem;
      return {
        value: candidate.value,
        label: String(candidate.label ?? ''),
        isDisabled: candidate.isDisabled === true,
      };
    })
    .filter(
      (item) => typeof item.value === 'string' || typeof item.value === 'number',
    );
}

function resolveDefaultValue(items: MenuMiniItem[]) {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

function hasValue(items: MenuMiniItem[], value: MenuMiniValue | null | undefined) {
  if (value === null || value === undefined) {
    return false;
  }

  return items.some((item) => item.value === value);
}

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

function resolveVariant(value?: string | null) {
  return value === 'flat' ? 'flat' : 'solid';
}

function resolveTone(value?: string | null) {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveOpen(data: MenuMiniData) {
  return Boolean(data._innerOpen);
}

function resolveActiveValue(data: MenuMiniData) {
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
    menuMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerValue: null,
  } satisfies MenuMiniState,

  observers: {
    isOpen(nextOpen: boolean) {
      this.setData({
        _innerOpen: Boolean(nextOpen),
      } satisfies Partial<MenuMiniState>);
    },
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
      const candidate = this.data.value ?? this.data.defaultValue;

      this.setData({
        _innerOpen: Boolean(this.data.isOpen || this.data.defaultOpen),
        _innerValue: hasValue(items, candidate)
          ? candidate
          : resolveDefaultValue(items),
      } satisfies Partial<MenuMiniState>);
    },
  },

  computed: {
    $classNames(data: MenuMiniData) {
      const slots = menu({
        placement: data.placement,
        orientation: data.orientation,
        size: data.size,
        radius: data.radius,
        variant: resolveVariant(data.variant),
        color: resolveColor(data.color),
        tone: resolveTone(data.tone),
        hasArrow: Boolean(data.hasArrow),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        trigger: slots.trigger({ class: custom.trigger }),
        layer: slots.layer({ class: custom.layer }),
        content: slots.content({ class: custom.content }),
        list: slots.list({ class: custom.list }),
        item: slots.item({ class: custom.item }),
        itemLabel: slots.itemLabel({ class: custom.itemLabel }),
        arrow: slots.arrow({ class: custom.arrow }),
        backdrop: slots.backdrop({ class: custom.backdrop }),
      };
    },
    $isOpen(data: MenuMiniData) {
      return resolveOpen(data);
    },
    $renderItems(data: MenuMiniData) {
      const items = resolveItems(data.items);
      const selectedValue = resolveActiveValue(data);
      const color = resolveColor(data.color);
      const variant = resolveVariant(data.variant);
      const tone = resolveTone(data.tone);

      return items.map((item, index) => ({
        ...item,
        key: `${typeof item.value}:${String(item.value)}`,
        index,
        itemClassName: menuItemState({
          isSelected: selectedValue === item.value,
          isDisabled: Boolean(item.isDisabled),
          color,
          variant,
          tone,
        }),
      }));
    },
  },

  methods: {
    syncValue() {
      const items = resolveItems(this.data.items);
      const nextValue = resolveActiveValue(this.data as MenuMiniData);
      const fallback = resolveDefaultValue(items);

      this.setData({
        _innerValue:
          nextValue !== null && nextValue !== undefined ? nextValue : fallback,
      } satisfies Partial<MenuMiniState>);
    },

    updateOpen(nextOpen: boolean) {
      this.setData({
        _innerOpen: nextOpen,
      } satisfies Partial<MenuMiniState>);

      this.triggerEvent('change', {
        isOpen: nextOpen,
      });
    },

    handleTriggerTap() {
      if (this.data.isDisabled) {
        return;
      }

      this.updateOpen(!resolveOpen(this.data as MenuMiniData));
    },

    handleBackdropTap() {
      if (!this.data.shouldCloseOnOutsidePress) {
        return;
      }

      this.updateOpen(false);
    },

    handleItemTap(
      e: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            index?: number | string;
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
        } satisfies Partial<MenuMiniState>);
      }

      this.triggerEvent('select', {
        value: target.value,
        index,
        item: target,
      });

      if (this.data.shouldCloseOnSelect) {
        this.updateOpen(false);
      }
    },
  },
});

export { menu, menuItemState } from '@srcube-ui/styles/components/menu/style';
export type {
  MenuMiniItem,
  MenuMiniProps,
  MenuMiniValue,
} from './props';
export { menuMiniProps } from './props';
