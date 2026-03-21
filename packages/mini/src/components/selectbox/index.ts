import { UIComponent } from '../../shared/ui-component';
import { selectbox, selectboxItemState } from '@srcube-ui/styles/components/selectbox/style';
import type {
  SelectboxMiniItem,
  SelectboxMiniItemId,
  SelectboxMiniProps,
  SelectboxMiniValue,
} from './props';
import { selectboxMiniProps } from './props';

type SelectboxMiniState = {
  _innerValue: SelectboxMiniValue;
};

type SelectboxMiniData = SelectboxMiniProps & SelectboxMiniState;

type BlockPosition = 'none' | 'single' | 'start' | 'middle' | 'end';

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isSameItemId(
  left: SelectboxMiniItemId | null | undefined,
  right: SelectboxMiniItemId | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (left === null || left === undefined || right === null || right === undefined) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string')
    || (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber === rightNumber;
  }

  return false;
}

function isControlledValue(value: unknown) {
  return Array.isArray(value);
}

function resolveSelectionMode(value: unknown) {
  return value === 'single' ? 'single' : 'multiple';
}

function resolveOrientation(value?: string | null) {
  return value === 'x' ? 'x' : 'y';
}

function resolveSize(value?: string | null) {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveColor(value?: string | null) {
  if (
    value === 'primary'
    || value === 'secondary'
    || value === 'success'
    || value === 'warning'
    || value === 'danger'
  ) {
    return value;
  }

  return 'default';
}

function resolveTone(value?: string | null) {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveDefaultMetricBySize(size: SelectboxMiniProps['size']) {
  if (size === 'sm') {
    return 36;
  }

  if (size === 'lg') {
    return 52;
  }

  return 44;
}

function resolveEstimateSize(
  estimateSize: unknown,
  size: SelectboxMiniProps['size'],
) {
  const next = Number(estimateSize);
  if (Number.isFinite(next) && next > 0) {
    return next;
  }

  return resolveDefaultMetricBySize(size);
}

function normalizeItems(rawItems: unknown): SelectboxMiniItem[] {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return {
          id: index,
          label: '',
        };
      }

      const candidate = item as SelectboxMiniItem;
      const id = candidate.id;
      return {
        id: typeof id === 'string' || typeof id === 'number' ? id : index,
        label: String(candidate.label ?? ''),
        isDisabled: candidate.isDisabled === true,
        isSticky: candidate.isSticky === true,
        className: ensureClassName(candidate.className),
        labelClassName: ensureClassName(candidate.labelClassName),
      };
    });
}

function resolveValueByItems(
  items: SelectboxMiniItem[],
  rawValue: unknown,
): SelectboxMiniValue {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return (rawValue as SelectboxMiniValue).filter((candidateId) =>
    items.some((item) => isSameItemId(item.id, candidateId)));
}

function resolveBlockPosition(params: {
  selectedSet: Set<SelectboxMiniItemId>;
  items: SelectboxMiniItem[];
  index: number;
}): BlockPosition {
  const { selectedSet, items, index } = params;
  const current = items[index];
  if (!current || !selectedSet.has(current.id)) {
    return 'none';
  }

  const prev = items[index - 1];
  const next = items[index + 1];
  const hasPrev = Boolean(prev && selectedSet.has(prev.id));
  const hasNext = Boolean(next && selectedSet.has(next.id));

  if (!hasPrev && !hasNext) {
    return 'single';
  }

  if (!hasPrev && hasNext) {
    return 'start';
  }

  if (hasPrev && hasNext) {
    return 'middle';
  }

  return 'end';
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    selectboxMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: [] as SelectboxMiniValue,
  } satisfies SelectboxMiniState,

  observers: {
    value() {
      this.syncValueFromProps();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }

      this.syncValueFromProps();
    },
    items() {
      this.syncValueFromProps();
    },
  },

  lifetimes: {
    attached() {
      const items = normalizeItems(this.data.items);
      const nextValue = isControlledValue(this.data.value)
        ? resolveValueByItems(items, this.data.value)
        : resolveValueByItems(items, this.data.defaultValue);

      this.setData({
        _innerValue: nextValue,
      } satisfies Partial<SelectboxMiniState>);
    },
  },

  computed: {
    $resolvedItems(data: SelectboxMiniData) {
      const items = normalizeItems(data.items);
      const selectedValue = isControlledValue(data.value)
        ? resolveValueByItems(items, data.value)
        : resolveValueByItems(items, data._innerValue);
      const selectedSet = new Set(selectedValue);
      const orientation = resolveOrientation(data.orientation);
      const size = resolveSize(data.size);
      const color = resolveColor(data.color);
      const tone = resolveTone(data.tone);
      const customClassNames = (data.classNames ?? {}) as Record<string, string | undefined>;
      const slots = selectbox({
        color,
        tone,
        orientation,
        size,
      });

      return items.map((item, index) => ({
        ...item,
        className: selectboxItemState({
          color,
          tone,
          orientation,
          size,
          isSelected: selectedSet.has(item.id),
          isDisabled: Boolean(item.isDisabled),
          blockPosition: resolveBlockPosition({
            selectedSet,
            items,
            index,
          }),
          class: slots.item({
            class: [customClassNames.item, item.className],
          }),
        }),
        labelClassName: slots.itemLabel({
          class: [customClassNames.itemLabel, item.labelClassName],
        }),
        endIconClassName:
          data.selectIcon && selectedSet.has(item.id)
            ? slots.itemIcon({ class: customClassNames.itemIcon })
            : '',
      }));
    },
    $classNames(data: SelectboxMiniData) {
      const size = resolveSize(data.size);
      const slots = selectbox({
        color: resolveColor(data.color),
        tone: resolveTone(data.tone),
        orientation: resolveOrientation(data.orientation),
        size,
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: ensureClassName(
          slots.base({
            class: [classNames.base, data.className],
          }),
        ),
        $listbox: ensureClassName(
          slots.$listbox({
            class: classNames.$listbox,
          }),
        ),
        listbox: ensureClassName(
          slots.listbox({
            class: classNames.listbox,
          }),
        ),
      };
    },
    $resolvedEstimateSize(data: SelectboxMiniData) {
      return resolveEstimateSize(data.estimateSize, resolveSize(data.size));
    },
  },

  methods: {
    syncValueFromProps() {
      const items = normalizeItems(this.data.items);
      const nextValue = isControlledValue(this.data.value)
        ? resolveValueByItems(items, this.data.value)
        : resolveValueByItems(items, this.data._innerValue);

      this.setData({
        _innerValue: nextValue,
      } satisfies Partial<SelectboxMiniState>);
    },

    handleListboxItemTap(
      e: WechatMiniprogram.CustomEvent<{
        item?: SelectboxMiniItem;
        index?: number;
      }>,
    ) {
      const items = normalizeItems(this.data.items);
      const index = Number(e.detail?.index ?? -1);
      const item = items[index];
      if (!item || item.isDisabled) {
        return;
      }

      const selectedValue = isControlledValue(this.data.value)
        ? resolveValueByItems(items, this.data.value)
        : resolveValueByItems(items, this.data._innerValue);
      const mode = resolveSelectionMode(this.data.selectionMode);

      const nextValue = mode === 'single'
        ? [item.id]
        : selectedValue.some((candidateId) => isSameItemId(candidateId, item.id))
          ? selectedValue.filter((candidateId) => !isSameItemId(candidateId, item.id))
          : [...selectedValue, item.id];

      this.setData(
        {
          ...(isControlledValue(this.data.value) ? {} : { _innerValue: nextValue }),
        } satisfies Partial<SelectboxMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: nextValue,
          });
          this.triggerEvent('itemtap', {
            item,
            index,
            value: nextValue,
          });
        },
      );
    },

    handleScroll(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scroll', e.detail ?? e);
    },

    handleScrollToUpper(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltoupper', e.detail ?? e);
    },

    handleScrollToLower(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltolower', e.detail ?? e);
    },
  },
});

export { selectbox, selectboxItemState } from '@srcube-ui/styles/components/selectbox/style';
export type {
  SelectboxMiniItem,
  SelectboxMiniItemId,
  SelectboxMiniProps,
  SelectboxMiniSelectionMode,
  SelectboxMiniValue,
} from './props';
export { selectboxMiniProps } from './props';
