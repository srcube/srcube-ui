import { calendarStyle } from '@srcube-ui/styles/components/calendar';
import * as React from 'react';
import { Button } from '../button';
import type {
  CalendarRangeReactProps,
  CalendarRangeValue,
  CalendarReactProps,
} from './props';

type CalendarDayStatus =
  | 'normal'
  | 'today'
  | 'selected'
  | 'inRange'
  | 'disabled';

type CalendarDayCell = {
  date: Date;
  key: string;
  label: number;
  isToday: boolean;
  isCurrentMonth: boolean;
};

type CalendarDayVisual = {
  dayStatus: CalendarDayStatus;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
};

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DEFAULT_MIN_DATE_KEY = '1900-01-01';
const DEFAULT_MAX_DATE_KEY = '2099-12-31';

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
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    !Number.isFinite(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
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

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(month) ||
    month < 1 ||
    month > 12
  ) {
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

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
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

function resolveWeekStart(value?: number) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 0;
  }
  return ((next % 7) + 7) % 7;
}

function resolveWeekLabels(weekStartsOn: number) {
  return Array.from(
    { length: 7 },
    (_, index) => WEEK_LABELS[(index + weekStartsOn) % 7],
  );
}

function resolveInitialMonth(params: {
  month?: string;
  fallbackDate?: string;
  minDate?: string;
  maxDate?: string;
}) {
  const fromMonth = parseMonthKey(params.month);
  if (fromMonth) {
    return fromMonth;
  }

  const fromDate = parseDateKey(params.fallbackDate);
  if (fromDate) {
    return startOfMonth(fromDate);
  }

  const minDate = parseDateKey(params.minDate);
  if (minDate) {
    return startOfMonth(minDate);
  }

  const maxDate = parseDateKey(params.maxDate);
  if (maxDate) {
    return startOfMonth(maxDate);
  }

  return startOfMonth(new Date());
}

function clampMonth(month: Date, minDate?: Date | null, maxDate?: Date | null) {
  const minMonth = minDate ? startOfMonth(minDate) : null;
  const maxMonth = maxDate ? startOfMonth(maxDate) : null;

  if (minMonth && month.getTime() < minMonth.getTime()) {
    return minMonth;
  }

  if (maxMonth && month.getTime() > maxMonth.getTime()) {
    return maxMonth;
  }

  return startOfMonth(month);
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

function buildMonthGrid(params: {
  month: Date;
  weekStartsOn: number;
}) {
  const month = startOfMonth(params.month);
  const firstDay = month.getDay();
  const startOffset = (firstDay - params.weekStartsOn + 7) % 7;
  const gridStart = addDays(month, -startOffset);

  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex);
      return {
        date,
        key: toDateKey(date),
        label: date.getDate(),
        isToday: isSameDate(date, new Date()),
        isCurrentMonth: date.getMonth() === month.getMonth(),
      } satisfies CalendarDayCell;
    }),
  );
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

function resolveButtonTone(tone?: 'default' | 'dark' | null) {
  return tone === 'dark' ? 'dark' : 'light';
}

type CalendarPanelProps = {
  month?: string;
  fallbackDate?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  helperText?: React.ReactNode;
  onMonthChange?: (month: string) => void;
  size?: CalendarReactProps['size'];
  radius?: CalendarReactProps['radius'];
  color?: CalendarReactProps['color'];
  tone?: CalendarReactProps['tone'];
  className?: string;
  classNames?: CalendarReactProps['classNames'];
  style?: React.CSSProperties;
  rootRef: React.ForwardedRef<HTMLDivElement>;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
  onDayPress: (day: CalendarDayCell) => void;
  resolveDayVisual: (
    day: CalendarDayCell,
    isDisabled: boolean,
  ) => CalendarDayVisual;
};

function CalendarPanel(props: CalendarPanelProps) {
  const {
    month,
    fallbackDate,
    minDate,
    maxDate,
    disabledDates,
    weekStartsOn = 0,
    helperText,
    onMonthChange,
    size = 'md',
    radius = 'lg',
    color = 'primary',
    tone = 'default',
    className,
    classNames,
    style,
    rootRef,
    rootProps,
    onDayPress,
    resolveDayVisual,
  } = props;

  const minDateObj = React.useMemo(
    () => parseDateKey(minDate ?? DEFAULT_MIN_DATE_KEY),
    [minDate],
  );
  const maxDateObj = React.useMemo(
    () => parseDateKey(maxDate ?? DEFAULT_MAX_DATE_KEY),
    [maxDate],
  );
  const [visibleMonth, setVisibleMonth] = React.useState(() =>
    clampMonth(
      resolveInitialMonth({ month, fallbackDate, minDate, maxDate }),
      minDateObj,
      maxDateObj,
    ),
  );

  React.useEffect(() => {
    const nextMonth = clampMonth(
      resolveInitialMonth({ month, fallbackDate, minDate, maxDate }),
      minDateObj,
      maxDateObj,
    );
    setVisibleMonth(nextMonth);
  }, [fallbackDate, month, maxDate, maxDateObj, minDate, minDateObj]);

  const disabledSet = React.useMemo(
    () => new Set((disabledDates ?? []).filter(Boolean)),
    [disabledDates],
  );
  const resolvedWeekStart = resolveWeekStart(weekStartsOn);
  const weekLabels = React.useMemo(
    () => resolveWeekLabels(resolvedWeekStart),
    [resolvedWeekStart],
  );
  const monthGrid = React.useMemo(
    () => buildMonthGrid({ month: visibleMonth, weekStartsOn: resolvedWeekStart }),
    [resolvedWeekStart, visibleMonth],
  );

  const canGoPrev = React.useMemo(() => {
    if (!minDateObj) {
      return true;
    }
    return startOfMonth(visibleMonth).getTime() > startOfMonth(minDateObj).getTime();
  }, [minDateObj, visibleMonth]);

  const canGoNext = React.useMemo(() => {
    if (!maxDateObj) {
      return true;
    }
    return startOfMonth(visibleMonth).getTime() < startOfMonth(maxDateObj).getTime();
  }, [maxDateObj, visibleMonth]);

  const updateMonth = React.useCallback(
    (next: Date) => {
      const nextMonth = clampMonth(next, minDateObj, maxDateObj);
      setVisibleMonth(nextMonth);
      onMonthChange?.(toMonthKey(nextMonth));
    },
    [maxDateObj, minDateObj, onMonthChange],
  );

  const rootSlots = React.useMemo(
    () =>
      calendarStyle({
        size,
        radius,
        color,
        tone,
        isPickerOpen: false,
      }),
    [color, radius, size, tone],
  );

  return (
    <div
      ref={rootRef}
      className={rootSlots.base({ class: [classNames?.base, className] })}
      style={style}
      {...rootProps}
    >
      <div className={rootSlots.header({ class: classNames?.header })}>
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canGoPrev}
            onClick={() => {
              if (!canGoPrev) {
                return;
              }
              updateMonth(addMonths(visibleMonth, -1));
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="icon-chevron-left" />
          </button>

          <div className="min-w-0 flex-1">
            <div className={rootSlots.title({ class: classNames?.title })}>
              {formatMonthTitle(visibleMonth)}
            </div>
            <div className="mt-1 text-xs text-slate-400">{toMonthKey(visibleMonth)}</div>
          </div>

          <Button
            color="default"
            tone={resolveButtonTone(tone)}
            variant="flat"
            radius="full"
            size={size}
            className={rootSlots.pickerTrigger({ class: classNames?.pickerTrigger })}
            onTap={() => {
              updateMonth(startOfMonth(new Date()));
            }}
          >
            Today
          </Button>

          <button
            type="button"
            aria-label="Next month"
            disabled={!canGoNext}
            onClick={() => {
              if (!canGoNext) {
                return;
              }
              updateMonth(addMonths(visibleMonth, 1));
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="icon-chevron-right" />
          </button>
        </div>
      </div>

      <div className={rootSlots.panel({ class: classNames?.panel })}>
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

        <div className="grid grid-cols-7 gap-y-1">
          {monthGrid.flatMap((week) => week).map((day) => {
            const disabled = isDateDisabled({
              date: day.date,
              minDate: minDateObj,
              maxDate: maxDateObj,
              disabledSet,
            });

            const visual = resolveDayVisual(day, disabled);
            const daySlots = calendarStyle({
              size,
              radius,
              color,
              tone,
              dayStatus: visual.dayStatus,
              isRangeStart: Boolean(visual.isRangeStart),
              isRangeEnd: Boolean(visual.isRangeEnd),
            });

            return (
              <div
                key={day.key}
                className={daySlots.dayCell({ class: classNames?.dayCell })}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
                    onDayPress(day);
                  }}
                  className={daySlots.dayButton({ class: classNames?.dayButton })}
                >
                  <span
                    className={daySlots.dayText({
                      class: [
                        classNames?.dayText,
                        !day.isCurrentMonth ? 'opacity-35' : '',
                      ],
                    })}
                  >
                    {day.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {helperText ? (
        <div className={rootSlots.helper({ class: classNames?.helper })}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
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
      tone,
      className,
      classNames,
      style,
      children: _children,
      ...rest
    } = props;
    void _children;

    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const selectedValue = value ?? internalValue;
    const selectedDate = React.useMemo(
      () => parseDateKey(selectedValue),
      [selectedValue],
    );

    return (
      <CalendarPanel
        month={month}
        minDate={minDate}
        maxDate={maxDate}
        disabledDates={disabledDates}
        weekStartsOn={weekStartsOn}
        helperText={helperText}
        onMonthChange={onMonthChange}
        size={size}
        radius={radius}
        color={color}
        tone={tone}
        className={className}
        classNames={classNames}
        style={style}
        rootRef={ref}
        rootProps={rest}
        fallbackDate={selectedValue || defaultValue}
        onDayPress={(day) => {
          if (value === undefined) {
            setInternalValue(day.key);
          }
          onValueChange?.(day.key);
        }}
        resolveDayVisual={(day, isDisabled) => {
          if (isDisabled) {
            return { dayStatus: 'disabled' };
          }
          if (selectedDate && isSameDate(day.date, selectedDate)) {
            return { dayStatus: 'selected' };
          }
          if (day.isToday) {
            return { dayStatus: 'today' };
          }
          return { dayStatus: 'normal' };
        }}
      />
    );
  },
);

Calendar.displayName = 'Srcube.Calendar';

export const CalendarRange = React.forwardRef<
  HTMLDivElement,
  CalendarRangeReactProps
>((props, ref) => {
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
    tone,
    className,
    classNames,
    style,
    children: _children,
    ...rest
  } = props;
  void _children;

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

  return (
    <CalendarPanel
      month={month}
      minDate={minDate}
      maxDate={maxDate}
      disabledDates={disabledDates}
      weekStartsOn={weekStartsOn}
      helperText={
        helperText ?? `${selectedValue.start ?? '--'} ~ ${selectedValue.end ?? '--'}`
      }
      onMonthChange={onMonthChange}
      size={size}
      radius={radius}
      color={color}
      tone={tone}
      className={className}
      classNames={classNames}
      style={style}
      rootRef={ref}
      rootProps={rest}
      fallbackDate={
        selectedValue.start ||
        selectedValue.end ||
        defaultValue?.start ||
        defaultValue?.end
      }
      onDayPress={(day) => {
        let nextValue: CalendarRangeValue;
        if (!selectedValue.start || (selectedValue.start && selectedValue.end)) {
          nextValue = {
            start: day.key,
            end: undefined,
          };
        } else {
          const startDate = parseDateKey(selectedValue.start);
          if (!startDate) {
            nextValue = {
              start: day.key,
              end: undefined,
            };
          } else if (compareDate(day.date, startDate) < 0) {
            nextValue = {
              start: day.key,
              end: selectedValue.start,
            };
          } else {
            nextValue = {
              start: selectedValue.start,
              end: day.key,
            };
          }
        }

        const normalized = normalizeRange(nextValue);
        if (value === undefined) {
          setInternalValue(normalized);
        }
        onValueChange?.(normalized);
      }}
      resolveDayVisual={(day, isDisabled) => {
        if (isDisabled) {
          return { dayStatus: 'disabled' };
        }

        const isStart = selectedStart ? isSameDate(day.date, selectedStart) : false;
        const isEnd = selectedEnd ? isSameDate(day.date, selectedEnd) : false;
        const isEdge = isStart || isEnd;
        const isSelectedRange = Boolean(
          selectedStart &&
            selectedEnd &&
            isInRange(day.date, selectedStart, selectedEnd) &&
            !isEdge,
        );

        if (isEdge) {
          return {
            dayStatus: 'selected',
            isRangeStart: Boolean(isStart && selectedEnd),
            isRangeEnd: Boolean(isEnd && selectedStart),
          };
        }

        if (isSelectedRange) {
          return { dayStatus: 'inRange' };
        }

        if (day.isToday) {
          return { dayStatus: 'today' };
        }

        return { dayStatus: 'normal' };
      }}
    />
  );
});

CalendarRange.displayName = 'Srcube.CalendarRange';
