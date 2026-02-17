import { UIComponent } from '@srcube-ui/runtime/mini';
import { accordion, accordionIconState, accordionItemState } from '../style';
import {
  accordionMiniProps,
  type AccordionMiniChangeValue,
  type AccordionMiniItem,
  type AccordionMiniProps,
  type AccordionMiniSelectionMode,
  type AccordionMiniValue,
} from './props';

type AccordionMiniState = {
  _innerValues: AccordionMiniValue[];
  _isHydrated: boolean;
};

type AccordionMiniData = AccordionMiniProps & AccordionMiniState;

function toItemArray(raw: unknown): AccordionMiniItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const candidate = item as AccordionMiniItem;
      return {
        value: candidate.value,
        title: String(candidate.title ?? ''),
        content: String(candidate.content ?? ''),
        isDisabled: candidate.isDisabled === true,
      };
    })
    .filter((item) => item.value !== null && item.value !== undefined);
}

function toValueArray(
  input: AccordionMiniChangeValue | undefined,
  selectionMode: AccordionMiniSelectionMode,
): AccordionMiniValue[] {
  if (input === null || input === undefined) {
    return [];
  }

  if (Array.isArray(input)) {
    if (selectionMode === 'single') {
      return input.length > 0 ? [input[0] as AccordionMiniValue] : [];
    }

    return input as AccordionMiniValue[];
  }

  return [input as AccordionMiniValue];
}

function toChangeValue(
  values: AccordionMiniValue[],
  selectionMode: AccordionMiniSelectionMode,
): AccordionMiniChangeValue {
  if (selectionMode === 'single') {
    return values[0] ?? null;
  }

  return values;
}

function normalizeSelectionMode(raw: unknown): AccordionMiniSelectionMode {
  return raw === 'multiple' ? 'multiple' : 'single';
}

function resolveActiveValues(data: AccordionMiniData): AccordionMiniValue[] {
  const selectionMode = normalizeSelectionMode(data.selectionMode);

  if (data.value !== null && data.value !== undefined) {
    return toValueArray(data.value, selectionMode);
  }

  if (data._isHydrated) {
    return toValueArray(data._innerValues, selectionMode);
  }

  return toValueArray(data.defaultValue, selectionMode);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    accordionMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValues: [],
    _isHydrated: false,
  } satisfies AccordionMiniState,

  observers: {
    value() {
      this.syncValues();
    },
    defaultValue() {
      if (this.data.value === null || this.data.value === undefined) {
        this.syncValues();
      }
    },
    selectionMode() {
      this.syncValues();
    },
    items() {
      this.syncValues();
    },
  },

  lifetimes: {
    attached() {
      this.syncValues();
    },
  },

  computed: {
    $classNames(data: AccordionMiniData) {
      const slots = accordion({
        variant: data.variant,
        size: data.size,
        radius: data.radius,
        isSeparated: Boolean(data.isSeparated),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        item: slots.item({ class: custom.item }),
        trigger: slots.trigger({ class: custom.trigger }),
        title: slots.title({ class: custom.title }),
        icon: slots.icon({ class: custom.icon }),
        panel: slots.panel({ class: custom.panel }),
        content: slots.content({ class: custom.content }),
      };
    },
    $renderItems(data: AccordionMiniData) {
      const items = toItemArray(data.items);
      const activeValues = resolveActiveValues(data);
      const globalDisabled = Boolean(data.isDisabled);

      return items.map((item, index) => {
        const isExpanded = activeValues.includes(item.value);
        const isItemDisabled = globalDisabled || Boolean(item.isDisabled);

        return {
          ...item,
          index,
          key: `${typeof item.value}:${String(item.value)}`,
          isExpanded,
          isItemDisabled,
          itemClassName: accordionItemState({
            isExpanded,
            isDisabled: isItemDisabled,
          }),
          iconClassName: accordionIconState({ isExpanded }),
        };
      });
    },
  },

  methods: {
    syncValues() {
      const data = this.data as AccordionMiniData;
      const selectionMode = normalizeSelectionMode(data.selectionMode);
      let nextValues: AccordionMiniValue[];

      if (data.value !== null && data.value !== undefined) {
        nextValues = toValueArray(data.value, selectionMode);
      } else if (data._isHydrated) {
        nextValues = toValueArray(data._innerValues, selectionMode);
      } else {
        nextValues = toValueArray(data.defaultValue, selectionMode);
      }

      this.setData({
        _innerValues: nextValues,
        _isHydrated: true,
      } satisfies Partial<AccordionMiniState>);
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

      const items = toItemArray(this.data.items);
      const target = items[index];
      if (!target) {
        return;
      }

      const selectionMode = normalizeSelectionMode(this.data.selectionMode);
      const currentValues = resolveActiveValues(this.data as AccordionMiniData);
      const exists = currentValues.includes(target.value);

      if (this.data.isDisabled || target.isDisabled) {
        return;
      }

      let nextValues: AccordionMiniValue[];
      if (selectionMode === 'multiple') {
        nextValues = exists
          ? currentValues.filter((itemValue) => itemValue !== target.value)
          : [...currentValues, target.value];
      } else {
        nextValues = exists ? [] : [target.value];
      }

      if (this.data.value === null || this.data.value === undefined) {
        this.setData({
          _innerValues: nextValues,
        } satisfies Partial<AccordionMiniState>);
      }

      this.triggerEvent('change', {
        value: toChangeValue(nextValues, selectionMode),
        values: nextValues,
        item: target,
        index,
      });
    },
  },
});

export { accordion } from '../style';
export type {
  AccordionMiniChangeValue,
  AccordionMiniItem,
  AccordionMiniProps,
  AccordionMiniSelectionMode,
  AccordionMiniValue,
} from './props';
export { accordionMiniProps } from './props';
