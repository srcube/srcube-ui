import { picker } from '@srcube-ui/styles/components/picker/style';
import { UIComponent } from '../../shared/ui-component';
import type {
  PickerMiniColumn,
  PickerMiniItem,
  PickerMiniItemId,
  PickerMiniMultiValue,
  PickerMiniOption,
  PickerMiniProps,
  PickerMiniType,
} from './props';
import { pickerMiniProps } from './props';

type PickerMiniColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

type PickerMiniSize = 'sm' | 'md' | 'lg';
type PickerMiniTone = 'default' | 'dark';

type PickerMiniState = {
  _innerOpen: boolean;
  _innerCommittedValue: PickerMiniMultiValue;
  _draftValue: PickerMiniMultiValue;
  _pendingConfirmedValue: PickerMiniMultiValue;
  _hasPendingConfirmed: boolean;
};

type PickerMiniData = PickerMiniProps & PickerMiniState;

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isSamePickerItemId(
  left: Pick<PickerMiniItem, 'id'>['id'] | null | undefined,
  right: Pick<PickerMiniItem, 'id'>['id'] | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  ) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return (
      Number.isFinite(leftNumber) &&
      Number.isFinite(rightNumber) &&
      leftNumber === rightNumber
    );
  }

  return false;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<PickerMiniData, 'isOpen' | '_innerOpen'>) {
  return isControlledOpen(data.isOpen) ? Boolean(data.isOpen) : data._innerOpen;
}

function resolveType(value?: string | null): PickerMiniType {
  return value === 'calendar' ? 'calendar' : 'default';
}

function resolveColor(value?: string | null): PickerMiniColor {
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

function resolveSize(value?: string | null): PickerMiniSize {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveTone(value?: string | null): PickerMiniTone {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveButtonTone(value?: string | null) {
  return resolveTone(value) === 'dark' ? 'dark' : 'light';
}

function normalizeColumns(rawColumns: unknown): PickerMiniColumn[] {
  if (!Array.isArray(rawColumns)) {
    return [];
  }

  return rawColumns.map((column, columnIndex) => {
    if (!column || typeof column !== 'object') {
      return {
        id: columnIndex,
        items: [],
      };
    }

    const candidate = column as PickerMiniColumn;
    const rawItems = Array.isArray(candidate.items) ? candidate.items : [];

    return {
      id: candidate.id ?? columnIndex,
      items: rawItems.map((item, itemIndex) => normalizeItem(item, itemIndex)),
    };
  });
}

function normalizeItems(rawItems: unknown): PickerMiniItem[] {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems.map((item, itemIndex) => normalizeItem(item, itemIndex));
}

function normalizeItem(rawItem: unknown, itemIndex: number): PickerMiniItem {
  if (!rawItem || typeof rawItem !== 'object') {
    return {
      id: itemIndex,
      label: '',
    };
  }

  const candidate = rawItem as PickerMiniItem;

  return {
    id: candidate.id ?? itemIndex,
    label: String(candidate.label ?? ''),
    isDisabled: candidate.isDisabled === true,
  };
}

function resolveBaseColumns(data: Pick<PickerMiniData, 'items' | 'columns'>) {
  const normalizedColumns = normalizeColumns(data.columns);
  if (normalizedColumns.length > 0) {
    return normalizedColumns;
  }

  const normalizedItems = normalizeItems(data.items);
  if (normalizedItems.length > 0) {
    return [
      {
        id: 'picker-single',
        items: normalizedItems,
      },
    ];
  }

  return [];
}

function normalizeOptions(rawOptions: unknown): PickerMiniOption[] {
  if (!Array.isArray(rawOptions)) {
    return [];
  }

  return rawOptions
    .filter(
      (option): option is PickerMiniOption =>
        Boolean(option) &&
        typeof option === 'object' &&
        (typeof option.id === 'string' || typeof option.id === 'number'),
    )
    .map((option) => ({
      id: option.id,
      label: String(option.label ?? ''),
      isDisabled: option.isDisabled === true,
      children: normalizeOptions(option.children),
    }));
}

function getEnabledOption(options: PickerMiniOption[]) {
  return options.find((option) => !option.isDisabled) ?? options[0] ?? null;
}

function normalizeCascadeValue(
  options: PickerMiniOption[],
  input?: PickerMiniMultiValue,
): PickerMiniMultiValue {
  const normalized: PickerMiniMultiValue = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    const desired = input?.[levelIndex];
    const matched = levelOptions.find(
      (option) => !option.isDisabled && isSamePickerItemId(option.id, desired),
    );
    const selected = matched ?? getEnabledOption(levelOptions);

    if (!selected) {
      break;
    }

    normalized.push(selected.id);
    levelOptions = selected.children ?? [];
    levelIndex += 1;
  }

  return normalized;
}

function buildCascadeColumns(
  options: PickerMiniOption[],
  value: PickerMiniMultiValue,
): PickerMiniColumn[] {
  const columns: PickerMiniColumn[] = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    columns.push({
      id: levelIndex,
      items: levelOptions.map((option) => ({
        id: option.id,
        label: option.label,
        isDisabled: option.isDisabled,
      })),
    });

    const selected = levelOptions.find((option) =>
      isSamePickerItemId(option.id, value[levelIndex]),
    );
    const fallback = selected ?? getEnabledOption(levelOptions);
    if (!fallback) {
      break;
    }

    levelOptions = fallback.children ?? [];
    levelIndex += 1;
  }

  return columns;
}

function resolveCascadeDisplayValue(params: {
  options: PickerMiniOption[];
  value: PickerMiniMultiValue;
  separator: string;
}) {
  const { options, value, separator } = params;
  const labels: string[] = [];
  let levelOptions = options;

  for (const itemId of value) {
    if (levelOptions.length === 0) {
      break;
    }

    const selected = levelOptions.find((option) =>
      isSamePickerItemId(option.id, itemId),
    );
    if (!selected) {
      break;
    }

    labels.push(selected.label);
    levelOptions = selected.children ?? [];
  }

  return labels.join(separator);
}

function resolveChangedIndex(
  previous: PickerMiniMultiValue,
  next: PickerMiniMultiValue,
) {
  const total = Math.max(previous.length, next.length);
  for (let index = 0; index < total; index += 1) {
    if (!isSamePickerItemId(previous[index], next[index])) {
      return index;
    }
  }

  return undefined;
}

function getDefaultColumnValue(
  column: PickerMiniColumn,
): PickerMiniItemId | null {
  const firstEnabled = column.items.find((item) => !item.isDisabled);
  return firstEnabled?.id ?? column.items[0]?.id ?? null;
}

function normalizeColumnValue(
  column: PickerMiniColumn,
  value: PickerMiniItemId | null | undefined,
) {
  if (value === null || value === undefined) {
    return getDefaultColumnValue(column);
  }

  const matchedItem = column.items.find((item) =>
    isSamePickerItemId(item.id, value),
  );
  if (matchedItem) {
    return matchedItem.id;
  }

  return getDefaultColumnValue(column);
}

function ensureNormalizedValue(
  columns: PickerMiniColumn[],
  input?: PickerMiniMultiValue,
): PickerMiniMultiValue {
  return columns.map((column, index) =>
    normalizeColumnValue(column, input?.[index]),
  );
}

function normalizeRawValue(params: {
  columns: PickerMiniColumn[];
  value: unknown;
}): PickerMiniMultiValue {
  const { columns, value } = params;

  if (Array.isArray(value)) {
    return ensureNormalizedValue(columns, value as PickerMiniMultiValue);
  }

  if (value === null || value === undefined) {
    return ensureNormalizedValue(columns);
  }

  return ensureNormalizedValue(columns, [value as PickerMiniItemId]);
}

function toOutputValue(value: PickerMiniMultiValue): PickerMiniMultiValue {
  return [...value];
}

function resolveDisplayValue(params: {
  columns: PickerMiniColumn[];
  value: PickerMiniMultiValue;
  separator: string;
}) {
  const { columns, value, separator } = params;
  const labels = value
    .map((itemId, index) => {
      if (itemId === null || itemId === undefined) {
        return '';
      }

      const item = columns[index]?.items.find((candidate) =>
        isSamePickerItemId(candidate.id, itemId),
      );
      return item?.label ?? '';
    })
    .filter(Boolean);

  return labels.join(separator);
}

function cloneValue(value: PickerMiniMultiValue): PickerMiniMultiValue {
  return value.map((item) => (item === undefined ? null : item));
}

function hasPickerInputValue(value: unknown): value is PickerMiniMultiValue {
  return (
    Array.isArray(value) &&
    value.some((item) => item !== null && item !== undefined)
  );
}

function resolveCommittedValue(data: PickerMiniData): PickerMiniMultiValue {
  const options = normalizeOptions(data.options);
  const baseValue = isControlledValue(data.value)
    ? data.value
    : hasPickerInputValue(data._innerCommittedValue)
      ? data._innerCommittedValue
      : data.defaultValue;

  if (!hasPickerInputValue(baseValue)) {
    return [];
  }

  if (options.length > 0) {
    return normalizeCascadeValue(options, baseValue);
  }

  const columns = resolveBaseColumns(data);
  return normalizeRawValue({
    columns,
    value: baseValue,
  });
}

function resolveOpenDraftValue(data: PickerMiniData): PickerMiniMultiValue {
  const options = normalizeOptions(data.options);

  if (data._hasPendingConfirmed && data._pendingConfirmedValue.length > 0) {
    if (options.length > 0) {
      return normalizeCascadeValue(options, data._pendingConfirmedValue);
    }

    const columns = resolveBaseColumns(data);
    return normalizeRawValue({
      columns,
      value: data._pendingConfirmedValue,
    });
  }

  return resolveCommittedValue(data);
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    pickerMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerCommittedValue: [] as PickerMiniMultiValue,
    _draftValue: [] as PickerMiniMultiValue,
    _pendingConfirmedValue: [] as PickerMiniMultiValue,
    _hasPendingConfirmed: false,
  } satisfies PickerMiniState,

  observers: {
    value() {
      this.syncValuesByProps();
    },
    items() {
      this.syncValuesByProps();
    },
    columns() {
      this.syncValuesByProps();
    },
    options() {
      this.syncValuesByProps();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }

      this.syncValuesByProps();
    },
    isOpen(nextOpen: PickerMiniProps['isOpen']) {
      if (!isControlledOpen(nextOpen)) {
        return;
      }

      const committed = resolveOpenDraftValue(this.data as PickerMiniData);

      if (nextOpen) {
        this.setData(
          {
            _draftValue: committed,
          } satisfies Partial<PickerMiniState>,
          () => {
            this.schedulePickboxLayoutSync();
          },
        );
        return;
      }

      const closeBase = this.data._hasPendingConfirmed
        ? cloneValue(this.data._pendingConfirmedValue)
        : committed;

      this.setData({
        _draftValue: closeBase,
        _hasPendingConfirmed: false,
        _pendingConfirmedValue: [],
      } satisfies Partial<PickerMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const initialCommitted = resolveCommittedValue(
        this.data as PickerMiniData,
      );

      this.setData(
        {
          _innerOpen: isControlledOpen(this.data.isOpen)
            ? Boolean(this.data.isOpen)
            : Boolean(this.data.defaultOpen),
          _innerCommittedValue: initialCommitted,
          _draftValue: initialCommitted,
          _pendingConfirmedValue: [],
          _hasPendingConfirmed: false,
        } satisfies Partial<PickerMiniState>,
        () => {
          if (resolveOpen(this.data as PickerMiniData)) {
            this.schedulePickboxLayoutSync();
          }
        },
      );
    },
    detached() {
      if (this._pickboxRefreshTimer) {
        clearTimeout(this._pickboxRefreshTimer);
        this._pickboxRefreshTimer = null;
      }
      if (this._pickboxSettleTimer) {
        clearTimeout(this._pickboxSettleTimer);
        this._pickboxSettleTimer = null;
      }
    },
  },

  computed: {
    $resolvedOpen(data: PickerMiniData) {
      return resolveOpen(data);
    },
    $resolvedType(data: PickerMiniData) {
      return resolveType(data.type);
    },
    $resolvedColor(data: PickerMiniData) {
      return resolveColor(data.color);
    },
    $resolvedTone(data: PickerMiniData) {
      return resolveTone(data.tone);
    },
    $buttonTone(data: PickerMiniData) {
      return resolveButtonTone(data.tone);
    },
    $resolvedSize(data: PickerMiniData) {
      return resolveSize(data.size);
    },
    $resolvedColumns(data: PickerMiniData) {
      const options = normalizeOptions(data.options);
      if (options.length > 0) {
        const activeValue = resolveOpen(data)
          ? data._draftValue
          : resolveCommittedValue(data);
        const normalized = normalizeCascadeValue(options, activeValue);
        return buildCascadeColumns(options, normalized);
      }

      return resolveBaseColumns(data);
    },
    $resolvedCommittedValue(data: PickerMiniData) {
      return resolveCommittedValue(data);
    },
    $resolvedDraftValue(data: PickerMiniData) {
      const options = normalizeOptions(data.options);
      if (options.length > 0) {
        return normalizeCascadeValue(options, data._draftValue);
      }

      const columns = resolveBaseColumns(data);
      return normalizeRawValue({ columns, value: data._draftValue });
    },
    $displayValue(data: PickerMiniData) {
      const options = normalizeOptions(data.options);
      if (options.length > 0) {
        return resolveCascadeDisplayValue({
          options,
          value: resolveCommittedValue(data),
          separator: data.separator || ' / ',
        });
      }

      return resolveDisplayValue({
        columns: resolveBaseColumns(data),
        value: resolveCommittedValue(data),
        separator: data.separator || ' / ',
      });
    },
    $drawerTitle(data: PickerMiniData) {
      return data.drawerTitle || data.label || '';
    },
    $confirmText(data: PickerMiniData) {
      return data.confirmText || '确认';
    },
    $isConfirmDisabled(data: PickerMiniData) {
      const options = normalizeOptions(data.options);
      const columns =
        options.length > 0
          ? buildCascadeColumns(options, resolveCommittedValue(data))
          : resolveBaseColumns(data);
      const hasItems = columns.some((column) => column.items.length > 0);
      return Boolean(data.isDisabled || data.isReadOnly || !hasItems);
    },
    $classNames(data: PickerMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        tone: resolveTone(data.tone),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: ensureClassName(slots.base({ class: classNames.base })),
        $field: ensureClassName(slots.$field({ class: classNames.$field })),
        field: ensureClassName(slots.field({ class: classNames.field })),
        $drawer: ensureClassName(slots.$drawer({ class: classNames.$drawer })),
        drawer: ensureClassName(slots.drawer({ class: classNames.drawer })),
        drawerTitle: ensureClassName(
          slots.drawerTitle({ class: classNames.drawerTitle }),
        ),
        drawerBody: ensureClassName(
          slots.drawerBody({ class: classNames.drawerBody }),
        ),
        drawerFooter: ensureClassName(
          slots.drawerFooter({ class: classNames.drawerFooter }),
        ),
        $pickbox: ensureClassName(
          slots.$pickbox({ class: classNames.$pickbox }),
        ),
        pickbox: ensureClassName(slots.pickbox({ class: classNames.pickbox })),
        $confirmButton: ensureClassName(
          slots.$confirmButton({
            class: classNames.$confirmButton,
          }),
        ),
        confirmButton: ensureClassName(
          slots.confirmButton({
            class: classNames.confirmButton,
          }),
        ),
      };
    },
    $drawerClassNames(data: PickerMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        tone: resolveTone(data.tone),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        body: ensureClassName(
          slots.drawerBody({ class: classNames.drawerBody }),
        ),
        footer: ensureClassName(
          slots.drawerFooter({ class: classNames.drawerFooter }),
        ),
      };
    },
  },

  methods: {
    schedulePickboxLayoutSync() {
      const refresh = () => {
        const pickbox = this.selectComponent('.sr-picker__pickbox') as {
          refreshLayout?: () => void;
        } | null;
        pickbox?.refreshLayout?.();
      };

      if (this._pickboxRefreshTimer) {
        clearTimeout(this._pickboxRefreshTimer);
      }
      if (this._pickboxSettleTimer) {
        clearTimeout(this._pickboxSettleTimer);
      }

      this._pickboxRefreshTimer = setTimeout(() => {
        refresh();
        this._pickboxRefreshTimer = null;
      }, 0);

      this._pickboxSettleTimer = setTimeout(() => {
        refresh();
        this._pickboxSettleTimer = null;
      }, 120);
    },

    syncValuesByProps() {
      const committed = resolveCommittedValue(this.data as PickerMiniData);
      const shouldResetDraft = !resolveOpen(this.data as PickerMiniData);

      this.setData({
        _innerCommittedValue: committed,
        ...(shouldResetDraft ? { _draftValue: committed } : {}),
      } satisfies Partial<PickerMiniState>);
    },

    emitOpenChange(nextOpen: boolean, reason: string) {
      this.triggerEvent('openchange', {
        isOpen: nextOpen,
        reason,
      });
    },

    requestOpenChange(nextOpen: boolean, reason: string) {
      if (isControlledOpen(this.data.isOpen)) {
        this.emitOpenChange(nextOpen, reason);
        return;
      }

      this.setData(
        {
          _innerOpen: nextOpen,
        } satisfies Partial<PickerMiniState>,
        () => {
          if (nextOpen) {
            this.schedulePickboxLayoutSync();
          }
          this.emitOpenChange(nextOpen, reason);
        },
      );
    },

    handleFieldTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});

      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const committed = resolveOpenDraftValue(this.data as PickerMiniData);
      this.setData(
        {
          _draftValue: committed,
          _hasPendingConfirmed: false,
          _pendingConfirmedValue: [],
        } satisfies Partial<PickerMiniState>,
        () => {
          this.requestOpenChange(true, 'field');
        },
      );
    },

    handleFieldClear() {
      const clearedValue: PickerMiniMultiValue = [];

      this.setData(
        {
          _draftValue: clearedValue,
          _pendingConfirmedValue: [],
          _hasPendingConfirmed: false,
          ...(isControlledValue(this.data.value)
            ? {}
            : { _innerCommittedValue: clearedValue }),
        } satisfies Partial<PickerMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: toOutputValue(clearedValue),
            values: clearedValue,
          });
          this.triggerEvent('clear', {
            value: toOutputValue(clearedValue),
            values: clearedValue,
          });
        },
      );
    },

    handlePickboxValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: PickerMiniMultiValue;
        columnIndex?: number;
        itemId?: PickerMiniItemId;
      }>,
    ) {
      const options = normalizeOptions(this.data.options);
      const previous = cloneValue(this.data._draftValue);
      let normalized: PickerMiniMultiValue;
      let changedIndex: number | undefined =
        typeof e.detail?.columnIndex === 'number'
          ? e.detail.columnIndex
          : undefined;

      if (options.length > 0) {
        const source = Array.isArray(e.detail?.value)
          ? (e.detail.value as PickerMiniMultiValue)
          : [];
        const changedByDiff = resolveChangedIndex(previous, source);
        if (changedIndex === undefined) {
          changedIndex = changedByDiff;
        }

        const cascadeInput =
          changedIndex === undefined
            ? source
            : source.slice(0, changedIndex + 1);
        normalized = normalizeCascadeValue(options, cascadeInput);

        if (changedIndex !== undefined && changedIndex >= normalized.length) {
          changedIndex = normalized.length - 1;
        }
      } else {
        const columns = resolveBaseColumns(this.data as PickerMiniData);
        normalized = normalizeRawValue({
          columns,
          value: e.detail?.value ?? [],
        });

        const changedByDiff = resolveChangedIndex(previous, normalized);
        if (changedIndex === undefined) {
          changedIndex = changedByDiff;
        }
      }

      const itemId =
        e.detail?.itemId ??
        (changedIndex !== undefined
          ? (normalized[changedIndex] ?? undefined)
          : undefined);

      this.setData(
        {
          _draftValue: normalized,
        } satisfies Partial<PickerMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', {
            value: toOutputValue(normalized),
            values: normalized,
            columnIndex: changedIndex,
            itemId,
          });
        },
      );
    },

    handleConfirmTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const options = normalizeOptions(this.data.options);
      const normalized =
        options.length > 0
          ? normalizeCascadeValue(options, this.data._draftValue)
          : normalizeRawValue({
              columns: resolveBaseColumns(this.data as PickerMiniData),
              value: this.data._draftValue,
            });

      this.setData(
        {
          _hasPendingConfirmed: true,
          _pendingConfirmedValue: normalized,
          ...(isControlledValue(this.data.value)
            ? {}
            : { _innerCommittedValue: normalized }),
        } satisfies Partial<PickerMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: toOutputValue(normalized),
            values: normalized,
          });

          this.requestOpenChange(false, 'confirm');
        },
      );
    },

    handleDrawerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const nextOpen = Boolean(e.detail?.isOpen);

      if (nextOpen) {
        const committed = resolveOpenDraftValue(this.data as PickerMiniData);

        this.setData(
          {
            _draftValue: committed,
            _hasPendingConfirmed: false,
            _pendingConfirmedValue: [],
          } satisfies Partial<PickerMiniState>,
          () => {
            this.requestOpenChange(true, 'drawer');
          },
        );
        return;
      }

      if (this.data._hasPendingConfirmed) {
        const closeBase = cloneValue(this.data._pendingConfirmedValue);
        this.setData(
          {
            _draftValue: closeBase,
            _hasPendingConfirmed: false,
            _pendingConfirmedValue: [],
          } satisfies Partial<PickerMiniState>,
          () => {
            this.requestOpenChange(false, 'confirm');
          },
        );
        return;
      }

      const committed = resolveCommittedValue(this.data as PickerMiniData);
      this.setData(
        {
          _draftValue: committed,
        } satisfies Partial<PickerMiniState>,
        () => {
          this.requestOpenChange(false, 'dismiss');
          this.triggerEvent('cancel', {
            value: toOutputValue(committed),
            values: committed,
          });
        },
      );
    },
  },
});

export { picker } from '@srcube-ui/styles/components/picker/style';
export type {
  PickerMiniColumn,
  PickerMiniItem,
  PickerMiniItemId,
  PickerMiniMultiValue,
  PickerMiniOption,
  PickerMiniProps,
  PickerMiniSingleValue,
  PickerMiniType,
  PickerMiniValue,
} from './props';
export { pickerMiniProps } from './props';
