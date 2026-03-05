import { UIComponent } from '../../shared/ui-component';
import { calendarStyle, type CalendarMode } from '@srcube-ui/styles/components/calendar/style';
import {
  calendarMiniProps,
  type CalendarMiniProps,
  type CalendarMiniRangeValue,
} from './props';

type CalendarDayStatus = 'normal' | 'today' | 'selected' | 'inRange' | 'disabled';

type CalendarMiniState = {
  _anchorMonth: string;
  _visibleMonth: string;
  _value: string;
  _rangeStart: string;
  _rangeEnd: string;
  _isPickerOpen: boolean;
  _pickerValue: Array<number | null>;
  _scrollTop: number;
};

type CalendarMiniData = CalendarMiniProps & CalendarMiniState;

type SizeMetrics = {
  headerHeight: number;
  dayHeight: number;
  rowGap: number;
  bodyPaddingBottom: number;
};

type MonthBounds = {
  startMonth: Date;
  endMonth: Date;
};

type MonthSeriesItem = {
  monthDate: Date;
  monthKey: string;
  monthTitle: string;
  weekCount: number;
  bodyHeight: number;
  offset: number;
};

type RenderDayCell = {
  key: string;
  label: number;
  isPlaceholder: boolean;
  disabled: boolean;
  classes: {
    placeholder: string;
    dayCell: string;
    dayButton: string;
    dayText: string;
  };
};

type RenderMonthPanel = {
  key: string;
  title: string;
  headerId: string;
  headerClass: string;
  headerStyle: string;
  bodyClass: string;
  bodyStyle: string;
  cells: RenderDayCell[];
};

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_WINDOW = 12;

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

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toMonthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function compareDate(a: Date, b: Date) {
  const left = startOfDay(a).getTime();
  const right = startOfDay(b).getTime();

  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function compareMonth(a: Date, b: Date) {
  const left = a.getFullYear() * 12 + a.getMonth();
  const right = b.getFullYear() * 12 + b.getMonth();

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

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
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

function resolveMode(value?: string | null): CalendarMode {
  return value === 'range' ? 'range' : 'single';
}

function resolveWeekStart(value?: number) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 0;
  }

  return ((next % 7) + 7) % 7;
}

function resolveWeekLabels(weekStartsOn: number) {
  return Array.from({ length: 7 }, (_, index) => WEEK_LABELS[(index + weekStartsOn) % 7]);
}

function resolveSizeMetrics(size?: string | null): SizeMetrics {
  if (size === 'sm') {
    return {
      headerHeight: 32,
      dayHeight: 32,
      rowGap: 4,
      bodyPaddingBottom: 4,
    };
  }

  if (size === 'lg') {
    return {
      headerHeight: 40,
      dayHeight: 40,
      rowGap: 4,
      bodyPaddingBottom: 12,
    };
  }

  return {
    headerHeight: 36,
    dayHeight: 36,
    rowGap: 4,
    bodyPaddingBottom: 8,
  };
}

function resolveInitialMonth(data: {
  month?: string;
  fallbackDate?: string;
  currentMonth?: string;
}) {
  const fromProp = parseMonthKey(data.month);
  if (fromProp) {
    return fromProp;
  }

  const fromCurrent = parseMonthKey(data.currentMonth);
  if (fromCurrent) {
    return fromCurrent;
  }

  const fromDate = parseDateKey(data.fallbackDate);
  if (fromDate) {
    return startOfMonth(fromDate);
  }

  return startOfMonth(new Date());
}

function resolveMonthBounds(params: {
  minDate?: string;
  maxDate?: string;
  focusMonth: Date;
}): MonthBounds {
  const focusMonth = startOfMonth(params.focusMonth);
  const minDate = parseDateKey(params.minDate);
  const maxDate = parseDateKey(params.maxDate);

  let startMonth = minDate ? startOfMonth(minDate) : null;
  let endMonth = maxDate ? startOfMonth(maxDate) : null;

  if (startMonth && endMonth && compareMonth(startMonth, endMonth) > 0) {
    const cache = startMonth;
    startMonth = endMonth;
    endMonth = cache;
  }

  if (!startMonth && !endMonth) {
    return {
      startMonth: addMonths(focusMonth, -MONTH_WINDOW),
      endMonth: addMonths(focusMonth, MONTH_WINDOW),
    };
  }

  if (startMonth && !endMonth) {
    endMonth = addMonths(startMonth, MONTH_WINDOW * 2);
  }

  if (!startMonth && endMonth) {
    startMonth = addMonths(endMonth, -MONTH_WINDOW * 2);
  }

  if (!startMonth || !endMonth) {
    return {
      startMonth: addMonths(focusMonth, -MONTH_WINDOW),
      endMonth: addMonths(focusMonth, MONTH_WINDOW),
    };
  }

  if (compareMonth(focusMonth, startMonth) < 0) {
    startMonth = focusMonth;
  }

  if (compareMonth(focusMonth, endMonth) > 0) {
    endMonth = focusMonth;
  }

  if (compareMonth(startMonth, endMonth) > 0) {
    return {
      startMonth: endMonth,
      endMonth: startMonth,
    };
  }

  return {
    startMonth,
    endMonth,
  };
}

function clampMonth(value: Date, bounds: MonthBounds) {
  if (compareMonth(value, bounds.startMonth) < 0) {
    return bounds.startMonth;
  }

  if (compareMonth(value, bounds.endMonth) > 0) {
    return bounds.endMonth;
  }

  return value;
}

function getWeeksInMonth(monthDate: Date, weekStartsOn: number) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const leadingBlank = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const totalCells = leadingBlank + daysInMonth;
  return Math.ceil(totalCells / 7);
}

function buildMonthSeries(params: {
  bounds: MonthBounds;
  weekStartsOn: number;
  metrics: SizeMetrics;
}) {
  const { bounds, weekStartsOn, metrics } = params;
  const series: MonthSeriesItem[] = [];

  let current = bounds.startMonth;
  let offset = 0;

  while (compareMonth(current, bounds.endMonth) <= 0) {
    const weekCount = getWeeksInMonth(current, weekStartsOn);
    const bodyHeight =
      weekCount * metrics.dayHeight
      + Math.max(0, weekCount - 1) * metrics.rowGap
      + metrics.bodyPaddingBottom;

    series.push({
      monthDate: current,
      monthKey: toMonthKey(current),
      monthTitle: toMonthKey(current),
      weekCount,
      bodyHeight,
      offset,
    });

    offset += metrics.headerHeight + bodyHeight;
    current = addMonths(current, 1);
  }

  return series;
}

function buildMonthMatrix(monthDate: Date, weekStartsOn: number) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const leadingBlank = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const totalCells = leadingBlank + daysInMonth;
  const weekCount = Math.ceil(totalCells / 7);
  const today = startOfDay(new Date());

  return Array.from({ length: weekCount }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const dateNumber = weekIndex * 7 + dayIndex - leadingBlank + 1;
      if (dateNumber < 1 || dateNumber > daysInMonth) {
        return null;
      }

      const date = new Date(monthDate.getFullYear(), monthDate.getMonth(), dateNumber);

      return {
        date,
        key: toDateKey(date),
        label: dateNumber,
        isToday: isSameDate(date, today),
      };
    }),
  );
}

function resolveMonthIndexByOffset(offsets: number[], scrollTop: number) {
  if (offsets.length === 0) {
    return -1;
  }

  let left = 0;
  let right = offsets.length - 1;
  let result = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if ((offsets[mid] ?? 0) <= scrollTop + 1) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

function ensureClassNames(value: unknown) {
  if (!value || typeof value !== 'object') {
    return {} as Record<string, string | undefined>;
  }

  return value as Record<string, string | undefined>;
}

function resolveCalendarContext(data: CalendarMiniData) {
  const mode = resolveMode(data.mode);
  const normalizedRange = normalizeRange(data.rangeValue);
  const normalizedValue = normalizeDateValue(data.value);
  const fallbackDate =
    mode === 'range'
      ? (normalizedRange.start || normalizedRange.end)
      : normalizedValue;

  const initialMonth = resolveInitialMonth({
    month: data.month,
    fallbackDate,
    currentMonth: data._anchorMonth || data._visibleMonth,
  });

  const bounds = resolveMonthBounds({
    minDate: data.minDate,
    maxDate: data.maxDate,
    focusMonth: initialMonth,
  });

  const visibleMonth = clampMonth(initialMonth, bounds);
  const weekStartsOn = resolveWeekStart(data.weekStartsOn);
  const metrics = resolveSizeMetrics(data.size);
  const series = buildMonthSeries({
    bounds,
    weekStartsOn,
    metrics,
  });

  return {
    mode,
    normalizedRange,
    normalizedValue,
    weekStartsOn,
    metrics,
    bounds,
    series,
    visibleMonth,
  };
}

function resolvePickerValue(value: unknown, bounds: MonthBounds) {
  const current = Array.isArray(value) ? value : [];
  const year = Number(current[0]);
  const month = Number(current[1]);

  const fallback = bounds.startMonth;
  const nextYear = Number.isFinite(year) ? year : fallback.getFullYear();
  const nextMonth = Number.isFinite(month) ? month : fallback.getMonth() + 1;

  const clamped = clampMonth(new Date(nextYear, nextMonth - 1, 1), bounds);
  return [clamped.getFullYear(), clamped.getMonth() + 1] as Array<number | null>;
}

function resolvePickerColumns(params: {
  bounds: MonthBounds;
  draftYear: number;
}) {
  const { bounds, draftYear } = params;
  const startYear = bounds.startMonth.getFullYear();
  const endYear = bounds.endMonth.getFullYear();

  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;

    return {
      id: year,
      label: String(year),
    };
  });

  const months = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthDate = new Date(draftYear, index, 1);
    const isDisabled =
      compareMonth(monthDate, bounds.startMonth) < 0
      || compareMonth(monthDate, bounds.endMonth) > 0;

    return {
      id: month,
      label: pad(month),
      isDisabled,
    };
  });

  return [
    {
      id: 'year',
      items: years,
    },
    {
      id: 'month',
      items: months,
    },
  ];
}

function resolveVisibleMonthOffset(series: MonthSeriesItem[], monthKey: string) {
  const index = series.findIndex((item) => item.monthKey === monthKey);
  if (index < 0) {
    return 0;
  }

  return series[index]?.offset ?? 0;
}

function isDateDisabled(params: {
  date: Date;
  minDate?: Date | null;
  maxDate?: Date | null;
  disabledSet: Set<string>;
}) {
  const { date, minDate, maxDate, disabledSet } = params;

  if (minDate && compareDate(date, minDate) < 0) {
    return true;
  }

  if (maxDate && compareDate(date, maxDate) > 0) {
    return true;
  }

  return disabledSet.has(toDateKey(date));
}

function buildRenderedMonths(data: CalendarMiniData): RenderMonthPanel[] {
  const context = resolveCalendarContext(data);
  const custom = ensureClassNames(data.classNames);
  const minDate = parseDateKey(data.minDate);
  const maxDate = parseDateKey(data.maxDate);
  const disabledSet = new Set((data.disabledDates ?? []).filter(Boolean));
  const selected = parseDateKey(data._value);
  const rangeStart = parseDateKey(data._rangeStart);
  const rangeEnd = parseDateKey(data._rangeEnd);

  const baseSlots = calendarStyle({
    size: data.size,
    radius: data.radius,
    color: data.color,
    isPickerOpen: data._isPickerOpen,
  });

  return context.series.map((month) => {
    const monthMatrix = buildMonthMatrix(month.monthDate, context.weekStartsOn);

    const cells = monthMatrix.flatMap((week, weekIndex) =>
      week.map((cell, dayIndex) => {
        if (!cell) {
          return {
            key: `${month.monthKey}-${weekIndex}-${dayIndex}`,
            label: 0,
            isPlaceholder: true,
            disabled: true,
            classes: {
              placeholder: baseSlots.dayPlaceholder({ class: custom.dayPlaceholder }),
              dayCell: '',
              dayButton: '',
              dayText: '',
            },
          } satisfies RenderDayCell;
        }

        const disabled = isDateDisabled({
          date: cell.date,
          minDate,
          maxDate,
          disabledSet,
        });

        let dayStatus: CalendarDayStatus = 'normal';
        let isRangeStart = false;
        let isRangeEnd = false;

        if (context.mode === 'range') {
          const isStart = Boolean(rangeStart && isSameDate(cell.date, rangeStart));
          const isEnd = Boolean(rangeEnd && isSameDate(cell.date, rangeEnd));
          const isEdge = isStart || isEnd;
          const isSelectedRange = Boolean(
            rangeStart
              && rangeEnd
              && isInRange(cell.date, rangeStart, rangeEnd)
              && !isEdge,
          );

          if (disabled) {
            dayStatus = 'disabled';
          } else if (isEdge) {
            dayStatus = 'selected';
          } else if (isSelectedRange) {
            dayStatus = 'inRange';
          } else if (cell.isToday) {
            dayStatus = 'today';
          }

          isRangeStart = Boolean(isStart && rangeEnd);
          isRangeEnd = Boolean(isEnd && rangeStart);
        } else if (disabled) {
          dayStatus = 'disabled';
        } else if (selected && isSameDate(cell.date, selected)) {
          dayStatus = 'selected';
        } else if (cell.isToday) {
          dayStatus = 'today';
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
          isPlaceholder: false,
          disabled,
          classes: {
            placeholder: '',
            dayCell: daySlots.dayCell({ class: custom.dayCell }),
            dayButton: daySlots.dayButton({ class: custom.dayButton }),
            dayText: daySlots.dayText({ class: custom.dayText }),
          },
        } satisfies RenderDayCell;
      }),
    );

    return {
      key: month.monthKey,
      title: month.monthTitle,
      headerId: `sr-calendar-header-${month.monthKey}`,
      headerClass: baseSlots.monthHeader({ class: custom.monthHeader }),
      headerStyle: `height:${context.metrics.headerHeight}px;`,
      bodyClass: baseSlots.monthBody({ class: custom.monthBody }),
      bodyStyle: `height:${month.bodyHeight}px;`,
      cells,
    } satisfies RenderMonthPanel;
  });
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties: calendarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _anchorMonth: '' as string,
    _visibleMonth: '' as string,
    _value: '' as string,
    _rangeStart: '' as string,
    _rangeEnd: '' as string,
    _isPickerOpen: false as boolean,
    _pickerValue: [] as Array<number | null>,
    _scrollTop: 0 as number,
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
    minDate() {
      this.syncFromProps();
    },
    maxDate() {
      this.syncFromProps();
    },
    weekStartsOn() {
      this.syncFromProps();
    },
  },

  computed: {
    $classNames(data: CalendarMiniData) {
      const slots = calendarStyle({
        size: data.size,
        radius: data.radius,
        color: data.color,
        isPickerOpen: data._isPickerOpen,
      });
      const custom = ensureClassNames(data.classNames);

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        header: slots.header({ class: custom.header }),
        pickerTrigger: slots.pickerTrigger({ class: custom.pickerTrigger }),
        title: slots.title({ class: custom.title }),
        pickerIcon: slots.pickerIcon({ class: custom.pickerIcon }),
        panel: slots.panel({ class: custom.panel }),
        weekRow: slots.weekRow({ class: custom.weekRow }),
        weekCell: slots.weekCell({ class: custom.weekCell }),
        monthList: slots.monthList({ class: custom.monthList }),
        grid: slots.grid({ class: custom.grid }),
        helper: slots.helper({ class: custom.helper }),
        pickerBackdrop: slots.pickerBackdrop({ class: custom.pickerBackdrop }),
        pickerOverlay: slots.pickerOverlay({ class: custom.pickerOverlay }),
        pickerPanel: slots.pickerPanel({ class: custom.pickerPanel }),
        pickerPickbox: slots.pickerPickbox({ class: custom.pickerPickbox }),
      };
    },

    $title(data: CalendarMiniData) {
      const visible = parseMonthKey(data._visibleMonth);
      if (visible) {
        return toMonthKey(visible);
      }

      const context = resolveCalendarContext(data);
      return toMonthKey(context.visibleMonth);
    },

    $weekLabels(data: CalendarMiniData) {
      const context = resolveCalendarContext(data);
      return resolveWeekLabels(context.weekStartsOn);
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

    $monthPanels(data: CalendarMiniData) {
      return buildRenderedMonths(data);
    },

    $pickerColumns(data: CalendarMiniData) {
      const context = resolveCalendarContext(data);
      const pickerValue = resolvePickerValue(data._pickerValue, context.bounds);
      const draftYear = Number(pickerValue[0]) || context.visibleMonth.getFullYear();

      return resolvePickerColumns({
        bounds: context.bounds,
        draftYear,
      });
    },

    $pickerValue(data: CalendarMiniData) {
      const context = resolveCalendarContext(data);
      return resolvePickerValue(data._pickerValue, context.bounds);
    },
  },

  methods: {
    syncFromProps() {
      const data = this.data as CalendarMiniData;
      const context = resolveCalendarContext(data);
      const fromProp = parseMonthKey(data.month);
      const fromAnchor = parseMonthKey(data._anchorMonth);
      const anchorMonth = fromProp ?? fromAnchor ?? context.visibleMonth;

      const visibleMonthKey = toMonthKey(context.visibleMonth);
      const pickerValue = resolvePickerValue(data._pickerValue, context.bounds);
      const scrollTop = resolveVisibleMonthOffset(context.series, visibleMonthKey);

      this.setData({
        _anchorMonth: toMonthKey(anchorMonth),
        _visibleMonth: visibleMonthKey,
        _value: context.normalizedValue,
        _rangeStart: context.normalizedRange.start,
        _rangeEnd: context.normalizedRange.end,
        _pickerValue: pickerValue,
        _scrollTop: scrollTop,
      } satisfies Partial<CalendarMiniState>);
    },

    handleMonthScroll(event: WechatMiniprogram.ScrollViewScroll) {
      const data = this.data as CalendarMiniData;
      const context = resolveCalendarContext(data);
      const detail = event.detail ?? {};
      const scrollTop = Number(detail.scrollTop ?? 0);
      const offsets = context.series.map((item) => item.offset);
      const monthIndex = resolveMonthIndexByOffset(offsets, scrollTop);

      if (monthIndex < 0) {
        return;
      }

      const monthItem = context.series[monthIndex];
      if (!monthItem) {
        return;
      }

      const nextMonthKey = monthItem.monthKey;
      if (nextMonthKey === data._visibleMonth) {
        return;
      }

      this.setData({
        _visibleMonth: nextMonthKey,
        _pickerValue: [monthItem.monthDate.getFullYear(), monthItem.monthDate.getMonth() + 1],
      } satisfies Partial<CalendarMiniState>);

      this.triggerEvent('monthchange', { month: nextMonthKey });
    },

    handlePickerToggle() {
      const data = this.data as CalendarMiniData;

      if (data._isPickerOpen) {
        this.closePickerAndApply();
        return;
      }

      const context = resolveCalendarContext(data);
      const visibleMonth = parseMonthKey(data._visibleMonth) ?? context.visibleMonth;

      this.setData({
        _isPickerOpen: true,
        _pickerValue: [visibleMonth.getFullYear(), visibleMonth.getMonth() + 1],
      } satisfies Partial<CalendarMiniState>);
    },

    handlePickerBackdropTap() {
      this.closePickerAndApply();
    },

    handlePickerValueChange(event: WechatMiniprogram.CustomEvent<{ value?: unknown }>) {
      const data = this.data as CalendarMiniData;
      const context = resolveCalendarContext(data);
      const nextValue = resolvePickerValue(event.detail?.value, context.bounds);

      this.setData({
        _pickerValue: nextValue,
      } satisfies Partial<CalendarMiniState>);
    },

    closePickerAndApply() {
      const data = this.data as CalendarMiniData;
      const context = resolveCalendarContext(data);
      const pickerValue = resolvePickerValue(data._pickerValue, context.bounds);

      const nextMonthDate = new Date(
        Number(pickerValue[0]),
        Number(pickerValue[1]) - 1,
        1,
      );
      const nextMonth = clampMonth(nextMonthDate, context.bounds);
      const nextMonthKey = toMonthKey(nextMonth);
      const nextScrollTop = resolveVisibleMonthOffset(context.series, nextMonthKey);

      const changed = nextMonthKey !== data._visibleMonth;

      this.setData({
        _isPickerOpen: false,
        _visibleMonth: nextMonthKey,
        _pickerValue: [nextMonth.getFullYear(), nextMonth.getMonth() + 1],
        _scrollTop: nextScrollTop,
      } satisfies Partial<CalendarMiniState>);

      if (changed) {
        this.triggerEvent('monthchange', { month: nextMonthKey });
      }
    },

    handleDayTap(event: WechatMiniprogram.TouchEvent) {
      const data = this.data as CalendarMiniData;
      const key = String(event.currentTarget.dataset.key ?? '');
      const disabled = Boolean(event.currentTarget.dataset.disabled);

      if (!key || disabled) {
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

        return;
      }

      this.setData({
        _value: key,
      } satisfies Partial<CalendarMiniState>);

      this.triggerEvent('valuechange', { value: key });
      this.triggerEvent('change', { value: key });
    },
  },
});

export { calendarStyle } from '@srcube-ui/styles/components/calendar/style';
export type { CalendarMiniProps, CalendarMiniRangeValue } from './props';
export { calendarMiniProps } from './props';
