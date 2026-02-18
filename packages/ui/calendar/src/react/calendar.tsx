import * as React from 'react';
import { calendarStyle } from '../style';
import type {
  CalendarRangeReactProps,
  CalendarRangeValue,
  CalendarReactProps,
} from './props';

type CalendarDayCell = {
  date: Date;
  key: string;
  label: number;
  isOutsideMonth: boolean;
  isToday: boolean;
};

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

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

function normalizeRange(value: CalendarRangeValue): CalendarRangeValue {
  const start = parseDateKey(value.start);
  const end = parseDateKey(value.end);

  if (start && end && compareDate(start, end) > 0) {
    return {
      start: toDateKey(end),
      end: toDateKey(start),
    };
  }

  return {
    start: start ? toDateKey(start) : value.start,
    end: end ? toDateKey(end) : value.end,
  };
}

function resolveInitialMonth(params: {
  month?: string;
  fallbackDate?: string;
}) {
  const fromMonth = parseMonthKey(params.month);
  if (fromMonth) {
    return fromMonth;
  }

  const fallbackDate = parseDateKey(params.fallbackDate);
  if (fallbackDate) {
    return new Date(fallbackDate.getFullYear(), fallbackDate.getMonth(), 1);
  }

  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
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
    } satisfies CalendarDayCell;
  });
}

function useMonthState(params: {
  month?: string;
  fallbackDate?: string;
  onMonthChange?: (month: string) => void;
}) {
  const { month, fallbackDate, onMonthChange } = params;
  const [monthDate, setMonthDate] = React.useState(() =>
    resolveInitialMonth({
      month,
      fallbackDate,
    }),
  );

  React.useEffect(() => {
    if (!month) {
      return;
    }

    const parsed = parseMonthKey(month);
    if (parsed) {
      setMonthDate(parsed);
    }
  }, [month]);

  const setVisibleMonth = React.useCallback(
    (next: Date) => {
      const normalized = new Date(next.getFullYear(), next.getMonth(), 1);
      setMonthDate(normalized);
      onMonthChange?.(toMonthKey(normalized));
    },
    [onMonthChange],
  );

  return {
    monthDate,
    setVisibleMonth,
  };
}

function resolveWeekLabels(weekStartsOn: number) {
  return Array.from({ length: 7 }, (_, index) => WEEK_LABELS[(index + weekStartsOn) % 7]);
}

function monthTitle(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
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

export const Calendar = React.forwardRef<HTMLDivElement, CalendarReactProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onValueChange,
      month,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 0,
      helperText,
      onMonthChange,
      size,
      radius,
      color,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const selectedValue = value ?? internalValue;

    const { monthDate, setVisibleMonth } = useMonthState({
      month,
      fallbackDate: selectedValue || defaultValue,
      onMonthChange,
    });

    const minDateObj = React.useMemo(() => parseDateKey(minDate), [minDate]);
    const maxDateObj = React.useMemo(() => parseDateKey(maxDate), [maxDate]);
    const disabledSet = React.useMemo(
      () => new Set((disabledDates ?? []).filter(Boolean)),
      [disabledDates],
    );

    const selectedDateObj = React.useMemo(
      () => parseDateKey(selectedValue),
      [selectedValue],
    );
    const cells = React.useMemo(
      () => buildMonthCells(monthDate, weekStartsOn),
      [monthDate, weekStartsOn],
    );
    const weekLabels = React.useMemo(
      () => resolveWeekLabels(weekStartsOn),
      [weekStartsOn],
    );

    const rootSlots = React.useMemo(
      () =>
        calendarStyle({
          size,
          radius,
          color,
        }),
      [color, radius, size],
    );

    return (
      <div
        ref={ref}
        className={rootSlots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={rootSlots.header({ class: classNames?.header })}>
          <button
            type="button"
            className={rootSlots.navButton({ class: classNames?.navButton })}
            onClick={() => {
              setVisibleMonth(addMonths(monthDate, -1));
            }}
            aria-label="Previous month"
          >
            {'<'}
          </button>
          <div className={rootSlots.title({ class: classNames?.title })}>
            {monthTitle(monthDate)}
          </div>
          <button
            type="button"
            className={rootSlots.navButton({ class: classNames?.navButton })}
            onClick={() => {
              setVisibleMonth(addMonths(monthDate, 1));
            }}
            aria-label="Next month"
          >
            {'>'}
          </button>
        </div>

        <div className={rootSlots.weekRow({ class: classNames?.weekRow })}>
          {weekLabels.map((label) => (
            <div
              key={label}
              className={rootSlots.weekCell({ class: classNames?.weekCell })}
            >
              {label}
            </div>
          ))}
        </div>

        <div className={rootSlots.grid({ class: classNames?.grid })}>
          {cells.map((cell) => {
            const disabled = isDateDisabled({
              date: cell.date,
              minDate: minDateObj,
              maxDate: maxDateObj,
              disabledSet,
            });
            const isSelected = selectedDateObj ? isSameDate(cell.date, selectedDateObj) : false;
            const dayStatus = disabled
              ? 'disabled'
              : isSelected
                ? 'selected'
                : (cell.isToday ? 'today' : (cell.isOutsideMonth ? 'outside' : 'normal'));
            const daySlots = calendarStyle({
              size,
              radius,
              color,
              dayStatus,
            });

            return (
              <div
                key={cell.key}
                className={daySlots.dayCell({ class: classNames?.dayCell })}
              >
                <button
                  type="button"
                  className={daySlots.dayButton({ class: classNames?.dayButton })}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    const nextValue = cell.key;
                    if (value === undefined) {
                      setInternalValue(nextValue);
                    }
                    onValueChange?.(nextValue);

                    if (cell.isOutsideMonth) {
                      setVisibleMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                    }
                  }}
                >
                  <span className={daySlots.dayText({ class: classNames?.dayText })}>
                    {cell.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {helperText ? (
          <div className={rootSlots.helper({ class: classNames?.helper })}>
            {helperText}
          </div>
        ) : null}
      </div>
    );
  },
);

Calendar.displayName = 'Srcube.Calendar';

export const CalendarRange = React.forwardRef<HTMLDivElement, CalendarRangeReactProps>(
  (props, ref) => {
    const {
      value,
      defaultValue,
      onValueChange,
      month,
      minDate,
      maxDate,
      disabledDates,
      weekStartsOn = 0,
      helperText,
      onMonthChange,
      size,
      radius,
      color,
      className,
      classNames,
      style,
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState<CalendarRangeValue>(
      normalizeRange(defaultValue ?? {}),
    );
    const selectedValue = React.useMemo(
      () => normalizeRange(value ?? internalValue),
      [internalValue, value],
    );

    const selectedStart = React.useMemo(
      () => parseDateKey(selectedValue.start),
      [selectedValue.start],
    );
    const selectedEnd = React.useMemo(
      () => parseDateKey(selectedValue.end),
      [selectedValue.end],
    );

    const { monthDate, setVisibleMonth } = useMonthState({
      month,
      fallbackDate: selectedValue.start || selectedValue.end,
      onMonthChange,
    });

    const minDateObj = React.useMemo(() => parseDateKey(minDate), [minDate]);
    const maxDateObj = React.useMemo(() => parseDateKey(maxDate), [maxDate]);
    const disabledSet = React.useMemo(
      () => new Set((disabledDates ?? []).filter(Boolean)),
      [disabledDates],
    );

    const cells = React.useMemo(
      () => buildMonthCells(monthDate, weekStartsOn),
      [monthDate, weekStartsOn],
    );
    const weekLabels = React.useMemo(
      () => resolveWeekLabels(weekStartsOn),
      [weekStartsOn],
    );

    const rootSlots = React.useMemo(
      () =>
        calendarStyle({
          size,
          radius,
          color,
        }),
      [color, radius, size],
    );

    return (
      <div
        ref={ref}
        className={rootSlots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={rootSlots.header({ class: classNames?.header })}>
          <button
            type="button"
            className={rootSlots.navButton({ class: classNames?.navButton })}
            onClick={() => {
              setVisibleMonth(addMonths(monthDate, -1));
            }}
            aria-label="Previous month"
          >
            {'<'}
          </button>
          <div className={rootSlots.title({ class: classNames?.title })}>
            {monthTitle(monthDate)}
          </div>
          <button
            type="button"
            className={rootSlots.navButton({ class: classNames?.navButton })}
            onClick={() => {
              setVisibleMonth(addMonths(monthDate, 1));
            }}
            aria-label="Next month"
          >
            {'>'}
          </button>
        </div>

        <div className={rootSlots.weekRow({ class: classNames?.weekRow })}>
          {weekLabels.map((label) => (
            <div
              key={label}
              className={rootSlots.weekCell({ class: classNames?.weekCell })}
            >
              {label}
            </div>
          ))}
        </div>

        <div className={rootSlots.grid({ class: classNames?.grid })}>
          {cells.map((cell) => {
            const disabled = isDateDisabled({
              date: cell.date,
              minDate: minDateObj,
              maxDate: maxDateObj,
              disabledSet,
            });

            const isStart = selectedStart ? isSameDate(cell.date, selectedStart) : false;
            const isEnd = selectedEnd ? isSameDate(cell.date, selectedEnd) : false;
            const isEdge = isStart || isEnd;
            const isInSelectedRange = Boolean(
              selectedStart
                && selectedEnd
                && isInRange(cell.date, selectedStart, selectedEnd)
                && !isEdge,
            );

            const dayStatus = disabled
              ? 'disabled'
              : isEdge
                ? 'selected'
                : isInSelectedRange
                  ? 'inRange'
                  : (cell.isToday ? 'today' : (cell.isOutsideMonth ? 'outside' : 'normal'));

            const daySlots = calendarStyle({
              size,
              radius,
              color,
              dayStatus,
              isRangeStart: Boolean(isStart && selectedEnd),
              isRangeEnd: Boolean(isEnd && selectedStart),
            });

            return (
              <div
                key={cell.key}
                className={daySlots.dayCell({ class: classNames?.dayCell })}
              >
                <button
                  type="button"
                  className={daySlots.dayButton({ class: classNames?.dayButton })}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    const tapped = cell.key;
                    let nextValue: CalendarRangeValue;
                    if (!selectedValue.start || (selectedValue.start && selectedValue.end)) {
                      nextValue = {
                        start: tapped,
                        end: undefined,
                      };
                    } else {
                      const startDate = parseDateKey(selectedValue.start);
                      if (!startDate) {
                        nextValue = {
                          start: tapped,
                          end: undefined,
                        };
                      } else if (compareDate(cell.date, startDate) < 0) {
                        nextValue = {
                          start: tapped,
                          end: selectedValue.start,
                        };
                      } else {
                        nextValue = {
                          start: selectedValue.start,
                          end: tapped,
                        };
                      }
                    }

                    const normalized = normalizeRange(nextValue);
                    if (value === undefined) {
                      setInternalValue(normalized);
                    }
                    onValueChange?.(normalized);

                    if (cell.isOutsideMonth) {
                      setVisibleMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                    }
                  }}
                >
                  <span className={daySlots.dayText({ class: classNames?.dayText })}>
                    {cell.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className={rootSlots.helper({ class: classNames?.helper })}>
          {helperText ?? `${selectedValue.start ?? '--'} ~ ${selectedValue.end ?? '--'}`}
        </div>
      </div>
    );
  },
);

CalendarRange.displayName = 'Srcube.CalendarRange';
