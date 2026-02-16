import { UIComponent } from '@srcube-ui/runtime/mini';
import { picker } from '../style';
import type {
  PickerMiniColumn,
  PickerMiniItem,
  PickerMiniItemId,
  PickerMiniMode,
  PickerMiniMultiValue,
  PickerMiniProps,
  PickerMiniSingleValue,
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

type PickerMiniState = {
  _innerOpen: boolean;
  _innerCommittedValue: PickerMiniMultiValue;
  _draftValue: PickerMiniMultiValue;
  _pendingConfirmedValue: PickerMiniMultiValue;
  _hasPendingConfirmed: boolean;
};

type PickerMiniData = PickerMiniProps & PickerMiniState;

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<PickerMiniData, 'isOpen' | '_innerOpen'>) {
  return isControlledOpen(data.isOpen) ? Boolean(data.isOpen) : data._innerOpen;
}

function resolveMode(value?: string | null): PickerMiniMode {
  return value === 'multiple' ? 'multiple' : 'single';
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

function resolveColumns(data: Pick<PickerMiniData, 'mode' | 'items' | 'columns'>) {
  const mode = resolveMode(data.mode);

  if (mode === 'multiple') {
    return normalizeColumns(data.columns);
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

  const firstColumn = normalizeColumns(data.columns)[0];
  if (!firstColumn) {
    return [];
  }

  return [firstColumn];
}

function getDefaultColumnValue(column: PickerMiniColumn): PickerMiniItemId | null {
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

  const exists = column.items.some((item) => item.id === value);
  if (exists) {
    return value;
  }

  return getDefaultColumnValue(column);
}

function ensureNormalizedValue(
  columns: PickerMiniColumn[],
  input?: PickerMiniMultiValue,
): PickerMiniMultiValue {
  return columns.map((column, index) => normalizeColumnValue(column, input?.[index]));
}

function normalizeRawValue(params: {
  mode: PickerMiniMode;
  columns: PickerMiniColumn[];
  value: unknown;
}): PickerMiniMultiValue {
  const { mode, columns, value } = params;

  if (mode === 'multiple') {
    if (Array.isArray(value)) {
      return ensureNormalizedValue(columns, value as PickerMiniMultiValue);
    }

    if (value === null || value === undefined) {
      return ensureNormalizedValue(columns);
    }

    return ensureNormalizedValue(columns, [value as PickerMiniItemId]);
  }

  if (Array.isArray(value)) {
    return ensureNormalizedValue(columns, [value[0] as PickerMiniSingleValue]);
  }

  return ensureNormalizedValue(columns, [value as PickerMiniSingleValue]);
}

function toOutputValue(
  mode: PickerMiniMode,
  value: PickerMiniMultiValue,
): PickerMiniSingleValue | PickerMiniMultiValue {
  if (mode === 'multiple') {
    return [...value];
  }

  return value[0] ?? null;
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

      const item = columns[index]?.items.find((candidate) => candidate.id === itemId);
      return item?.label ?? '';
    })
    .filter(Boolean);

  return labels.join(separator);
}

function cloneValue(value: PickerMiniMultiValue): PickerMiniMultiValue {
  return value.map((item) => (item === undefined ? null : item));
}

function resolveCommittedValue(data: PickerMiniData): PickerMiniMultiValue {
  const mode = resolveMode(data.mode);
  const columns = resolveColumns(data);
  const baseValue = isControlledValue(data.value)
    ? data.value
    : data._innerCommittedValue.length > 0
      ? data._innerCommittedValue
      : data.defaultValue;

  return normalizeRawValue({
    mode,
    columns,
    value: baseValue,
  });
}

function resolveOpenDraftValue(data: PickerMiniData): PickerMiniMultiValue {
  const mode = resolveMode(data.mode);
  const columns = resolveColumns(data);

  if (data._hasPendingConfirmed && data._pendingConfirmedValue.length > 0) {
    return normalizeRawValue({
      mode,
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
    mode() {
      this.syncValuesByProps();
    },
    items() {
      this.syncValuesByProps();
    },
    columns() {
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
      const columns = resolveColumns(this.data as PickerMiniData);
      const mode = resolveMode(this.data.mode);
      const initialCommitted = normalizeRawValue({
        mode,
        columns,
        value: isControlledValue(this.data.value)
          ? this.data.value
          : this.data.defaultValue,
      });

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerCommittedValue: initialCommitted,
        _draftValue: initialCommitted,
        _pendingConfirmedValue: [],
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerMiniState>, () => {
        if (resolveOpen(this.data as PickerMiniData)) {
          this.schedulePickboxLayoutSync();
        }
      });
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
    $resolvedMode(data: PickerMiniData) {
      return resolveMode(data.mode);
    },
    $resolvedType(data: PickerMiniData) {
      return resolveType(data.type);
    },
    $resolvedColor(data: PickerMiniData) {
      return resolveColor(data.color);
    },
    $resolvedSize(data: PickerMiniData) {
      return resolveSize(data.size);
    },
    $resolvedColumns(data: PickerMiniData) {
      return resolveColumns(data);
    },
    $resolvedCommittedValue(data: PickerMiniData) {
      return resolveCommittedValue(data);
    },
    $resolvedDraftValue(data: PickerMiniData) {
      const columns = resolveColumns(data);
      const mode = resolveMode(data.mode);
      return normalizeRawValue({
        mode,
        columns,
        value: data._draftValue,
      });
    },
    $displayValue(data: PickerMiniData) {
      return resolveDisplayValue({
        columns: resolveColumns(data),
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
      const columns = resolveColumns(data);
      const hasItems = columns.some((column) => column.items.length > 0);
      return Boolean(data.isDisabled || data.isReadOnly || !hasItems);
    },
    $classNames(data: PickerMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: classNames.base }),
        $field: slots.$field({ class: classNames.$field }),
        field: slots.field({ class: classNames.field }),
        $drawer: slots.$drawer({ class: classNames.$drawer }),
        drawer: slots.drawer({ class: classNames.drawer }),
        drawerBody: slots.drawerBody({ class: classNames.drawerBody }),
        drawerFooter: slots.drawerFooter({ class: classNames.drawerFooter }),
        $pickbox: slots.$pickbox({ class: classNames.$pickbox }),
        pickbox: slots.pickbox({ class: classNames.pickbox }),
        $confirmButton: slots.$confirmButton({
          class: classNames.$confirmButton,
        }),
        confirmButton: slots.confirmButton({
          class: classNames.confirmButton,
        }),
      };
    },
    $drawerClassNames(data: PickerMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        body: slots.drawerBody({ class: classNames.drawerBody }),
        footer: slots.drawerFooter({ class: classNames.drawerFooter }),
      };
    },
  },

  methods: {
    schedulePickboxLayoutSync() {
      const refresh = () => {
        const pickbox = this.selectComponent('.sr-picker__pickbox') as
          | { refreshLayout?: () => void }
          | null;
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

    handlePickboxValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: PickerMiniMultiValue;
        columnIndex?: number;
        itemId?: PickerMiniItemId;
      }>,
    ) {
      const mode = resolveMode(this.data.mode);
      const columns = resolveColumns(this.data as PickerMiniData);
      const normalized = normalizeRawValue({
        mode,
        columns,
        value: e.detail?.value ?? [],
      });
      const previous = cloneValue(this.data._draftValue);
      const changedIndexByDiff = normalized.findIndex(
        (item, index) => previous[index] !== item,
      );
      const changedIndex =
        typeof e.detail?.columnIndex === 'number'
          ? e.detail.columnIndex
          : changedIndexByDiff >= 0
            ? changedIndexByDiff
            : undefined;
      const itemId =
        e.detail?.itemId ??
        (changedIndex !== undefined ? normalized[changedIndex] ?? undefined : undefined);

      this.setData(
        {
          _draftValue: normalized,
        } satisfies Partial<PickerMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', {
            value: toOutputValue(mode, normalized),
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

      const mode = resolveMode(this.data.mode);
      const columns = resolveColumns(this.data as PickerMiniData);
      const normalized = normalizeRawValue({
        mode,
        columns,
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
            value: toOutputValue(mode, normalized),
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

      const mode = resolveMode(this.data.mode);

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
            value: toOutputValue(mode, committed),
            values: committed,
          });
        },
      );
    },
  },
});

export { picker } from '../style';
export type {
  PickerMiniColumn,
  PickerMiniItem,
  PickerMiniItemId,
  PickerMiniMode,
  PickerMiniMultiValue,
  PickerMiniProps,
  PickerMiniSingleValue,
  PickerMiniType,
  PickerMiniValue,
} from './props';
export { pickerMiniProps } from './props';
