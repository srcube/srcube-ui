import { UIComponent } from '@srcube-ui/runtime/mini';
import type { PickerMiniColumn, PickerMiniMultiValue } from '../props';
import type { DatePickerMiniProps } from './props';
import { datePickerMiniProps } from './props';

type DateParts = {
  year: number;
  month: number;
  day: number;
};

type YearRange = {
  minYear: number;
  maxYear: number;
};

type DatePickerMiniState = {
  _innerValue: string;
  _pickerValue: PickerMiniMultiValue;
  _pickerColumns: PickerMiniColumn[];
  _draftParts: DateParts;
};

type DatePickerMiniData = DatePickerMiniProps & DatePickerMiniState;

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function resolveYearRange(data: Pick<DatePickerMiniData, 'minYear' | 'maxYear'>): YearRange {
  const rawMin = Number(data.minYear ?? 1900);
  const rawMax = Number(data.maxYear ?? 2099);
  const minYear = Number.isFinite(rawMin) ? rawMin : 1900;
  const maxYear = Number.isFinite(rawMax) ? rawMax : 2099;

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

function resolveCommittedParts(data: DatePickerMiniData): DateParts {
  const range = resolveYearRange(data);
  const source = isControlledValue(data.value)
    ? data.value
    : data._innerValue || data.defaultValue;
  const parsed = parseDateValue(source);

  if (!parsed) {
    return getFallbackParts(range);
  }

  return normalizeDateParts(parsed, range);
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

function formatDateValue(parts: DateParts) {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    datePickerMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: '',
    _pickerValue: [] as PickerMiniMultiValue,
    _pickerColumns: [] as PickerMiniColumn[],
    _draftParts: {
      year: 2000,
      month: 1,
      day: 1,
    },
  } satisfies DatePickerMiniState,

  observers: {
    value() {
      if (!isControlledValue(this.data.value)) {
        return;
      }

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
    isOpen(nextOpen: DatePickerMiniProps['isOpen']) {
      if (nextOpen === null || nextOpen === undefined) {
        return;
      }

      const committed = resolveCommittedParts(this.data as DatePickerMiniData);
      const range = resolveYearRange(this.data as DatePickerMiniData);
      this.setData({
        _pickerValue: [committed.year, committed.month, committed.day],
        _draftParts: committed,
        _pickerColumns: buildDateColumns(committed, range),
      } satisfies Partial<DatePickerMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const committed = resolveCommittedParts(this.data as DatePickerMiniData);
      const range = resolveYearRange(this.data as DatePickerMiniData);
      const formatted = formatDateValue(committed);

      this.setData({
        _innerValue: isControlledValue(this.data.value)
          ? this.data._innerValue
          : formatted,
        _pickerValue: [committed.year, committed.month, committed.day],
        _pickerColumns: buildDateColumns(committed, range),
        _draftParts: committed,
      } satisfies Partial<DatePickerMiniState>);
    },
  },

  methods: {
    syncFromCommitted() {
      const committed = resolveCommittedParts(this.data as DatePickerMiniData);
      const range = resolveYearRange(this.data as DatePickerMiniData);
      const formatted = formatDateValue(committed);

      this.setData({
        _pickerValue: [committed.year, committed.month, committed.day],
        _pickerColumns: buildDateColumns(committed, range),
        _draftParts: committed,
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
      } satisfies Partial<DatePickerMiniState>);
    },

    handlePickerTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handlePickerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const isOpen = Boolean(e.detail?.isOpen);
      const committed = resolveCommittedParts(this.data as DatePickerMiniData);
      const range = resolveYearRange(this.data as DatePickerMiniData);

      this.setData({
        _pickerValue: [committed.year, committed.month, committed.day],
        _draftParts: committed,
        _pickerColumns: buildDateColumns(committed, range),
      } satisfies Partial<DatePickerMiniState>);

      this.triggerEvent('openchange', {
        isOpen,
      });
    },

    handlePickerCancel(e: WechatMiniprogram.CustomEvent) {
      const committed = resolveCommittedParts(this.data as DatePickerMiniData);
      const range = resolveYearRange(this.data as DatePickerMiniData);

      this.setData({
        _pickerValue: [committed.year, committed.month, committed.day],
        _draftParts: committed,
        _pickerColumns: buildDateColumns(committed, range),
      } satisfies Partial<DatePickerMiniState>);

      this.triggerEvent('cancel', e.detail ?? {});
    },

    handlePickerDraftValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const range = resolveYearRange(this.data as DatePickerMiniData);
      const fallback = this.data._draftParts;
      const source = e.detail?.values ?? e.detail?.value;
      const nextParts = resolvePartsFromPickerValue(source, range, fallback);
      const formatted = formatDateValue(nextParts);

      this.setData({
        _pickerValue: [nextParts.year, nextParts.month, nextParts.day],
        _draftParts: nextParts,
        _pickerColumns: buildDateColumns(nextParts, range),
      } satisfies Partial<DatePickerMiniState>);

      this.triggerEvent('draftvaluechange', {
        value: formatted,
        year: nextParts.year,
        month: nextParts.month,
        day: nextParts.day,
      });
    },

    handlePickerValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const range = resolveYearRange(this.data as DatePickerMiniData);
      const fallback = this.data._draftParts;
      const source = e.detail?.values ?? e.detail?.value;
      const nextParts = resolvePartsFromPickerValue(source, range, fallback);
      const formatted = formatDateValue(nextParts);

      this.setData({
        _pickerValue: [nextParts.year, nextParts.month, nextParts.day],
        _draftParts: nextParts,
        _pickerColumns: buildDateColumns(nextParts, range),
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
      } satisfies Partial<DatePickerMiniState>);

      this.triggerEvent('valuechange', {
        value: formatted,
        year: nextParts.year,
        month: nextParts.month,
        day: nextParts.day,
      });
    },
  },
});

export type { DatePickerMiniProps } from './props';
export { datePickerMiniProps } from './props';
