import { Button } from '@srcube-ui/button/react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from '@srcube-ui/drawer/react';
import { Field } from '@srcube-ui/field/react';
import { Pickbox } from '@srcube-ui/pickbox/react';
import { Tabs } from '@srcube-ui/tabs/react';
import * as React from 'react';
import { picker } from '../style';
import type {
  DatePickerValue,
  DatePickerValueDetail,
  DateRangePickerRange,
  DateRangePickerReactProps,
  DateRangePickerValue,
  DateRangePickerValueDetail,
  PickerColumn,
  PickerMultiValue,
  PickerSingleValue,
} from './props';

type DateParts = DatePickerValueDetail;
type RangeParts = Record<DateRangePickerRange, DateParts>;

type YearRange = {
  minYear: number;
  maxYear: number;
};

const DEFAULT_MIN_YEAR = 1900;
const DEFAULT_MAX_YEAR = 2099;

function resolveYearRange(minYear?: number, maxYear?: number): YearRange {
  const parsedMin = Number.isFinite(minYear) ? Number(minYear) : DEFAULT_MIN_YEAR;
  const parsedMax = Number.isFinite(maxYear) ? Number(maxYear) : DEFAULT_MAX_YEAR;

  if (parsedMin <= parsedMax) {
    return {
      minYear: parsedMin,
      maxYear: parsedMax,
    };
  }

  return {
    minYear: parsedMax,
    maxYear: parsedMin,
  };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function normalizeDateParts(parts: DateParts, range: YearRange): DateParts {
  const year = Math.min(range.maxYear, Math.max(range.minYear, parts.year));
  const month = Math.min(12, Math.max(1, parts.month));
  const maxDay = getDaysInMonth(year, month);
  const day = Math.min(maxDay, Math.max(1, parts.day));

  return {
    year,
    month,
    day,
  };
}

function parseDateValue(value: DatePickerValue): DateParts | null {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function getFallbackDateParts(range: YearRange): DateParts {
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

function resolveDateParts(value: DatePickerValue, range: YearRange): DateParts {
  const parsed = parseDateValue(value);
  if (!parsed) {
    return getFallbackDateParts(range);
  }

  return normalizeDateParts(parsed, range);
}

function formatDateValue(parts: DateParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
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
  rangeValue: RangeParts,
  activeRange: DateRangePickerRange,
): RangeParts {
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

function resolveRangeValue(
  value: DateRangePickerValue | undefined,
  range: YearRange,
): RangeParts {
  const fallback = getFallbackDateParts(range);
  const startRaw = value?.start ?? null;
  const endRaw = value?.end ?? null;
  const start = resolveDateParts(startRaw, range);
  const end = resolveDateParts(endRaw, range);

  return normalizeRangeOrder(
    {
      start: startRaw === null ? fallback : start,
      end: endRaw === null ? startRaw === null ? fallback : start : end,
    },
    'end',
  );
}

function formatRangeValue(rangeValue: RangeParts): DateRangePickerValue {
  return {
    start: formatDateValue(rangeValue.start),
    end: formatDateValue(rangeValue.end),
  };
}

function resolveRangeDisplayValue(params: {
  value: DateRangePickerValue;
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

function resolveValueArray(value: PickerSingleValue | PickerMultiValue): PickerMultiValue {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function resolveDraftPartsFromValue(
  value: PickerSingleValue | PickerMultiValue,
  range: YearRange,
): DateParts {
  const values = resolveValueArray(value);
  const nextParts = {
    year: Number(values[0] ?? 0),
    month: Number(values[1] ?? 0),
    day: Number(values[2] ?? 0),
  };

  return normalizeDateParts(nextParts, range);
}

function createDateColumns(parts: DateParts, range: YearRange): PickerColumn[] {
  const daysInMonth = getDaysInMonth(parts.year, parts.month);

  return [
    {
      id: 'year',
      items: Array.from(
        { length: range.maxYear - range.minYear + 1 },
        (_, index) => {
          const year = range.minYear + index;
          return {
            id: year,
            label: `${year} 年`,
          };
        },
      ),
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

function toRangeDetail(
  activeRange: DateRangePickerRange,
  rangeValue: RangeParts,
): DateRangePickerValueDetail {
  return {
    activeRange,
    start: rangeValue.start,
    end: rangeValue.end,
  };
}

function resolvePickerColor(
  value: DateRangePickerReactProps['color'],
): NonNullable<DateRangePickerReactProps['color']> {
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

function resolvePickerSize(
  value: DateRangePickerReactProps['size'],
): NonNullable<DateRangePickerReactProps['size']> {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

export const DateRangePicker = React.forwardRef<
  HTMLDivElement,
  DateRangePickerReactProps
>((props, ref) => {
  const {
    id,
    label,
    labelPlacement,
    placeholder = '请选择',
    description,
    errorMessage,
    color,
    variant,
    size,
    radius,
    isDisabled,
    isReadOnly,
    isInvalid,
    isRequired,
    isLoading,
    type = 'default',
    value,
    defaultValue,
    minYear = DEFAULT_MIN_YEAR,
    maxYear = DEFAULT_MAX_YEAR,
    isOpen: isOpenProp,
    defaultOpen = false,
    confirmText = '确认',
    drawerTitle,
    isDismissable = true,
    hasBackdrop = true,
    backdrop,
    estimateSize,
    overscan = 5,
    indicatorHeight,
    scrollEndDelay = 120,
    startTabText = '开始',
    endTabText = '结束',
    valueSeparator = ' ~ ',
    className,
    classNames,
    style,
    onTap,
    onCancel,
    onOpenChange,
    onValueChange,
    onDraftValueChange,
    ...rest
  } = props;

  const resolvedSize = resolvePickerSize(size);
  const resolvedColor = resolvePickerColor(color);
  const yearRange = React.useMemo(
    () => resolveYearRange(minYear, maxYear),
    [maxYear, minYear],
  );

  const isValueControlled = value !== undefined;
  const [innerCommittedValue, setInnerCommittedValue] =
    React.useState<DateRangePickerValue>(() =>
      formatRangeValue(resolveRangeValue(defaultValue ?? value, yearRange)),
    );

  const committedParts = React.useMemo(
    () =>
      resolveRangeValue(
        isValueControlled ? value : innerCommittedValue,
        yearRange,
      ),
    [innerCommittedValue, isValueControlled, value, yearRange],
  );

  const committedValue = React.useMemo(
    () => formatRangeValue(committedParts),
    [committedParts],
  );

  const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

  const [activeRange, setActiveRange] = React.useState<DateRangePickerRange>('start');
  const [draftParts, setDraftParts] = React.useState<RangeParts>(committedParts);
  const pendingCommittedRef = React.useRef<RangeParts | null>(null);

  React.useEffect(() => {
    if (resolvedOpen) {
      setDraftParts(committedParts);
      return;
    }

    if (pendingCommittedRef.current) {
      setDraftParts(pendingCommittedRef.current);
      pendingCommittedRef.current = null;
      return;
    }

    setDraftParts(committedParts);
  }, [committedParts, resolvedOpen]);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInnerOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  const displayValue = React.useMemo(
    () =>
      resolveRangeDisplayValue({
        value: committedValue,
        separator: valueSeparator,
      }),
    [committedValue, valueSeparator],
  );

  const slots = React.useMemo(
    () =>
      picker({
        type,
        size: resolvedSize,
      }),
    [resolvedSize, type],
  );

  const drawerClassNames = React.useMemo(
    () => ({
      body: slots.drawerBody({ class: classNames?.drawerBody }),
      footer: slots.drawerFooter({ class: classNames?.drawerFooter }),
    }),
    [classNames?.drawerBody, classNames?.drawerFooter, slots],
  );

  const styleObject = typeof style === 'string' ? undefined : style;

  const handleFieldTap = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onTap?.(event);
      if (event.defaultPrevented) {
        return;
      }

      if (isDisabled || isReadOnly) {
        return;
      }

      setDraftParts(committedParts);
      setOpen(true);
    },
    [committedParts, isDisabled, isReadOnly, onTap, setOpen],
  );

  const handleRangeChange = React.useCallback((nextValue: string | number) => {
    if (nextValue === 'end') {
      setActiveRange('end');
      return;
    }

    setActiveRange('start');
  }, []);

  const activeParts = draftParts[activeRange];
  const columns = React.useMemo(
    () => createDateColumns(activeParts, yearRange),
    [activeParts, yearRange],
  );
  const pickerValue = React.useMemo<PickerMultiValue>(
    () => [activeParts.year, activeParts.month, activeParts.day],
    [activeParts],
  );

  const handleDraftValueChange = React.useCallback(
    (nextValue: PickerSingleValue | PickerMultiValue) => {
      const nextParts = resolveDraftPartsFromValue(nextValue, yearRange);

      setDraftParts((prev) => {
        const merged = normalizeRangeOrder(
          {
            ...prev,
            [activeRange]: nextParts,
          },
          activeRange,
        );
        onDraftValueChange?.(
          formatRangeValue(merged),
          toRangeDetail(activeRange, merged),
        );
        return merged;
      });
    },
    [activeRange, onDraftValueChange, yearRange],
  );

  const handleConfirmTap = React.useCallback(() => {
    const normalized = normalizeRangeOrder(draftParts, activeRange);
    const nextValue = formatRangeValue(normalized);
    pendingCommittedRef.current = normalized;

    if (!isValueControlled) {
      setInnerCommittedValue(nextValue);
    }

    onValueChange?.(nextValue, toRangeDetail(activeRange, normalized));
    setOpen(false);
  }, [activeRange, draftParts, isValueControlled, onValueChange, setOpen]);

  const handleDrawerOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraftParts(committedParts);
        setOpen(true);
        return;
      }

      const hasPendingConfirm = pendingCommittedRef.current !== null;
      const closeBase = pendingCommittedRef.current ?? committedParts;
      pendingCommittedRef.current = null;
      setDraftParts(closeBase);
      setOpen(false);

      if (!hasPendingConfirm) {
        onCancel?.();
      }
    },
    [committedParts, onCancel, setOpen],
  );

  const isConfirmDisabled = Boolean(isDisabled || isReadOnly);

  return (
    <div
      ref={ref}
      className={slots.base({ class: [classNames?.base, className] })}
      style={styleObject}
      {...rest}
    >
      <Field
        id={id}
        label={label}
        labelPlacement={labelPlacement}
        value={displayValue}
        placeholder={placeholder}
        description={description}
        errorMessage={errorMessage}
        color={resolvedColor}
        variant={variant}
        size={resolvedSize}
        radius={radius}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        isInvalid={isInvalid}
        isRequired={isRequired}
        isLoading={isLoading}
        className={slots.field({ class: classNames?.field })}
        onTap={handleFieldTap}
      />

      <Drawer
        placement="bottom"
        title={drawerTitle ?? label}
        isOpen={resolvedOpen}
        isDismissable={isDismissable}
        hasBackdrop={hasBackdrop}
        backdrop={backdrop}
        onOpenChange={handleDrawerOpenChange}
        className={slots.drawer({ class: classNames?.drawer })}
        classNames={drawerClassNames}
      >
        <DrawerContent>
          <DrawerBody>
            <div className={slots.rangeBody({ class: classNames?.rangeBody })}>
              <Tabs
                className={slots.rangeTabs({ class: classNames?.rangeTabs })}
                color={resolvedColor}
                size={resolvedSize}
                radius="full"
                items={[
                  {
                    value: 'start',
                    label: startTabText,
                  },
                  {
                    value: 'end',
                    label: endTabText,
                  },
                ]}
                value={activeRange}
                onValueChange={handleRangeChange}
              />

              <Pickbox
                className={slots.pickbox({ class: classNames?.pickbox })}
                color={resolvedColor}
                size={resolvedSize}
                columns={columns}
                value={pickerValue}
                estimateSize={estimateSize}
                overscan={overscan}
                indicatorHeight={indicatorHeight}
                scrollEndDelay={scrollEndDelay}
                onValueChange={handleDraftValueChange}
              />
            </div>
          </DrawerBody>

          <DrawerFooter>
            <Button
              className={slots.confirmButton({
                class: classNames?.confirmButton,
              })}
              color={resolvedColor}
              size={resolvedSize}
              variant="flat"
              isBlock
              isDisabled={isConfirmDisabled}
              onTap={handleConfirmTap}
            >
              {confirmText}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
});

DateRangePicker.displayName = 'Srcube.DateRangePicker';
