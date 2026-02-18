import { UIComponent } from '@srcube-ui/runtime/mini';
import { calendarStyle, type CalendarMode } from '../style';
import {
  calendarMiniProps,
  type CalendarMiniProps,
  type CalendarMiniRangeValue,
} from './props';

type CalendarMiniState = {
  _month: string;
  _value: string;
  _rangeStart: string;
  _rangeEnd: string;
};

type CalendarMiniData = CalendarMiniProps & CalendarMiniState;

type CalendarCell = {
  key: string;
  label: number;
  isOutsideMonth: boolean;
  disabled: boolean;
  classes: {
    dayCell: string;
    dayButton: string;
    dayText: string;
  };
};

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(num: number) {
  return String(num).padStart(2, '0');
}

function parseDateKey(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (
    !Number.isFinite(year)
    || !Number.isFinite(month)
    || !Number.isFinite(day)
    || month < 1
    || month > 12
    || day < 1
    || day > 31
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function parseMonthKey(value?: string | null) {
  if (!value) {
    return null;
  }

  const match = String(value).match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }

  return new Date(year, month - 1, 1);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function compareDate(a: Date, b: Date) {
  const left = startOfDay(a).getTime();
  const right = startOfDay(b).getTime();

  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function isSameDate(a: Date, b: Date) {
  return compareDate(a, b) === 0;
}

function isInRange(target: Date, start: Date, end: Date) {
  return compareDate(target, start) >= 0 && compareDate(target, end) <= 0;
}

function normalizeRange(value?: CalendarMiniRangeValue | null) {
  const startDate = parseDateKey(value?.start);
  const endDate = parseDateKey(value?.end);

  if (startDate && endDate && compareDate(startDate, endDate) > 0) {
    return {
      start: toDateKey(endDate),
      end: toDateKey(startDate),
    };
  }

  return {
    start: startDate ? toDateKey(startDate) : '',
    end: endDate ? toDateKey(endDate) : '',
  };
}

function normalizeDateValue(value?: string | null) {
  const parsed = parseDateKey(value);
  return parsed ? toDateKey(parsed) : '';
}

function resolveWeekStart(value?: number) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) {
    return 0;
  }

  return ((numberValue % 7) + 7) % 7;
}

function resolveWeekLabels(weekStartsOn: number) {
  return Array.from({ length: 7 }, (_, index) => WEEK_LABELS[(index + weekStartsOn) % 7]);
}

function buildMonthCells(monthDate: Date, weekStartsOn: number) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const startDate = addDays(firstDay, -offset);
  const today = startOfDay(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(startDate, index);

    return {
      date,
      key: toDateKey(date),
      label: date.getDate(),
      isOutsideMonth: date.getMonth() !== monthDate.getMonth(),
      isToday: isSameDate(date, today),
    };
  });
}

function resolveInitialMonth(data: CalendarMiniData) {
  const fromState = parseMonthKey(data._month);
  if (fromState) {
    return toMonthKey(fromState);
  }

  const fromProp = parseMonthKey(data.month);
  if (fromProp) {
    return toMonthKey(fromProp);
  }

  const range = normalizeRange(data.rangeValue);
  const fallbackDate =
    data.mode === 'range'
      ? (range.start || range.end)
      : normalizeDateValue(data.value);

  const fallbackParsed = parseDateKey(fallbackDate);
  if (fallbackParsed) {
    return toMonthKey(new Date(fallbackParsed.getFullYear(), fallbackParsed.getMonth(), 1));
  }

  const today = new Date();
  return toMonthKey(new Date(today.getFullYear(), today.getMonth(), 1));
}

function resolveMode(value?: string | null): CalendarMode {
  return value === 'range' ? 'range' : 'single';
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties: calendarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _month: '',
    _value: '',
    _rangeStart: '',
    _rangeEnd: '',
  } satisfies CalendarMiniState,

  lifetimes: {
    attached() {
      this.syncFromProps();
    },
  },

  observers: {
    month() {
      this.syncFromProps();
    },
    value() {
      this.syncFromProps();
    },
    rangeValue() {
      this.syncFromProps();
    },
    mode() {
      this.syncFromProps();
    },
  },

  computed: {
    $classNames(data: CalendarMiniData) {
      const slots = calendarStyle({
        size: data.size,
        radius: data.radius,
        color: data.color,
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        header: slots.header({ class: custom.header }),
        title: slots.title({ class: custom.title }),
        navButton: slots.navButton({ class: custom.navButton }),
        weekRow: slots.weekRow({ class: custom.weekRow }),
        weekCell: slots.weekCell({ class: custom.weekCell }),
        grid: slots.grid({ class: custom.grid }),
        helper: slots.helper({ class: custom.helper }),
      };
    },

    $title(data: CalendarMiniData) {
      const monthDate = parseMonthKey(resolveInitialMonth(data));
      return monthDate ? toMonthKey(monthDate) : '';
    },

    $weekLabels(data: CalendarMiniData) {
      return resolveWeekLabels(resolveWeekStart(data.weekStartsOn));
    },

    $helperText(data: CalendarMiniData) {
      if (data.helperText) {
        return data.helperText;
      }

      const mode = resolveMode(data.mode);
      if (mode === 'range') {
        return `${data._rangeStart || '--'} ~ ${data._rangeEnd || '--'}`;
      }

      return data._value || '--';
    },

    $cells(data: CalendarMiniData): CalendarCell[] {
      const mode = resolveMode(data.mode);
      const monthDate = parseMonthKey(resolveInitialMonth(data));
      if (!monthDate) {
        return [];
      }

      const weekStart = resolveWeekStart(data.weekStartsOn);
      const cells = buildMonthCells(monthDate, weekStart);
      const minDate = parseDateKey(data.minDate);
      const maxDate = parseDateKey(data.maxDate);
      const disabledSet = new Set((data.disabledDates ?? []).filter(Boolean));
      const selected = parseDateKey(data._value);
      const start = parseDateKey(data._rangeStart);
      const end = parseDateKey(data._rangeEnd);
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return cells.map((cell) => {
        const isDisabled = (
          (minDate && compareDate(cell.date, minDate) < 0)
          || (maxDate && compareDate(cell.date, maxDate) > 0)
          || disabledSet.has(cell.key)
        );

        let dayStatus: 'normal' | 'outside' | 'today' | 'selected' | 'inRange' | 'disabled' = 'normal';
        let isRangeStart = false;
        let isRangeEnd = false;

        if (mode === 'range') {
          const startSelected = Boolean(start && isSameDate(cell.date, start));
          const endSelected = Boolean(end && isSameDate(cell.date, end));
          const isEdge = startSelected || endSelected;
          const inSelectedRange = Boolean(
            start
              && end
              && isInRange(cell.date, start, end)
              && !isEdge,
          );

          if (isDisabled) {
            dayStatus = 'disabled';
          } else if (isEdge) {
            dayStatus = 'selected';
          } else if (inSelectedRange) {
            dayStatus = 'inRange';
          } else if (cell.isToday) {
            dayStatus = 'today';
          } else if (cell.isOutsideMonth) {
            dayStatus = 'outside';
          }

          isRangeStart = Boolean(startSelected && end);
          isRangeEnd = Boolean(endSelected && start);
        } else if (isDisabled) {
          dayStatus = 'disabled';
        } else if (selected && isSameDate(cell.date, selected)) {
          dayStatus = 'selected';
        } else if (cell.isToday) {
          dayStatus = 'today';
        } else if (cell.isOutsideMonth) {
          dayStatus = 'outside';
        }

        const daySlots = calendarStyle({
          size: data.size,
          radius: data.radius,
          color: data.color,
          dayStatus,
          isRangeStart,
          isRangeEnd,
        });

        return {
          key: cell.key,
          label: cell.label,
          isOutsideMonth: cell.isOutsideMonth,
          disabled: isDisabled,
          classes: {
            dayCell: daySlots.dayCell({ class: custom.dayCell }),
            dayButton: daySlots.dayButton({ class: custom.dayButton }),
            dayText: daySlots.dayText({ class: custom.dayText }),
          },
        } satisfies CalendarCell;
      });
    },
  },

  methods: {
    syncFromProps() {
      const data = this.data as CalendarMiniData;
      const normalizedRange = normalizeRange(data.rangeValue);
      const normalizedValue = normalizeDateValue(data.value);
      const nextMonth = resolveInitialMonth({
        ...data,
        _value: normalizedValue,
        _rangeStart: normalizedRange.start,
        _rangeEnd: normalizedRange.end,
      });

      this.setData({
        _month: nextMonth,
        _value: normalizedValue,
        _rangeStart: normalizedRange.start,
        _rangeEnd: normalizedRange.end,
      } satisfies Partial<CalendarMiniState>);
    },

    handlePrevMonth() {
      const data = this.data as CalendarMiniData;
      const current = parseMonthKey(resolveInitialMonth(data));
      if (!current) {
        return;
      }

      const next = addMonths(current, -1);
      const month = toMonthKey(next);
      this.setData({
        _month: month,
      } satisfies Partial<CalendarMiniState>);
      this.triggerEvent('monthchange', { month });
    },

    handleNextMonth() {
      const data = this.data as CalendarMiniData;
      const current = parseMonthKey(resolveInitialMonth(data));
      if (!current) {
        return;
      }

      const next = addMonths(current, 1);
      const month = toMonthKey(next);
      this.setData({
        _month: month,
      } satisfies Partial<CalendarMiniState>);
      this.triggerEvent('monthchange', { month });
    },

    handleDayTap(event: WechatMiniprogram.TouchEvent) {
      const data = this.data as CalendarMiniData;
      const key = String(event.currentTarget.dataset.key ?? '');
      const disabled = Boolean(event.currentTarget.dataset.disabled);
      const outside = Boolean(event.currentTarget.dataset.outside);

      if (disabled) {
        return;
      }

      const tappedDate = parseDateKey(key);
      if (!tappedDate) {
        return;
      }

      const mode = resolveMode(data.mode);
      if (mode === 'range') {
        let start = data._rangeStart;
        let end = data._rangeEnd;

        if (!start || (start && end)) {
          start = key;
          end = '';
        } else {
          const startDate = parseDateKey(start);
          if (!startDate) {
            start = key;
            end = '';
          } else if (compareDate(tappedDate, startDate) < 0) {
            end = start;
            start = key;
          } else {
            end = key;
          }
        }

        this.setData({
          _rangeStart: start,
          _rangeEnd: end,
        } satisfies Partial<CalendarMiniState>);
        this.triggerEvent('valuechange', {
          value: {
            start,
            end,
          },
        });
        this.triggerEvent('change', {
          value: {
            start,
            end,
          },
        });
      } else {
        this.setData({
          _value: key,
        } satisfies Partial<CalendarMiniState>);
        this.triggerEvent('valuechange', { value: key });
        this.triggerEvent('change', { value: key });
      }

      if (outside) {
        const month = toMonthKey(new Date(tappedDate.getFullYear(), tappedDate.getMonth(), 1));
        this.setData({
          _month: month,
        } satisfies Partial<CalendarMiniState>);
        this.triggerEvent('monthchange', { month });
      }
    },
  },
});

export { calendarStyle } from '../style';
export type { CalendarMiniProps, CalendarMiniRangeValue } from './props';
export { calendarMiniProps } from './props';
