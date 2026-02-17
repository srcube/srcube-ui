import { UIComponent } from '@srcube-ui/runtime/mini';
import { picker } from '../../style';
import type { PickerMiniColumn, PickerMiniMultiValue } from '../props';
import type {
  DateRangePickerMiniProps,
  DateRangePickerMiniRange,
  DateRangePickerMiniValue,
} from './props';
import { dateRangePickerMiniProps } from './props';

type DateParts = {
  year: number;
  month: number;
  day: number;
};

type DateRangeParts = Record<DateRangePickerMiniRange, DateParts>;

type YearRange = {
  minYear: number;
  maxYear: number;
};

type DateRangePickerMiniState = {
  _innerOpen: boolean;
  _innerValue: DateRangePickerMiniValue;
  _draftRange: DateRangeParts;
  _pickerValue: PickerMiniMultiValue;
  _pickerColumns: PickerMiniColumn[];
  _activeRange: DateRangePickerMiniRange;
  _pendingConfirmedValue: DateRangePickerMiniValue;
  _hasPendingConfirmed: boolean;
};

type DateRangePickerMiniData = DateRangePickerMiniProps & DateRangePickerMiniState;

type PickerMiniColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

type PickerMiniSize = 'sm' | 'md' | 'lg';

const DEFAULT_MIN_YEAR = 1900;
const DEFAULT_MAX_YEAR = 2099;

function ensureClassName(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function isControlledOpen(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveOpen(data: Pick<DateRangePickerMiniData, 'isOpen' | '_innerOpen'>) {
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

function resolveYearRange(data: Pick<DateRangePickerMiniData, 'minYear' | 'maxYear'>): YearRange {
  const rawMin = Number(data.minYear ?? DEFAULT_MIN_YEAR);
  const rawMax = Number(data.maxYear ?? DEFAULT_MAX_YEAR);
  const minYear = Number.isFinite(rawMin) ? rawMin : DEFAULT_MIN_YEAR;
  const maxYear = Number.isFinite(rawMax) ? rawMax : DEFAULT_MAX_YEAR;

  if (minYear <= maxYear) {
    return { minYear, maxYear };
  }

  return { minYear: maxYear, maxYear: minYear };
}

function parseDateValue(value: unknown): DateParts | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const matched = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!matched) {
    return null;
  }

  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function normalizeDateParts(parts: DateParts, range: YearRange): DateParts {
  const year = Math.min(range.maxYear, Math.max(range.minYear, Number(parts.year) || 0));
  const month = Math.min(12, Math.max(1, Number(parts.month) || 1));
  const dayLimit = getDaysInMonth(year, month);
  const day = Math.min(dayLimit, Math.max(1, Number(parts.day) || 1));

  return {
    year,
    month,
    day,
  };
}

function getFallbackParts(range: YearRange): DateParts {
  const today = new Date();
  return normalizeDateParts(
    {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    },
    range,
  );
}

function compareDateParts(a: DateParts, b: DateParts) {
  if (a.year !== b.year) {
    return a.year - b.year;
  }

  if (a.month !== b.month) {
    return a.month - b.month;
  }

  return a.day - b.day;
}

function normalizeRangeOrder(
  rangeValue: DateRangeParts,
  activeRange: DateRangePickerMiniRange,
): DateRangeParts {
  if (compareDateParts(rangeValue.start, rangeValue.end) <= 0) {
    return rangeValue;
  }

  if (activeRange === 'start') {
    return {
      start: rangeValue.start,
      end: rangeValue.start,
    };
  }

  return {
    start: rangeValue.end,
    end: rangeValue.end,
  };
}

function normalizeRangeValueInput(value: unknown): DateRangePickerMiniValue | null {
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

function resolveCommittedRangeParts(data: DateRangePickerMiniData): DateRangeParts {
  const range = resolveYearRange(data);
  const fallback = getFallbackParts(range);

  const source = isControlledValue(data.value)
    ? normalizeRangeValueInput(data.value)
    : normalizeRangeValueInput(data._innerValue) ??
      normalizeRangeValueInput(data.defaultValue);

  const startRaw = source?.start ?? null;
  const endRaw = source?.end ?? null;
  const start = startRaw ? normalizeDateParts(parseDateValue(startRaw) ?? fallback, range) : fallback;
  const end = endRaw
    ? normalizeDateParts(parseDateValue(endRaw) ?? start, range)
    : start;

  return normalizeRangeOrder(
    {
      start,
      end,
    },
    'end',
  );
}

function resolvePickerPartNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function resolvePartsFromPickerValue(
  value: unknown,
  range: YearRange,
  fallback: DateParts,
): DateParts {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const year = resolvePickerPartNumber(value[0]) ?? fallback.year;
  const month = resolvePickerPartNumber(value[1]) ?? fallback.month;
  const day = resolvePickerPartNumber(value[2]) ?? fallback.day;

  return normalizeDateParts(
    {
      year,
      month,
      day,
    },
    range,
  );
}

function buildDateColumns(parts: DateParts, range: YearRange): PickerMiniColumn[] {
  const daysInMonth = getDaysInMonth(parts.year, parts.month);

  return [
    {
      id: 'year',
      items: Array.from({ length: range.maxYear - range.minYear + 1 }, (_, index) => {
        const year = range.minYear + index;
        return {
          id: year,
          label: `${year} 年`,
        };
      }),
    },
    {
      id: 'month',
      items: Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        return {
          id: month,
          label: `${month} 月`,
        };
      }),
    },
    {
      id: 'day',
      items: Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        return {
          id: day,
          label: `${day} 日`,
        };
      }),
    },
  ];
}

function formatDateValue(parts: DateParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
}

function formatRangeValue(rangeValue: DateRangeParts): DateRangePickerMiniValue {
  return {
    start: formatDateValue(rangeValue.start),
    end: formatDateValue(rangeValue.end),
  };
}

function resolveDisplayValue(params: {
  value: DateRangePickerMiniValue;
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

function buildPickerState(params: {
  rangeParts: DateRangeParts;
  activeRange: DateRangePickerMiniRange;
  yearRange: YearRange;
}) {
  const { rangeParts, activeRange, yearRange } = params;
  const activeParts = rangeParts[activeRange];

  return {
    _pickerValue: [activeParts.year, activeParts.month, activeParts.day] as PickerMiniMultiValue,
    _pickerColumns: buildDateColumns(activeParts, yearRange),
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    dateRangePickerMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerOpen: false,
    _innerValue: {
      start: '',
      end: '',
    },
    _draftRange: {
      start: {
        year: 2000,
        month: 1,
        day: 1,
      },
      end: {
        year: 2000,
        month: 1,
        day: 1,
      },
    } as DateRangeParts,
    _pickerValue: [] as PickerMiniMultiValue,
    _pickerColumns: [] as PickerMiniColumn[],
    _activeRange: 'start' as DateRangePickerMiniRange,
    _pendingConfirmedValue: {
      start: '',
      end: '',
    },
    _hasPendingConfirmed: false,
  } satisfies DateRangePickerMiniState,

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
    minYear() {
      this.syncFromCommitted();
    },
    maxYear() {
      this.syncFromCommitted();
    },
    isOpen(nextOpen: DateRangePickerMiniProps['isOpen']) {
      if (!isControlledOpen(nextOpen)) {
        return;
      }

      const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const pickerState = buildPickerState({
        rangeParts: committed,
        activeRange,
        yearRange,
      });

      if (nextOpen) {
        this.setData({
          _draftRange: committed,
          _activeRange: activeRange,
          ...pickerState,
          _hasPendingConfirmed: false,
          _pendingConfirmedValue: {
            start: '',
            end: '',
          },
        } satisfies Partial<DateRangePickerMiniState>);
        return;
      }

      const closeBase = this.data._hasPendingConfirmed
        ? normalizeRangeOrder(
            resolveCommittedRangeParts({
              ...(this.data as DateRangePickerMiniData),
              value: this.data._pendingConfirmedValue,
            } as DateRangePickerMiniData),
            activeRange,
          )
        : committed;

      const closePickerState = buildPickerState({
        rangeParts: closeBase,
        activeRange,
        yearRange,
      });

      this.setData({
        _draftRange: closeBase,
        ...closePickerState,
        _hasPendingConfirmed: false,
        _pendingConfirmedValue: {
          start: '',
          end: '',
        },
      } satisfies Partial<DateRangePickerMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const activeRange: DateRangePickerMiniRange = 'start';
      const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const pickerState = buildPickerState({
        rangeParts: committed,
        activeRange,
        yearRange,
      });
      const formatted = formatRangeValue(committed);

      this.setData({
        _innerOpen: isControlledOpen(this.data.isOpen)
          ? Boolean(this.data.isOpen)
          : Boolean(this.data.defaultOpen),
        _innerValue: formatted,
        _draftRange: committed,
        _activeRange: activeRange,
        ...pickerState,
        _pendingConfirmedValue: {
          start: '',
          end: '',
        },
        _hasPendingConfirmed: false,
      } satisfies Partial<DateRangePickerMiniState>);
    },
  },

  computed: {
    $resolvedOpen(data: DateRangePickerMiniData) {
      return resolveOpen(data);
    },
    $resolvedColor(data: DateRangePickerMiniData) {
      return resolveColor(data.color);
    },
    $resolvedSize(data: DateRangePickerMiniData) {
      return resolveSize(data.size);
    },
    $resolvedRangeValue(data: DateRangePickerMiniData) {
      return formatRangeValue(resolveCommittedRangeParts(data));
    },
    $displayValue(data: DateRangePickerMiniData) {
      return resolveDisplayValue({
        value: formatRangeValue(resolveCommittedRangeParts(data)),
        separator: data.valueSeparator || ' ~ ',
      });
    },
    $drawerTitle(data: DateRangePickerMiniData) {
      return data.drawerTitle || data.label || '';
    },
    $confirmText(data: DateRangePickerMiniData) {
      return data.confirmText || '确认';
    },
    $isConfirmDisabled(data: DateRangePickerMiniData) {
      return Boolean(data.isDisabled || data.isReadOnly);
    },
    $rangeTabs(data: DateRangePickerMiniData) {
      return [
        {
          value: 'start',
          label: data.startTabText || '开始',
        },
        {
          value: 'end',
          label: data.endTabText || '结束',
        },
      ];
    },
    $classNames(data: DateRangePickerMiniData) {
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
        $rangeTabs: ensureClassName(
          slots.$rangeTabs({ class: classNames.$rangeTabs }),
        ),
        rangeTabs: ensureClassName(slots.rangeTabs({ class: classNames.rangeTabs })),
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
    $drawerClassNames(data: DateRangePickerMiniData) {
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
      const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const pickerState = buildPickerState({
        rangeParts: committed,
        activeRange,
        yearRange,
      });
      const shouldResetDraft = !resolveOpen(this.data as DateRangePickerMiniData);
      const formatted = formatRangeValue(committed);

      this.setData({
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        ...(shouldResetDraft ? { _draftRange: committed, ...pickerState } : {}),
      } satisfies Partial<DateRangePickerMiniState>);
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
        } satisfies Partial<DateRangePickerMiniState>,
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

      const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const pickerState = buildPickerState({
        rangeParts: committed,
        activeRange,
        yearRange,
      });

      this.setData(
        {
          _draftRange: committed,
          _activeRange: activeRange,
          ...pickerState,
          _hasPendingConfirmed: false,
          _pendingConfirmedValue: {
            start: '',
            end: '',
          },
        } satisfies Partial<DateRangePickerMiniState>,
        () => {
          this.requestOpenChange(true, 'field');
        },
      );
    },

    handleRangeTabChange(
      e: WechatMiniprogram.CustomEvent<{ value?: DateRangePickerMiniRange }>,
    ) {
      const nextRange = e.detail?.value === 'end' ? 'end' : 'start';
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const pickerState = buildPickerState({
        rangeParts: this.data._draftRange,
        activeRange: nextRange,
        yearRange,
      });

      this.setData({
        _activeRange: nextRange,
        ...pickerState,
      } satisfies Partial<DateRangePickerMiniState>);
    },

    handlePickboxDraftValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);
      const source = e.detail?.values ?? e.detail?.value;
      const fallback = this.data._draftRange[activeRange];
      const nextParts = resolvePartsFromPickerValue(source, yearRange, fallback);
      const merged = normalizeRangeOrder(
        {
          ...this.data._draftRange,
          [activeRange]: nextParts,
        },
        activeRange,
      );
      const pickerState = buildPickerState({
        rangeParts: merged,
        activeRange,
        yearRange,
      });
      const formatted = formatRangeValue(merged);

      this.setData(
        {
          _draftRange: merged,
          ...pickerState,
        } satisfies Partial<DateRangePickerMiniState>,
        () => {
          this.triggerEvent('draftvaluechange', {
            value: formatted,
            activeRange,
            start: formatted.start,
            end: formatted.end,
            startDetail: merged.start,
            endDetail: merged.end,
          });
        },
      );
    },

    handleConfirmTap() {
      if (this.data.isDisabled || this.data.isReadOnly) {
        return;
      }

      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const normalized = normalizeRangeOrder(this.data._draftRange, activeRange);
      const formatted = formatRangeValue(normalized);

      this.setData(
        {
          _hasPendingConfirmed: true,
          _pendingConfirmedValue: formatted,
          ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
        } satisfies Partial<DateRangePickerMiniState>,
        () => {
          this.triggerEvent('valuechange', {
            value: formatted,
            activeRange,
            start: formatted.start,
            end: formatted.end,
            startDetail: normalized.start,
            endDetail: normalized.end,
          });

          this.requestOpenChange(false, 'confirm');
        },
      );
    },

    handleDrawerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const nextOpen = Boolean(e.detail?.isOpen);
      const activeRange = this.data._activeRange === 'end' ? 'end' : 'start';
      const yearRange = resolveYearRange(this.data as DateRangePickerMiniData);

      if (nextOpen) {
        const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
        const pickerState = buildPickerState({
          rangeParts: committed,
          activeRange,
          yearRange,
        });

        this.setData(
          {
            _draftRange: committed,
            ...pickerState,
            _hasPendingConfirmed: false,
            _pendingConfirmedValue: {
              start: '',
              end: '',
            },
          } satisfies Partial<DateRangePickerMiniState>,
          () => {
            this.requestOpenChange(true, 'drawer');
          },
        );
        return;
      }

      if (this.data._hasPendingConfirmed) {
        const committedFromPending = resolveCommittedRangeParts({
          ...(this.data as DateRangePickerMiniData),
          value: this.data._pendingConfirmedValue,
        } as DateRangePickerMiniData);
        const pickerState = buildPickerState({
          rangeParts: committedFromPending,
          activeRange,
          yearRange,
        });

        this.setData(
          {
            _draftRange: committedFromPending,
            ...pickerState,
            _hasPendingConfirmed: false,
            _pendingConfirmedValue: {
              start: '',
              end: '',
            },
          } satisfies Partial<DateRangePickerMiniState>,
          () => {
            this.requestOpenChange(false, 'confirm');
          },
        );
        return;
      }

      const committed = resolveCommittedRangeParts(this.data as DateRangePickerMiniData);
      const pickerState = buildPickerState({
        rangeParts: committed,
        activeRange,
        yearRange,
      });
      const formatted = formatRangeValue(committed);

      this.setData(
        {
          _draftRange: committed,
          ...pickerState,
        } satisfies Partial<DateRangePickerMiniState>,
        () => {
          this.requestOpenChange(false, 'dismiss');
          this.triggerEvent('cancel', {
            value: formatted,
            activeRange,
            start: formatted.start,
            end: formatted.end,
            startDetail: committed.start,
            endDetail: committed.end,
          });
        },
      );
    },
  },
});

export type {
  DateRangePickerMiniProps,
  DateRangePickerMiniRange,
  DateRangePickerMiniValue,
} from './props';
export { dateRangePickerMiniProps } from './props';
