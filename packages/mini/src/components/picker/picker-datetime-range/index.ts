import { UIComponent } from '../../../shared/ui-component';
import {
  buildDateColumns,
  buildTimeColumns,
  formatDateTimeValue,
  getFallbackDateTimeParts,
  hasSecondToken,
  normalizeDateTimeRangeOrder,
  resolveDateTimeFormat,
  resolveDateTimeMode,
  resolveDateTimePanel,
  resolveDateTimeParts,
  resolveDateTimePartsFromPickerValue,
  resolveYearRange,
  type DateTimePanel,
  type DateTimeParts,
  type DateTimeRangeParts,
} from '../shared/datetime';
import { picker } from '@srcube-ui/styles/components/picker/style';
import type { PickerMiniColumn, PickerMiniMultiValue } from '../props';
import type {
  PickerDatetimeRangeMiniProps,
  PickerDatetimeRangeMiniRange,
  PickerDatetimeRangeMiniValue,
} from './props';
import { pickerDatetimeRangeMiniProps } from './props';

type PickerDatetimeRangeMiniState = {
  _innerOpen: boolean;
  _innerValue: PickerDatetimeRangeMiniValue;
  _draftRange: DateTimeRangeParts;
  _pickerValue: PickerMiniMultiValue;
  _pickerColumns: PickerMiniColumn[];
  _activeRange: PickerDatetimeRangeMiniRange;
  _activePanel: DateTimePanel;
  _pendingConfirmedValue: PickerDatetimeRangeMiniValue;
  _hasPendingConfirmed: boolean;
};

type PickerDatetimeRangeMiniData = PickerDatetimeRangeMiniProps &
  PickerDatetimeRangeMiniState;

type PickerMiniColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

type PickerMiniSize = 'sm' | 'md' | 'lg';
type PickerMiniTone = 'default' | 'dark';

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<PickerDatetimeRangeMiniData, 'isOpen' | '_innerOpen'>) {
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

function resolveTone(value?: string | null): PickerMiniTone {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveButtonTone(value?: string | null) {
  return resolveTone(value) === 'dark' ? 'dark' : 'light';
}

function normalizeRangeValueInput(value: unknown): PickerDatetimeRangeMiniValue | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as {
    start?: unknown;
    end?: unknown;
  };

  return {
    start: typeof candidate.start === 'string' ? candidate.start : null,
    end: typeof candidate.end === 'string' ? candidate.end : null,
  };
}

function resolveCommittedRangeParts(data: PickerDatetimeRangeMiniData): DateTimeRangeParts {
  const mode = resolveDateTimeMode(data.mode);
  const format = resolveDateTimeFormat({
    mode,
    format: data.format,
  });
  const yearRange = resolveYearRange(data.minYear, data.maxYear);
  const fallback = getFallbackDateTimeParts(yearRange);

  const source = isControlledValue(data.value)
    ? normalizeRangeValueInput(data.value)
    : normalizeRangeValueInput(data._innerValue) ??
      normalizeRangeValueInput(data.defaultValue);

  const start = resolveDateTimeParts({
    value: source?.start ?? null,
    format,
    range: yearRange,
    fallback,
  });
  const end = resolveDateTimeParts({
    value: source?.end ?? null,
    format,
    range: yearRange,
    fallback: start,
  });

  return normalizeDateTimeRangeOrder({
    rangeValue: {
      start,
      end,
    },
    activeRange: 'end',
    mode,
  });
}

function formatRangeValue(params: {
  value: DateTimeRangeParts;
  format: string;
}): PickerDatetimeRangeMiniValue {
  const { value, format } = params;
  return {
    start: formatDateTimeValue(value.start, format),
    end: formatDateTimeValue(value.end, format),
  };
}

function resolveDisplayValue(params: {
  value: PickerDatetimeRangeMiniValue;
  separator: string;
}) {
  const { value, separator } = params;
  const start = value.start ?? '';
  const end = value.end ?? '';

  if (!start && !end) {
    return '';
  }

  return `${start || '--'}${separator}${end || '--'}`;
}

function toPickerState(params: {
  mode: ReturnType<typeof resolveDateTimeMode>;
  panel: DateTimePanel;
  activeRange: PickerDatetimeRangeMiniRange;
  rangeParts: DateTimeRangeParts;
  includeSecond: boolean;
  yearRange: ReturnType<typeof resolveYearRange>;
}) {
  const { mode, panel, activeRange, rangeParts, includeSecond, yearRange } = params;
  const resolvedPanel = resolveDateTimePanel(mode, panel);
  const activeParts = rangeParts[activeRange];

  if (resolvedPanel === 'date') {
    return {
      panel: resolvedPanel,
      columns: buildDateColumns({
        parts: activeParts.date,
        range: yearRange,
      }) as PickerMiniColumn[],
      value: [
        activeParts.date.year,
        activeParts.date.month,
        activeParts.date.day,
      ] as PickerMiniMultiValue,
    };
  }

  return {
    panel: resolvedPanel,
    columns: buildTimeColumns({
      includeSecond,
    }) as PickerMiniColumn[],
    value: includeSecond
      ? ([
          activeParts.time.hour,
          activeParts.time.minute,
          activeParts.time.second,
        ] as PickerMiniMultiValue)
      : ([activeParts.time.hour, activeParts.time.minute] as PickerMiniMultiValue),
  };
}

function toValueDetail(params: {
  data: PickerDatetimeRangeMiniData;
  activeRange: PickerDatetimeRangeMiniRange;
  panel: DateTimePanel;
  format: string;
  value: DateTimeRangeParts;
}) {
  const { data, activeRange, panel, format, value } = params;
  const formatted = formatRangeValue({ value, format });

  return {
    value: formatted,
    mode: resolveDateTimeMode(data.mode),
    activeRange,
    panel,
    format,
    startDetail: {
      date: {
        year: value.start.date.year,
        month: value.start.date.month,
        day: value.start.date.day,
      },
      time: {
        hour: value.start.time.hour,
        minute: value.start.time.minute,
        second: value.start.time.second,
      },
    },
    endDetail: {
      date: {
        year: value.end.date.year,
        month: value.end.date.month,
        day: value.end.date.day,
      },
      time: {
        hour: value.end.time.hour,
        minute: value.end.time.minute,
        second: value.end.time.second,
      },
    },
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    pickerDatetimeRangeMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerValue: {
      start: '',
      end: '',
    },
    _draftRange: {
      start: {
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
      end: {
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
    } as DateTimeRangeParts,
    _pickerValue: [] as PickerMiniMultiValue,
    _pickerColumns: [] as PickerMiniColumn[],
    _activeRange: 'start' as PickerDatetimeRangeMiniRange,
    _activePanel: 'date' as DateTimePanel,
    _pendingConfirmedValue: {
      start: '',
      end: '',
    },
    _hasPendingConfirmed: false,
  } satisfies PickerDatetimeRangeMiniState,

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
    isOpen(nextOpen: PickerDatetimeRangeMiniProps['isOpen']) {
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: committed,
        includeSecond,
        yearRange,
      });

      if (nextOpen) {
        this.setData({
          _draftRange: committed,
          _activeRange: activeRange,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
          _pendingConfirmedValue: {
            start: '',
            end: '',
          },
          _hasPendingConfirmed: false,
        } satisfies Partial<PickerDatetimeRangeMiniState>);
        return;
      }

      const closeBase = this.data._hasPendingConfirmed
        ? resolveCommittedRangeParts({
            ...(this.data as PickerDatetimeRangeMiniData),
            value: this.data._pendingConfirmedValue,
          } as PickerDatetimeRangeMiniData)
        : committed;
      const closeState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: closeBase,
        includeSecond,
        yearRange,
      });

      this.setData({
        _draftRange: closeBase,
        _activeRange: activeRange,
        _activePanel: closeState.panel,
        _pickerColumns: closeState.columns,
        _pickerValue: closeState.value,
        _pendingConfirmedValue: {
          start: '',
          end: '',
        },
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerDatetimeRangeMiniState>);
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
      const activeRange: PickerDatetimeRangeMiniRange = 'start';
      const panel = resolveDateTimePanel(mode, 'date');
      const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: committed,
        includeSecond,
        yearRange,
      });
      const formatted = formatRangeValue({
        value: committed,
        format,
      });

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerValue: formatted,
        _draftRange: committed,
        _activeRange: activeRange,
        _activePanel: pickerState.panel,
        _pickerColumns: pickerState.columns,
        _pickerValue: pickerState.value,
        _pendingConfirmedValue: {
          start: '',
          end: '',
        },
        _hasPendingConfirmed: false,
      } satisfies Partial<PickerDatetimeRangeMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: PickerDatetimeRangeMiniData) {
      return resolveOpen(data);
    },
    $resolvedMode(data: PickerDatetimeRangeMiniData) {
      return resolveDateTimeMode(data.mode);
    },
    $resolvedColor(data: PickerDatetimeRangeMiniData) {
      return resolveColor(data.color);
    },
    $resolvedTone(data: PickerDatetimeRangeMiniData) {
      return resolveTone(data.tone);
    },
    $buttonTone(data: PickerDatetimeRangeMiniData) {
      return resolveButtonTone(data.tone);
    },
    $resolvedSize(data: PickerDatetimeRangeMiniData) {
      return resolveSize(data.size);
    },
    $resolvedFormat(data: PickerDatetimeRangeMiniData) {
      return resolveDateTimeFormat({
        mode: resolveDateTimeMode(data.mode),
        format: data.format,
      });
    },
    $resolvedRangeValue(data: PickerDatetimeRangeMiniData) {
      const format = resolveDateTimeFormat({
        mode: resolveDateTimeMode(data.mode),
        format: data.format,
      });
      return formatRangeValue({
        value: resolveCommittedRangeParts(data),
        format,
      });
    },
    $displayValue(data: PickerDatetimeRangeMiniData) {
      const format = resolveDateTimeFormat({
        mode: resolveDateTimeMode(data.mode),
        format: data.format,
      });
      return resolveDisplayValue({
        value: formatRangeValue({
          value: resolveCommittedRangeParts(data),
          format,
        }),
        separator: data.valueSeparator || ' ~ ',
      });
    },
    $drawerTitle(data: PickerDatetimeRangeMiniData) {
      return data.drawerTitle || data.label || '';
    },
    $confirmText(data: PickerDatetimeRangeMiniData) {
      return data.confirmText || '确认';
    },
    $isConfirmDisabled(data: PickerDatetimeRangeMiniData) {
      return Boolean(data.isDisabled || data.isReadOnly);
    },
    $classNames(data: PickerDatetimeRangeMiniData) {
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
        rangeBody: ensureClassName(slots.rangeBody({ class: classNames.rangeBody })),
        $rangeTabs: ensureClassName(
          slots.$rangeTabs({ class: classNames.$rangeTabs }),
        ),
        rangeTabs: ensureClassName(slots.rangeTabs({ class: classNames.rangeTabs })),
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
    $drawerClassNames(data: PickerDatetimeRangeMiniData) {
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: committed,
        includeSecond,
        yearRange,
      });
      const shouldResetDraft = !resolveOpen(this.data as PickerDatetimeRangeMiniData);
      const formatted = formatRangeValue({
        value: committed,
        format,
      });

      this.setData({
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        ...(shouldResetDraft
          ? {
              _draftRange: committed,
              _activeRange: activeRange,
              _activePanel: pickerState.panel,
              _pickerColumns: pickerState.columns,
              _pickerValue: pickerState.value,
            }
          : {}),
      } satisfies Partial<PickerDatetimeRangeMiniState>);
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
        } satisfies Partial<PickerDatetimeRangeMiniState>,
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: committed,
        includeSecond,
        yearRange,
      });

      this.setData(
        {
          _draftRange: committed,
          _activeRange: activeRange,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
          _pendingConfirmedValue: {
            start: '',
            end: '',
          },
          _hasPendingConfirmed: false,
        } satisfies Partial<PickerDatetimeRangeMiniState>,
        () => {
          this.requestOpenChange(true, 'field');
        },
      );
    },

    handleRangeTabTap(
      e: WechatMiniprogram.TouchEvent & {
        currentTarget: {
          dataset: {
            range?: PickerDatetimeRangeMiniRange;
          };
        };
      },
    ) {
      const activeRange = e.currentTarget.dataset.range === 'end' ? 'end' : 'start';
      const mode = resolveDateTimeMode(this.data.mode);
      const format = resolveDateTimeFormat({
        mode,
        format: this.data.format,
      });
      const includeSecond = hasSecondToken(format);
      const yearRange = resolveYearRange(this.data.minYear, this.data.maxYear);
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: this.data._draftRange,
        includeSecond,
        yearRange,
      });

      this.setData({
        _activeRange: activeRange,
        _activePanel: pickerState.panel,
        _pickerColumns: pickerState.columns,
        _pickerValue: pickerState.value,
      } satisfies Partial<PickerDatetimeRangeMiniState>);
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: this.data._draftRange,
        includeSecond,
        yearRange,
      });

      this.setData({
        _activePanel: pickerState.panel,
        _pickerColumns: pickerState.columns,
        _pickerValue: pickerState.value,
      } satisfies Partial<PickerDatetimeRangeMiniState>);
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const source = e.detail?.values ?? e.detail?.value;
      const nextActiveParts = resolveDateTimePartsFromPickerValue({
        value: source,
        panel,
        current: this.data._draftRange[activeRange],
        range: yearRange,
        includeSecond,
      });
      const merged = normalizeDateTimeRangeOrder({
        rangeValue: {
          ...this.data._draftRange,
          [activeRange]: nextActiveParts,
        },
        activeRange,
        mode,
      });
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: merged,
        includeSecond,
        yearRange,
      });
      const detail = toValueDetail({
        data: this.data as PickerDatetimeRangeMiniData,
        activeRange,
        panel: pickerState.panel,
        format,
        value: merged,
      });

      this.setData(
        {
          _draftRange: merged,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
        } satisfies Partial<PickerDatetimeRangeMiniState>,
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);
      const normalized = normalizeDateTimeRangeOrder({
        rangeValue: this.data._draftRange,
        activeRange,
        mode,
      });
      const formatted = formatRangeValue({
        value: normalized,
        format,
      });
      const detail = toValueDetail({
        data: this.data as PickerDatetimeRangeMiniData,
        activeRange,
        panel,
        format,
        value: normalized,
      });

      this.setData(
        {
          _hasPendingConfirmed: true,
          _pendingConfirmedValue: formatted,
          ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        } satisfies Partial<PickerDatetimeRangeMiniState>,
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
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const panel = resolveDateTimePanel(mode, this.data._activePanel);

      if (nextOpen) {
        const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
        const pickerState = toPickerState({
          mode,
          panel,
          activeRange,
          rangeParts: committed,
          includeSecond,
          yearRange,
        });

        this.setData(
          {
            _draftRange: committed,
            _activePanel: pickerState.panel,
            _pickerColumns: pickerState.columns,
            _pickerValue: pickerState.value,
            _pendingConfirmedValue: {
              start: '',
              end: '',
            },
            _hasPendingConfirmed: false,
          } satisfies Partial<PickerDatetimeRangeMiniState>,
          () => {
            this.requestOpenChange(true, 'drawer');
          },
        );
        return;
      }

      if (this.data._hasPendingConfirmed) {
        const committedFromPending = resolveCommittedRangeParts({
          ...(this.data as PickerDatetimeRangeMiniData),
          value: this.data._pendingConfirmedValue,
        } as PickerDatetimeRangeMiniData);
        const pickerState = toPickerState({
          mode,
          panel,
          activeRange,
          rangeParts: committedFromPending,
          includeSecond,
          yearRange,
        });

        this.setData(
          {
            _draftRange: committedFromPending,
            _activePanel: pickerState.panel,
            _pickerColumns: pickerState.columns,
            _pickerValue: pickerState.value,
            _pendingConfirmedValue: {
              start: '',
              end: '',
            },
            _hasPendingConfirmed: false,
          } satisfies Partial<PickerDatetimeRangeMiniState>,
          () => {
            this.requestOpenChange(false, 'confirm');
          },
        );
        return;
      }

      const committed = resolveCommittedRangeParts(this.data as PickerDatetimeRangeMiniData);
      const pickerState = toPickerState({
        mode,
        panel,
        activeRange,
        rangeParts: committed,
        includeSecond,
        yearRange,
      });
      const detail = toValueDetail({
        data: this.data as PickerDatetimeRangeMiniData,
        activeRange,
        panel: pickerState.panel,
        format,
        value: committed,
      });

      this.setData(
        {
          _draftRange: committed,
          _activePanel: pickerState.panel,
          _pickerColumns: pickerState.columns,
          _pickerValue: pickerState.value,
        } satisfies Partial<PickerDatetimeRangeMiniState>,
        () => {
          this.requestOpenChange(false, 'dismiss');
          this.triggerEvent('cancel', detail);
        },
      );
    },
  },
});

export { picker } from '@srcube-ui/styles/components/picker/style';
export type {
  PickerDatetimeRangeMiniProps,
  PickerDatetimeRangeMiniRange,
  PickerDatetimeRangeMiniValue,
} from './props';
export { pickerDatetimeRangeMiniProps } from './props';
