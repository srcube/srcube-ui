import { calendarStyle } from '@srcube-ui/styles/components/calendar';
import * as React from 'react';
import { Button } from '../button';
import { Listbox, type ListboxItem } from '../listbox';
import { Pickbox, type PickboxColumn, type PickboxValue } from '../pickbox';
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
};

type CalendarMonthPanel = {
  monthDate: Date;
  monthKey: string;
  monthTitle: string;
  headerId: string;
  bodyId: string;
  weeks: Array<Array<CalendarDayCell | null>>;
  bodyHeight: number;
  sectionHeight: number;
};

type CalendarMonthListItem = ListboxItem & {
  type: 'header' | 'body';
  monthIndex: number;
  month: CalendarMonthPanel;
};

type CalendarDayVisual = {
  dayStatus: CalendarDayStatus;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
};

type MonthBounds = {
  startMonth: Date;
  endMonth: Date;
};

type SizeMetrics = {
  headerHeight: number;
  dayHeight: number;
  rowGap: number;
  bodyPaddingBottom: number;
};

const WEEK_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTH_WINDOW = 12;
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

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
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
}) {
  const fromMonth = parseMonthKey(params.month);
  if (fromMonth) {
    return fromMonth;
  }

  const fromDate = parseDateKey(params.fallbackDate);
  if (fromDate) {
    return startOfMonth(fromDate);
  }

  return startOfMonth(new Date());
}

function resolveSizeMetrics(size?: 'sm' | 'md' | 'lg' | null): SizeMetrics {
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

function resolveMonthBounds(params: {
  minDate?: string;
  maxDate?: string;
  focusMonth: Date;
}): MonthBounds {
  const focusMonth = startOfMonth(params.focusMonth);
  const minDate =
    parseDateKey(params.minDate) ?? parseDateKey(DEFAULT_MIN_DATE_KEY);
  const maxDate =
    parseDateKey(params.maxDate) ?? parseDateKey(DEFAULT_MAX_DATE_KEY);

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

function buildMonthWeeks(monthDate: Date, weekStartsOn: number) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
  ).getDate();
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

      const date = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        dateNumber,
      );

      return {
        date,
        key: toDateKey(date),
        label: dateNumber,
        isToday: isSameDate(date, today),
      } satisfies CalendarDayCell;
    }),
  );
}

function buildMonthPanels(params: {
  bounds: MonthBounds;
  weekStartsOn: number;
  metrics: SizeMetrics;
}) {
  const { bounds, weekStartsOn, metrics } = params;
  const months: CalendarMonthPanel[] = [];
  let current = bounds.startMonth;

  while (compareMonth(current, bounds.endMonth) <= 0) {
    const monthKey = toMonthKey(current);
    const weeks = buildMonthWeeks(current, weekStartsOn);
    const bodyHeight =
      weeks.length * metrics.dayHeight +
      Math.max(0, weeks.length - 1) * metrics.rowGap +
      metrics.bodyPaddingBottom;

    months.push({
      monthDate: current,
      monthKey,
      monthTitle: monthKey,
      headerId: `sr-calendar-month-header-${monthKey}`,
      bodyId: `sr-calendar-month-body-${monthKey}`,
      weeks,
      bodyHeight,
      sectionHeight: metrics.headerHeight + bodyHeight,
    });

    current = addMonths(current, 1);
  }

  return months;
}

function buildMonthOffsets(months: CalendarMonthPanel[]) {
  const offsets: number[] = [];
  let acc = 0;

  for (const month of months) {
    offsets.push(acc);
    acc += month.sectionHeight;
  }

  return offsets;
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
      compareMonth(monthDate, bounds.startMonth) < 0 ||
      compareMonth(monthDate, bounds.endMonth) > 0;

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
  ] satisfies PickboxColumn[];
}

function normalizePickerDraft(params: {
  value: PickboxValue;
  bounds: MonthBounds;
}) {
  const { value, bounds } = params;
  const fallbackMonth = bounds.startMonth;

  const maybeYear = Number(value[0]);
  const maybeMonth = Number(value[1]);

  const year = Number.isFinite(maybeYear)
    ? maybeYear
    : fallbackMonth.getFullYear();
  const month = Number.isFinite(maybeMonth)
    ? maybeMonth
    : fallbackMonth.getMonth() + 1;

  const clamped = clampMonth(new Date(year, month - 1, 1), bounds);
  return [clamped.getFullYear(), clamped.getMonth() + 1] as PickboxValue;
}

function toPickerDraft(date: Date): PickboxValue {
  return [date.getFullYear(), date.getMonth() + 1];
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

type CalendarPanelProps = {
  month?: string;
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  weekStartsOn?: number;
  helperText?: React.ReactNode;
  onMonthChange?: (month: string) => void;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  className?: string;
  classNames?: CalendarReactProps['classNames'];
  style?: React.CSSProperties;
  rootRef?: React.Ref<HTMLDivElement>;
  rootProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;
  fallbackDate?: string;
  onDayPress: (day: CalendarDayCell) => void;
  resolveDayVisual: (
    day: CalendarDayCell,
    isDisabled: boolean,
  ) => CalendarDayVisual;
};

function CalendarPanel(props: CalendarPanelProps) {
  const {
    month,
    minDate,
    maxDate,
    disabledDates,
    weekStartsOn,
    helperText,
    onMonthChange,
    size,
    radius,
    color,
    className,
    classNames,
    style,
    rootRef,
    rootProps,
    fallbackDate,
    onDayPress,
    resolveDayVisual,
  } = props;

  const weekStart = React.useMemo(
    () => resolveWeekStart(weekStartsOn),
    [weekStartsOn],
  );
  const weekLabels = React.useMemo(
    () => resolveWeekLabels(weekStart),
    [weekStart],
  );

  const [visibleMonthKey, setVisibleMonthKey] = React.useState(() =>
    toMonthKey(resolveInitialMonth({ month, fallbackDate })),
  );
  const [anchorMonthKey, setAnchorMonthKey] = React.useState(() =>
    toMonthKey(resolveInitialMonth({ month, fallbackDate })),
  );
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const [pickerDraft, setPickerDraft] = React.useState<PickboxValue>(() => {
    const initial = resolveInitialMonth({ month, fallbackDate });
    return toPickerDraft(initial);
  });
  const [listScrollTop, setListScrollTop] = React.useState(0);

  const visibleMonthDate = React.useMemo(() => {
    const parsed = parseMonthKey(visibleMonthKey);
    return parsed
      ? startOfMonth(parsed)
      : resolveInitialMonth({ month, fallbackDate });
  }, [fallbackDate, month, visibleMonthKey]);

  const anchorMonthDate = React.useMemo(() => {
    const parsed = parseMonthKey(anchorMonthKey);
    if (parsed) {
      return startOfMonth(parsed);
    }

    return visibleMonthDate;
  }, [anchorMonthKey, visibleMonthDate]);

  const metrics = React.useMemo(() => resolveSizeMetrics(size), [size]);

  const bounds = React.useMemo(
    () =>
      resolveMonthBounds({
        minDate,
        maxDate,
        focusMonth: anchorMonthDate,
      }),
    [anchorMonthDate, maxDate, minDate],
  );

  const monthPanels = React.useMemo(
    () =>
      buildMonthPanels({
        bounds,
        weekStartsOn: weekStart,
        metrics,
      }),
    [bounds, metrics, weekStart],
  );

  const monthOffsets = React.useMemo(
    () => buildMonthOffsets(monthPanels),
    [monthPanels],
  );

  const monthIndexByKey = React.useMemo(() => {
    const map = new Map<string, number>();
    monthPanels.forEach((item, index) => {
      map.set(item.monthKey, index);
    });
    return map;
  }, [monthPanels]);

  const visibleMonthRef = React.useRef(visibleMonthKey);
  React.useEffect(() => {
    visibleMonthRef.current = visibleMonthKey;
  }, [visibleMonthKey]);

  const notifyVisibleMonth = React.useCallback(
    (nextMonthKey: string) => {
      if (visibleMonthRef.current === nextMonthKey) {
        return;
      }
      visibleMonthRef.current = nextMonthKey;
      setVisibleMonthKey(nextMonthKey);
      onMonthChange?.(nextMonthKey);
    },
    [onMonthChange],
  );

  const syncVisibleMonth = React.useCallback((nextMonthKey: string) => {
    if (visibleMonthRef.current === nextMonthKey) {
      return;
    }
    visibleMonthRef.current = nextMonthKey;
    setVisibleMonthKey(nextMonthKey);
  }, []);

  const jumpToMonth = React.useCallback(
    (nextMonthKey: string, shouldNotify: boolean) => {
      const index = monthIndexByKey.get(nextMonthKey);
      if (index === undefined) {
        return;
      }

      setListScrollTop(monthOffsets[index] ?? 0);

      if (shouldNotify) {
        notifyVisibleMonth(nextMonthKey);
        return;
      }

      syncVisibleMonth(nextMonthKey);
    },
    [monthIndexByKey, monthOffsets, notifyVisibleMonth, syncVisibleMonth],
  );

  React.useEffect(() => {
    if (monthPanels.length === 0) {
      return;
    }

    const current = parseMonthKey(visibleMonthRef.current) ?? bounds.startMonth;
    const clamped = clampMonth(current, bounds);
    const clampedKey = toMonthKey(clamped);

    if (clampedKey !== visibleMonthRef.current) {
      jumpToMonth(clampedKey, false);
    }
  }, [bounds, jumpToMonth, monthPanels.length]);

  React.useEffect(() => {
    if (!month) {
      return;
    }

    const parsed = parseMonthKey(month);
    if (!parsed) {
      return;
    }

    setAnchorMonthKey(toMonthKey(parsed));
    const clamped = clampMonth(parsed, bounds);
    jumpToMonth(toMonthKey(clamped), false);
  }, [bounds, jumpToMonth, month]);

  const hasInitializedPositionRef = React.useRef(false);
  React.useEffect(() => {
    if (hasInitializedPositionRef.current) {
      return;
    }

    hasInitializedPositionRef.current = true;

    const initialMonth = clampMonth(visibleMonthDate, bounds);
    jumpToMonth(toMonthKey(initialMonth), false);
  }, [bounds, jumpToMonth, visibleMonthDate]);

  const monthItems = React.useMemo<CalendarMonthListItem[]>(
    () =>
      monthPanels.flatMap((monthPanel, monthIndex) => {
        const monthLabel = monthPanel.monthTitle;

        return [
          {
            id: monthPanel.headerId,
            label: monthLabel,
            isSticky: true,
            type: 'header',
            monthIndex,
            month: monthPanel,
          },
          {
            id: monthPanel.bodyId,
            label: monthLabel,
            type: 'body',
            monthIndex,
            month: monthPanel,
          },
        ];
      }),
    [monthPanels],
  );

  const estimateMonthItemSize = React.useCallback(
    (itemIndex: number) => {
      const item = monthItems[itemIndex];
      if (!item) {
        return 1;
      }

      return item.type === 'header'
        ? metrics.headerHeight
        : item.month.bodyHeight;
    },
    [metrics.headerHeight, monthItems],
  );

  const handleListScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (monthPanels.length === 0) {
        return;
      }

      const nextIndex = resolveMonthIndexByOffset(
        monthOffsets,
        Number(event.currentTarget.scrollTop ?? 0),
      );

      if (nextIndex < 0) {
        return;
      }

      const nextMonth = monthPanels[nextIndex];
      if (!nextMonth) {
        return;
      }

      notifyVisibleMonth(nextMonth.monthKey);
    },
    [monthOffsets, monthPanels, notifyVisibleMonth],
  );

  const disabledSet = React.useMemo(
    () => new Set((disabledDates ?? []).filter(Boolean)),
    [disabledDates],
  );

  const minDateObj = React.useMemo(() => parseDateKey(minDate), [minDate]);
  const maxDateObj = React.useMemo(() => parseDateKey(maxDate), [maxDate]);

  const currentVisibleMonth = React.useMemo(() => {
    const parsed = parseMonthKey(visibleMonthKey);
    return parsed ? parsed : bounds.startMonth;
  }, [bounds.startMonth, visibleMonthKey]);

  const pickerColumns = React.useMemo(
    () =>
      resolvePickerColumns({
        bounds,
        draftYear: Number(pickerDraft[0]) || currentVisibleMonth.getFullYear(),
      }),
    [bounds, currentVisibleMonth, pickerDraft],
  );

  const closePickerAndApply = React.useCallback(() => {
    const normalized = normalizePickerDraft({
      value: pickerDraft,
      bounds,
    });
    const nextMonth = new Date(
      Number(normalized[0]),
      Number(normalized[1]) - 1,
      1,
    );
    const nextMonthKey = toMonthKey(nextMonth);

    setPickerDraft(normalized);
    setIsPickerOpen(false);
    jumpToMonth(nextMonthKey, true);
  }, [bounds, jumpToMonth, pickerDraft]);

  const handlePickerToggle = React.useCallback(() => {
    if (isPickerOpen) {
      closePickerAndApply();
      return;
    }

    setPickerDraft(toPickerDraft(currentVisibleMonth));
    setIsPickerOpen(true);
  }, [closePickerAndApply, currentVisibleMonth, isPickerOpen]);

  const rootSlots = React.useMemo(
    () =>
      calendarStyle({
        size,
        radius,
        color,
        isPickerOpen,
      }),
    [color, isPickerOpen, radius, size],
  );

  return (
    <div
      ref={rootRef}
      className={rootSlots.base({ class: [classNames?.base, className] })}
      style={style}
      {...rootProps}
    >
      <div className={rootSlots.header({ class: classNames?.header })}>
        <Button
          color="default"
          variant="flat"
          radius="full"
          size={size}
          className={rootSlots.pickerTrigger({
            class: classNames?.pickerTrigger,
          })}
          onTap={handlePickerToggle}
        >
          <span className={rootSlots.title({ class: classNames?.title })}>
            {toMonthKey(currentVisibleMonth)}
          </span>
          <span
            className={rootSlots.pickerIcon({ class: classNames?.pickerIcon })}
          >
            <span className="icon-chevron-down" />
          </span>
        </Button>
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

        <Listbox
          items={monthItems}
          estimateSize={estimateMonthItemSize}
          overscan={8}
          hideMasks
          scrollTop={listScrollTop}
          scrollWithAnimation={false}
          onScroll={handleListScroll}
          classNames={{
            base: rootSlots.monthList({ class: classNames?.monthList }),
            content: 'w-full',
            item: 'items-stretch px-0 min-h-0',
            itemLabel: 'contents',
            stickyItem: 'bg-transparent',
          }}
          renderItem={(item: ListboxItem) => {
            const monthItem = item as CalendarMonthListItem;

            if (monthItem.type === 'header') {
              return (
                <div
                  id={monthItem.month.headerId}
                  className={rootSlots.monthHeader({
                    class: classNames?.monthHeader,
                  })}
                  style={{ height: `${metrics.headerHeight}px` }}
                >
                  {monthItem.month.monthTitle}
                </div>
              );
            }

            return (
              <div
                id={monthItem.month.bodyId}
                className={rootSlots.monthBody({
                  class: classNames?.monthBody,
                })}
                style={{ height: `${monthItem.month.bodyHeight}px` }}
              >
                <div className={rootSlots.grid({ class: classNames?.grid })}>
                  {monthItem.month.weeks.map(
                    (week: Array<CalendarDayCell | null>, weekIndex: number) =>
                      week.map(
                        (cell: CalendarDayCell | null, dayIndex: number) => {
                          if (!cell) {
                            return (
                              <div
                                key={`${monthItem.month.monthKey}-${weekIndex}-${dayIndex}`}
                                className={rootSlots.dayPlaceholder({
                                  class: classNames?.dayPlaceholder,
                                })}
                              />
                            );
                          }

                          const disabled = isDateDisabled({
                            date: cell.date,
                            minDate: minDateObj,
                            maxDate: maxDateObj,
                            disabledSet,
                          });

                          const visual = resolveDayVisual(cell, disabled);
                          const daySlots = calendarStyle({
                            size,
                            radius,
                            color,
                            dayStatus: visual.dayStatus,
                            isRangeStart: Boolean(visual.isRangeStart),
                            isRangeEnd: Boolean(visual.isRangeEnd),
                          });

                          return (
                            <div
                              key={cell.key}
                              className={daySlots.dayCell({
                                class: classNames?.dayCell,
                              })}
                            >
                              <button
                                type="button"
                                className={daySlots.dayButton({
                                  class: classNames?.dayButton,
                                })}
                                disabled={disabled}
                                onClick={() => {
                                  if (disabled) {
                                    return;
                                  }

                                  onDayPress(cell);
                                }}
                              >
                                <span
                                  className={daySlots.dayText({
                                    class: classNames?.dayText,
                                  })}
                                >
                                  {cell.label}
                                </span>
                              </button>
                            </div>
                          );
                        },
                      ),
                  )}
                </div>
              </div>
            );
          }}
        />

        {isPickerOpen ? (
          <>
            <button
              type="button"
              aria-label="Close year month picker"
              className={rootSlots.pickerBackdrop({
                class: classNames?.pickerBackdrop,
              })}
              onClick={closePickerAndApply}
            />

            <div
              className={rootSlots.pickerOverlay({
                class: classNames?.pickerOverlay,
              })}
            >
              <div
                className={rootSlots.pickerPanel({
                  class: classNames?.pickerPanel,
                })}
              >
                <Pickbox
                  className={rootSlots.pickerPickbox({
                    class: classNames?.pickerPickbox,
                  })}
                  classNames={{
                    base: 'border-none shadow-none',
                  }}
                  size={size}
                  color={color === 'default' ? 'default' : color}
                  columns={pickerColumns}
                  value={pickerDraft}
                  scrollEndDelay={100}
                  onValueChange={(next: PickboxValue) => {
                    const normalized = normalizePickerDraft({
                      value: next,
                      bounds,
                    });
                    const nextMonthDate = new Date(
                      Number(normalized[0]),
                      Number(normalized[1]) - 1,
                      1,
                    );
                    const nextMonthKey = toMonthKey(nextMonthDate);

                    setPickerDraft(normalized);
                    jumpToMonth(nextMonthKey, true);
                  }}
                />
              </div>
            </div>
          </>
        ) : null}
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
      className,
      classNames,
      style,
      children: _children,
      ...rest
    } = props;
    void _children;

    const [internalValue, setInternalValue] = React.useState(
      defaultValue ?? '',
    );
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
            return {
              dayStatus: 'disabled',
            };
          }

          if (selectedDate && isSameDate(day.date, selectedDate)) {
            return {
              dayStatus: 'selected',
            };
          }

          if (day.isToday) {
            return {
              dayStatus: 'today',
            };
          }

          return {
            dayStatus: 'normal',
          };
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
        helperText ??
        `${selectedValue.start ?? '--'} ~ ${selectedValue.end ?? '--'}`
      }
      onMonthChange={onMonthChange}
      size={size}
      radius={radius}
      color={color}
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
        if (
          !selectedValue.start ||
          (selectedValue.start && selectedValue.end)
        ) {
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
          return {
            dayStatus: 'disabled',
          };
        }

        const isStart = selectedStart
          ? isSameDate(day.date, selectedStart)
          : false;
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
          return {
            dayStatus: 'inRange',
          };
        }

        if (day.isToday) {
          return {
            dayStatus: 'today',
          };
        }

        return {
          dayStatus: 'normal',
        };
      }}
    />
  );
});

CalendarRange.displayName = 'Srcube.CalendarRange';
