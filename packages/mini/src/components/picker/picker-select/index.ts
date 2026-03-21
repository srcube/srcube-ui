import { UIComponent } from '../../../shared/ui-component';
import { picker } from '@srcube-ui/styles/components/picker/style';
import type {
  PickerSelectMiniItem,
  PickerSelectMiniItemId,
  PickerSelectMiniProps,
  PickerSelectMiniValue,
} from './props';
import { pickerSelectMiniProps } from './props';

type PickerSelectMiniState = {
  _innerOpen: boolean;
  _innerCommittedValue: PickerSelectMiniValue;
  _draftValue: PickerSelectMiniValue;
  _pendingConfirmedValue: PickerSelectMiniValue;
  _hasPendingConfirmed: boolean;
};

type PickerSelectMiniData = PickerSelectMiniProps & PickerSelectMiniState;

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isSameItemId(
  left: PickerSelectMiniItemId | null | undefined,
  right: PickerSelectMiniItemId | null | undefined,
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

function isControlledOpen(value: unknown) {
  return value === true || value === false;
}

function resolveOpen(data: PickerSelectMiniData) {
  if (isControlledOpen(data.isOpen)) {
    return Boolean(data.isOpen);
  }

  return Boolean(data._innerOpen);
}

function resolveType(value?: string | null) {
  return value === 'calendar' ? 'calendar' : 'default';
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

function resolveSize(value?: string | null) {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveTone(value?: string | null) {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveButtonTone(value?: string | null) {
  return resolveTone(value) === 'dark' ? 'dark' : 'light';
}

function normalizeItems(rawItems: unknown): PickerSelectMiniItem[] {
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

      const candidate = item as PickerSelectMiniItem;
      const id = candidate.id;
      return {
        id: typeof id === 'string' || typeof id === 'number' ? id : index,
        label: String(candidate.label ?? ''),
        isDisabled: candidate.isDisabled === true,
        isSticky: candidate.isSticky === true,
      };
    });
}

function resolveValueByItems(
  items: PickerSelectMiniItem[],
  rawValue: unknown,
): PickerSelectMiniValue {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return (rawValue as PickerSelectMiniValue).filter((candidateId) =>
    items.some((item) => isSameItemId(item.id, candidateId)));
}

function resolveCommittedValue(data: PickerSelectMiniData): PickerSelectMiniValue {
  const items = normalizeItems(data.items);
  const source = isControlledValue(data.value)
    ? data.value
    : data._innerCommittedValue.length > 0
      ? data._innerCommittedValue
      : data.defaultValue;

  return resolveValueByItems(items, source);
}

function resolveOpenDraftValue(data: PickerSelectMiniData): PickerSelectMiniValue {
  if (data._hasPendingConfirmed) {
    return resolveValueByItems(
      normalizeItems(data.items),
      data._pendingConfirmedValue,
    );
  }

  return resolveCommittedValue(data);
}

function resolveDisplayValue(params: {
  items: PickerSelectMiniItem[];
  value: PickerSelectMiniValue;
  separator: string;
}) {
  const { items, value, separator } = params;
  const labels = value
    .map((itemId) =>
      items.find((candidate) => isSameItemId(candidate.id, itemId))?.label ?? '')
    .filter(Boolean);

  return labels.join(separator);
}

function cloneValue(value: PickerSelectMiniValue): PickerSelectMiniValue {
  return [...value];
}

function toOutputValue(value: PickerSelectMiniValue): PickerSelectMiniValue {
  return [...value];
}

function resolveDraftDetail(params: {
  previous: PickerSelectMiniValue;
  next: PickerSelectMiniValue;
}) {
  const { previous, next } = params;
  const added = next.find(
    (itemId) => !previous.some((candidate) => isSameItemId(candidate, itemId)),
  );

  if (added !== undefined) {
    return {
      value: toOutputValue(next),
      values: toOutputValue(next),
      itemId: added,
      index: next.findIndex((itemId) => isSameItemId(itemId, added)),
    };
  }

  const removed = previous.find(
    (itemId) => !next.some((candidate) => isSameItemId(candidate, itemId)),
  );

  return {
    value: toOutputValue(next),
    values: toOutputValue(next),
    itemId: removed,
    index: removed === undefined
      ? undefined
      : previous.findIndex((itemId) => isSameItemId(itemId, removed)),
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    pickerSelectMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerCommittedValue: [] as PickerSelectMiniValue,
    _draftValue: [] as PickerSelectMiniValue,
    _pendingConfirmedValue: [] as PickerSelectMiniValue,
    _hasPendingConfirmed: false,
  } satisfies PickerSelectMiniState,

  observers: {
    value() {
      this.syncValuesByProps();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }

      this.syncValuesByProps();
    },
    items() {
      this.syncValuesByProps();
    },
    isOpen(nextOpen: PickerSelectMiniProps['isOpen']) {
      if (!isControlledOpen(nextOpen)) {
        return;
      }

      const committed = resolveOpenDraftValue(this.data as PickerSelectMiniData);

      if (nextOpen) {
        this.setData({
          _draftValue: committed,
        } satisfies Partial<PickerSelectMiniState>);
        return;
      }

      const closeBase = this.data._hasPendingConfirmed
        ? cloneValue(this.data._pendingConfirmedValue)
        : committed;

      this.setData({
        _draftValue: closeBase,
        _hasPendingConfirmed: false,
        _pendingConfirmedValue: [],
      } satisfies Partial<PickerSelectMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const committed = resolveCommittedValue(this.data as PickerSelectMiniData);

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerCommittedValue: committed,
        _draftValue: committed,
        _pendingConfirmedValue: [],
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerSelectMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: PickerSelectMiniData) {
      return resolveOpen(data);
    },
    $resolvedColor(data: PickerSelectMiniData) {
      return resolveColor(data.color);
    },
    $resolvedTone(data: PickerSelectMiniData) {
      return resolveTone(data.tone);
    },
    $buttonTone(data: PickerSelectMiniData) {
      return resolveButtonTone(data.tone);
    },
    $resolvedSize(data: PickerSelectMiniData) {
      return resolveSize(data.size);
    },
    $resolvedItems(data: PickerSelectMiniData) {
      return normalizeItems(data.items);
    },
    $displayValue(data: PickerSelectMiniData) {
      return resolveDisplayValue({
        items: normalizeItems(data.items),
        value: resolveCommittedValue(data),
        separator: data.separator || ' / ',
      });
    },
    $confirmText(data: PickerSelectMiniData) {
      return data.confirmText || '确认';
    },
    $isConfirmDisabled(data: PickerSelectMiniData) {
      const items = normalizeItems(data.items);
      return Boolean(
        data.isDisabled
        || data.isReadOnly
        || items.length === 0
        || items.every((item) => item.isDisabled),
      );
    },
    $classNames(data: PickerSelectMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        tone: resolveTone(data.tone),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

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
        $pickbox: ensureClassName(slots.$pickbox({ class: classNames.$pickbox })),
        pickbox: ensureClassName(slots.pickbox({ class: classNames.pickbox })),
        $confirmButton: ensureClassName(
          slots.$confirmButton({ class: classNames.$confirmButton }),
        ),
        confirmButton: ensureClassName(
          slots.confirmButton({ class: classNames.confirmButton }),
        ),
      };
    },
    $drawerClassNames(data: PickerSelectMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        tone: resolveTone(data.tone),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        body: ensureClassName(
          slots.drawerBody({ class: classNames.drawerBody }),
        ),
        footer: ensureClassName(
          slots.drawerFooter({ class: classNames.drawerFooter }),
        ),
      };
    },
    $selectboxListboxClassNames(data: PickerSelectMiniData) {
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
        scrollbox: ensureClassName(
          slots.selectboxListbox({
            class: classNames.selectboxListbox,
          }),
        ),
        scrollboxContent: ensureClassName(
          slots.selectboxListboxContent({
            class: classNames.selectboxListboxContent,
          }),
        ),
      };
    },
  },

  methods: {
    syncValuesByProps() {
      const committed = resolveCommittedValue(this.data as PickerSelectMiniData);
      const shouldResetDraft = !resolveOpen(this.data as PickerSelectMiniData);

      this.setData({
        _innerCommittedValue: committed,
        ...(shouldResetDraft ? { _draftValue: committed } : {}),
      } satisfies Partial<PickerSelectMiniState>);
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
        } satisfies Partial<PickerSelectMiniState>,
        () => {
          this.emitOpenChange(nextOpen, reason);
        },
      );
    },

    handleFieldTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});

      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const committed = resolveOpenDraftValue(this.data as PickerSelectMiniData);
      this.setData(
        {
          _draftValue: committed,
          _hasPendingConfirmed: false,
          _pendingConfirmedValue: [],
        } satisfies Partial<PickerSelectMiniState>,
        () => {
          this.requestOpenChange(true, 'field');
        },
      );
    },

    handleSelectboxValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: PickerSelectMiniValue;
      }>,
    ) {
      const items = normalizeItems(this.data.items);
      const previous = cloneValue(this.data._draftValue);
      const normalized = resolveValueByItems(items, e.detail?.value ?? []);
      const detail = resolveDraftDetail({
        previous,
        next: normalized,
      });

      this.setData(
        {
          _draftValue: normalized,
        } satisfies Partial<PickerSelectMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', detail);
        },
      );
    },

    handleConfirmTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const normalized = resolveValueByItems(
        normalizeItems(this.data.items),
        this.data._draftValue,
      );

      this.setData(
        {
          _hasPendingConfirmed: true,
          _pendingConfirmedValue: normalized,
          ...(isControlledValue(this.data.value)
            ? {}
            : { _innerCommittedValue: normalized }),
        } satisfies Partial<PickerSelectMiniState>,
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
        const committed = resolveOpenDraftValue(this.data as PickerSelectMiniData);
        this.setData(
          {
            _draftValue: committed,
            _hasPendingConfirmed: false,
            _pendingConfirmedValue: [],
          } satisfies Partial<PickerSelectMiniState>,
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
          } satisfies Partial<PickerSelectMiniState>,
          () => {
            this.requestOpenChange(false, 'confirm');
          },
        );
        return;
      }

      const committed = resolveCommittedValue(this.data as PickerSelectMiniData);
      this.setData(
        {
          _draftValue: committed,
        } satisfies Partial<PickerSelectMiniState>,
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

export type {
  PickerSelectMiniItem,
  PickerSelectMiniItemId,
  PickerSelectMiniProps,
  PickerSelectMiniValue,
} from './props';
export { pickerSelectMiniProps } from './props';
