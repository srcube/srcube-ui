import { UIComponent } from '@srcube-ui/runtime/mini';
import {
  buildDateColumns,
  buildTimeColumns,
  formatDateTimeValue,
  hasSecondToken,
  resolveDateTimeFormat,
  resolveDateTimeMode,
  resolveDateTimePanel,
  resolveDateTimeParts,
  resolveDateTimePartsFromPickerValue,
  resolveYearRange,
  type DateTimePanel,
  type DateTimeParts,
} from '../../shared/datetime';
import { picker } from '../../style';
import type { PickerMiniColumn, PickerMiniMultiValue } from '../props';
import type { PickerDatetimeMiniProps } from './props';
import { pickerDatetimeMiniProps } from './props';

type PickerDatetimeMiniState = {
  _innerOpen: boolean;
  _innerValue: string;
  _draftParts: DateTimeParts;
  _pickerValue: PickerMiniMultiValue;
  _pickerColumns: PickerMiniColumn[];
  _activePanel: DateTimePanel;
  _pendingConfirmedValue: string;
  _hasPendingConfirmed: boolean;
};

type PickerDatetimeMiniData = PickerDatetimeMiniProps & PickerDatetimeMiniState;

type PickerMiniColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

type PickerMiniSize = 'sm' | 'md' | 'lg';

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<PickerDatetimeMiniData, 'isOpen' | '_innerOpen'>) {
  return isControlledOpen(data.isOpen) ? Boolean(data.isOpen) : data._innerOpen;
}

function resolveType(value?: string | null) {
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

function resolveCommittedParts(data: PickerDatetimeMiniData): DateTimeParts {
  const mode = resolveDateTimeMode(data.mode);
  const format = resolveDateTimeFormat({
    mode,
    format: data.format,
  });
  const yearRange = resolveYearRange(data.minYear, data.maxYear);
  const source = isControlledValue(data.value)
    ? data.value
    : data._innerValue || data.defaultValue;

  return resolveDateTimeParts({
    value: typeof source === 'string' ? source : null,
    format,
    range: yearRange,
  });
}

function toPickerState(params: {
  mode: ReturnType<typeof resolveDateTimeMode>;
  panel: DateTimePanel;
  parts: DateTimeParts;
  includeSecond: boolean;
  yearRange: ReturnType<typeof resolveYearRange>;
}) {
  const { mode, panel, parts, includeSecond, yearRange } = params;
  const resolvedPanel = resolveDateTimePanel(mode, panel);

  if (resolvedPanel === 'date') {
    return {
      panel: resolvedPanel,
      columns: buildDateColumns({
        parts: parts.date,
        range: yearRange,
      }) as PickerMiniColumn[],
      value: [parts.date.year, parts.date.month, parts.date.day] as PickerMiniMultiValue,
    };
  }

  return {
    panel: resolvedPanel,
    columns: buildTimeColumns({
      includeSecond,
    }) as PickerMiniColumn[],
    value: includeSecond
      ? ([parts.time.hour, parts.time.minute, parts.time.second] as PickerMiniMultiValue)
      : ([parts.time.hour, parts.time.minute] as PickerMiniMultiValue),
  };
}

function toValueDetail(params: {
  data: PickerDatetimeMiniData;
  panel: DateTimePanel;
  format: string;
  value: DateTimeParts;
}) {
  const { data, panel, format, value } = params;
  return {
    value: formatDateTimeValue(value, format),
    mode: resolveDateTimeMode(data.mode),
    panel,
    format,
    dateDetail: {
      year: value.date.year,
      month: value.date.month,
      day: value.date.day,
    },
    timeDetail: {
      hour: value.time.hour,
      minute: value.time.minute,
      second: value.time.second,
    },
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    pickerDatetimeMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerValue: '',
    _draftParts: {
      date: {
        year: 2000,
        month: 1,
        day: 1,
      },
      time: {
        hour: 0,
        minute: 0,
        second: 0,
      },
    },
    _pickerValue: [] as PickerMiniMultiValue,
    _pickerColumns: [] as PickerMiniColumn[],
    _activePanel: 'date' as DateTimePanel,
    _pendingConfirmedValue: '',
    _hasPendingConfirmed: false,
  } satisfies PickerDatetimeMiniState,

  observers: {
    value() {
      this.syncFromCommitted();
    },
    defaultValue() {
      if (isControlledValue(this.data.value)) {
        return;
      }

      this.syncFromCommitted();
    },
    mode() {
      this.syncFromCommitted();
    },
    format() {
      this.syncFromCommitted();
    },
    minYear() {
      this.syncFromCommitted();
    },
    maxYear() {
      this.syncFromCommitted();
    },
    isOpen(nextOpen: PickerDatetimeMiniProps['isOpen']) {
      if (!isControlledOpen(nextOpen)) {
        return;
      }

      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const includeSecond = hasSecondToken(format);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        parts: committed,
        includeSecond,
        yearRange,
      });

      if (nextOpen) {
        this.setData({
          _draftParts: committed,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
          _pendingConfirmedValue: '',
          _hasPendingConfirmed: false,
        } satisfies Partial<PickerDatetimeMiniState>);
        return;
      }

      const closeBase = this.data._hasPendingConfirmed
        ? resolveDateTimeParts({
            value: this.data._pendingConfirmedValue,
            format,
            range: yearRange,
            fallback: committed,
          })
        : committed;
      const closeState = toPickerState({
        mode,
        panel,
        parts: closeBase,
        includeSecond,
        yearRange,
      });

      this.setData({
        _draftParts: closeBase,
        _activePanel: closeState.panel,
        _pickerColumns: closeState.columns,
        _pickerValue: closeState.value,
        _pendingConfirmedValue: '',
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerDatetimeMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const includeSecond = hasSecondToken(format);
      const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
      const panel = resolveDateTimePanel(mode, 'date');
      const pickerState = toPickerState({
        mode,
        panel,
        parts: committed,
        includeSecond,
        yearRange,
      });
      const formatted = formatDateTimeValue(committed, format);

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerValue: isControlledValue(this.data.value) ? this.data._innerValue : formatted,
        _draftParts: committed,
        _activePanel: pickerState.panel,
        _pickerColumns: pickerState.columns,
        _pickerValue: pickerState.value,
        _pendingConfirmedValue: '',
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerDatetimeMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: PickerDatetimeMiniData) {
      return resolveOpen(data);
    },
    $resolvedMode(data: PickerDatetimeMiniData) {
      return resolveDateTimeMode(data.mode);
    },
    $resolvedColor(data: PickerDatetimeMiniData) {
      return resolveColor(data.color);
    },
    $resolvedSize(data: PickerDatetimeMiniData) {
      return resolveSize(data.size);
    },
    $resolvedFormat(data: PickerDatetimeMiniData) {
      return resolveDateTimeFormat({
        mode: resolveDateTimeMode(data.mode),
        format: data.format,
      });
    },
    $displayValue(data: PickerDatetimeMiniData) {
      const format = resolveDateTimeFormat({
        mode: resolveDateTimeMode(data.mode),
        format: data.format,
      });
      return formatDateTimeValue(resolveCommittedParts(data), format);
    },
    $drawerTitle(data: PickerDatetimeMiniData) {
      return data.drawerTitle || data.label || '';
    },
    $confirmText(data: PickerDatetimeMiniData) {
      return data.confirmText || '确认';
    },
    $isConfirmDisabled(data: PickerDatetimeMiniData) {
      return Boolean(data.isDisabled || data.isReadOnly);
    },
    $classNames(data: PickerDatetimeMiniData) {
      const slots = picker({
        type: resolveType(data.type),
        size: resolveSize(data.size),
      });
      const classNames = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: ensureClassName(slots.base({ class: classNames.base })),
        $field: ensureClassName(slots.$field({ class: classNames.$field })),
        field: ensureClassName(slots.field({ class: classNames.field })),
        $drawer: ensureClassName(slots.$drawer({ class: classNames.$drawer })),
        drawer: ensureClassName(slots.drawer({ class: classNames.drawer })),
        drawerBody: ensureClassName(
          slots.drawerBody({ class: classNames.drawerBody }),
        ),
        drawerFooter: ensureClassName(
          slots.drawerFooter({ class: classNames.drawerFooter }),
        ),
        rangeBody: ensureClassName(slots.rangeBody({ class: classNames.rangeBody })),
        $modeTabs: ensureClassName(slots.$modeTabs({ class: classNames.$modeTabs })),
        modeTabs: ensureClassName(slots.modeTabs({ class: classNames.modeTabs })),
        modeTabButton: ensureClassName(
          slots.modeTabButton({ class: classNames.modeTabButton }),
        ),
        $pickbox: ensureClassName(slots.$pickbox({ class: classNames.$pickbox })),
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
    $drawerClassNames(data: PickerDatetimeMiniData) {
      const slots = picker({
        type: resolveType(data.type),
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
  },

  methods: {
    syncFromCommitted() {
      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const includeSecond = hasSecondToken(format);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        parts: committed,
        includeSecond,
        yearRange,
      });
      const formatted = formatDateTimeValue(committed, format);
      const shouldResetDraft = !resolveOpen(this.data as PickerDatetimeMiniData);

      this.setData({
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        ...(shouldResetDraft
          ? {
              _draftParts: committed,
              _activePanel: pickerState.panel,
              _pickerColumns: pickerState.columns,
              _pickerValue: pickerState.value,
            }
          : {}),
      } satisfies Partial<PickerDatetimeMiniState>);
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
        } satisfies Partial<PickerDatetimeMiniState>,
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

      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const includeSecond = hasSecondToken(format);
      const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const pickerState = toPickerState({
        mode,
        panel,
        parts: committed,
        includeSecond,
        yearRange,
      });

      this.setData(
        {
          _draftParts: committed,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
          _pendingConfirmedValue: '',
          _hasPendingConfirmed: false,
        } satisfies Partial<PickerDatetimeMiniState>,
        () => {
          this.requestOpenChange(true, 'field');
        },
      );
    },

    handlePanelTabTap(
      e: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            panel?: DateTimePanel;
          };
        };
      },
    ) {
      const mode = resolveDateTimeMode(this.data.mode);
      if (mode !== 'datetime') {
        return;
      }

      const panel = resolveDateTimePanel(mode, e.currentTarget.dataset.panel);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const includeSecond = hasSecondToken(format);
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const pickerState = toPickerState({
        mode,
        panel,
        parts: this.data._draftParts,
        includeSecond,
        yearRange,
      });

      this.setData({
        _activePanel: pickerState.panel,
        _pickerColumns: pickerState.columns,
        _pickerValue: pickerState.value,
      } satisfies Partial<PickerDatetimeMiniState>);
    },

    handlePickboxDraftValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const includeSecond = hasSecondToken(format);
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const source = e.detail?.values ?? e.detail?.value;
      const nextParts = resolveDateTimePartsFromPickerValue({
        value: source,
        panel,
        current: this.data._draftParts,
        range: yearRange,
        includeSecond,
      });
      const pickerState = toPickerState({
        mode,
        panel,
        parts: nextParts,
        includeSecond,
        yearRange,
      });
      const detail = toValueDetail({
        data: this.data as PickerDatetimeMiniData,
        panel,
        format,
        value: nextParts,
      });

      this.setData(
        {
          _draftParts: nextParts,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
        } satisfies Partial<PickerDatetimeMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', detail);
        },
      );
    },

    handleConfirmTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const normalized = resolveDateTimeParts({
        value: formatDateTimeValue(this.data._draftParts, format),
        format,
        range: yearRange,
        fallback: this.data._draftParts,
      });
      const formatted = formatDateTimeValue(normalized, format);
      const detail = toValueDetail({
        data: this.data as PickerDatetimeMiniData,
        panel,
        format,
        value: normalized,
      });

      this.setData(
        {
          _hasPendingConfirmed: true,
          _pendingConfirmedValue: formatted,
          ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        } satisfies Partial<PickerDatetimeMiniState>,
        () => {
          this.triggerEvent('valuechange', detail);
          this.requestOpenChange(false, 'confirm');
        },
      );
    },

    handleDrawerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const nextOpen = Boolean(e.detail?.isOpen);
      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const includeSecond = hasSecondToken(format);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);

      if (nextOpen) {
        const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
        const pickerState = toPickerState({
          mode,
          panel,
          parts: committed,
          includeSecond,
          yearRange,
        });

        this.setData(
          {
            _draftParts: committed,
            _activePanel: pickerState.panel,
            _pickerColumns: pickerState.columns,
            _pickerValue: pickerState.value,
            _pendingConfirmedValue: '',
            _hasPendingConfirmed: false,
          } satisfies Partial<PickerDatetimeMiniState>,
          () => {
            this.requestOpenChange(true, 'drawer');
          },
        );
        return;
      }

      if (this.data._hasPendingConfirmed) {
        const committedFromPending = resolveDateTimeParts({
          value: this.data._pendingConfirmedValue,
          format,
          range: yearRange,
        });
        const pickerState = toPickerState({
          mode,
          panel,
          parts: committedFromPending,
          includeSecond,
          yearRange,
        });

        this.setData(
          {
            _draftParts: committedFromPending,
            _activePanel: pickerState.panel,
            _pickerColumns: pickerState.columns,
            _pickerValue: pickerState.value,
            _pendingConfirmedValue: '',
            _hasPendingConfirmed: false,
          } satisfies Partial<PickerDatetimeMiniState>,
          () => {
            this.requestOpenChange(false, 'confirm');
          },
        );
        return;
      }

      const committed = resolveCommittedParts(this.data as PickerDatetimeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        parts: committed,
        includeSecond,
        yearRange,
      });
      const detail = toValueDetail({
        data: this.data as PickerDatetimeMiniData,
        panel,
        format,
        value: committed,
      });

      this.setData(
        {
          _draftParts: committed,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
        } satisfies Partial<PickerDatetimeMiniState>,
        () => {
          this.requestOpenChange(false, 'dismiss');
          this.triggerEvent('cancel', detail);
        },
      );
    },
  },
});

export { picker } from '../../style';
export type { PickerDatetimeMiniProps } from './props';
export { pickerDatetimeMiniProps } from './props';
