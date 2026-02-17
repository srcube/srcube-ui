import * as React from 'react';
import { Picker } from './picker';
import type {
  DatePickerReactProps,
  DatePickerValue,
  DatePickerValueDetail,
  PickerColumn,
  PickerMultiValue,
  PickerSingleValue,
} from './props';

type DateParts = DatePickerValueDetail;

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

export function DatePicker(props: DatePickerReactProps) {
  const {
    value,
    defaultValue,
    minYear = DEFAULT_MIN_YEAR,
    maxYear = DEFAULT_MAX_YEAR,
    onValueChange,
    onDraftValueChange,
    onOpenChange,
    ...rest
  } = props;

  const yearRange = React.useMemo(
    () => resolveYearRange(minYear, maxYear),
    [maxYear, minYear],
  );

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<DatePickerValue>(() => {
    const initial = resolveDateParts(defaultValue ?? value ?? null, yearRange);
    return formatDateValue(initial);
  });

  const committedValue = isControlled ? value ?? null : innerValue;
  const committedParts = React.useMemo(
    () => resolveDateParts(committedValue, yearRange),
    [committedValue, yearRange],
  );

  const [draftParts, setDraftParts] = React.useState<DateParts>(committedParts);
  const [innerOpen, setInnerOpen] = React.useState(Boolean(rest.defaultOpen));

  React.useEffect(() => {
    if (!innerOpen) {
      setDraftParts(committedParts);
    }
  }, [committedParts, innerOpen]);

  React.useEffect(() => {
    if (rest.isOpen === null || rest.isOpen === undefined) {
      return;
    }

    setInnerOpen(Boolean(rest.isOpen));
  }, [rest.isOpen]);

  const columns = React.useMemo(
    () => createDateColumns(draftParts, yearRange),
    [draftParts, yearRange],
  );

  const pickerValue = React.useMemo<PickerMultiValue>(() => {
    const source = innerOpen ? draftParts : committedParts;
    return [source.year, source.month, source.day];
  }, [committedParts, draftParts, innerOpen]);

  const handlePickerValueChange = React.useCallback(
    (nextValue: PickerSingleValue | PickerMultiValue) => {
      const nextParts = resolveDraftPartsFromValue(nextValue, yearRange);
      const nextDateValue = formatDateValue(nextParts);

      if (!isControlled) {
        setInnerValue(nextDateValue);
      }

      setDraftParts(nextParts);
      onValueChange?.(nextDateValue, nextParts);
    },
    [isControlled, onValueChange, yearRange],
  );

  const handlePickerDraftValueChange = React.useCallback(
    (nextValue: PickerSingleValue | PickerMultiValue) => {
      const nextParts = resolveDraftPartsFromValue(nextValue, yearRange);
      setDraftParts(nextParts);
      onDraftValueChange?.(formatDateValue(nextParts), nextParts);
    },
    [onDraftValueChange, yearRange],
  );

  const handlePickerOpenChange = React.useCallback(
    (isOpen: boolean) => {
      setInnerOpen(isOpen);
      setDraftParts(committedParts);
      onOpenChange?.(isOpen);
    },
    [committedParts, onOpenChange],
  );

  return (
    <Picker
      {...rest}
      columns={columns}
      value={pickerValue}
      onValueChange={handlePickerValueChange}
      onDraftValueChange={handlePickerDraftValueChange}
      onOpenChange={handlePickerOpenChange}
    />
  );
}
