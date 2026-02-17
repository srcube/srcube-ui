export type DateTimeMode = 'datetime' | 'date' | 'time';
export type DateTimePanel = 'date' | 'time';
export type DateTimeRangeKey = 'start' | 'end';

export type DateParts = {
  year: number;
  month: number;
  day: number;
};

export type TimeParts = {
  hour: number;
  minute: number;
  second: number;
};

export type DateTimeParts = {
  date: DateParts;
  time: TimeParts;
};

export type DateTimeRangeParts = Record<DateTimeRangeKey, DateTimeParts>;

export type YearRange = {
  minYear: number;
  maxYear: number;
};

export type DateTimeColumn = {
  id: string;
  items: Array<{
    id: number;
    label: string;
  }>;
};

type DateTimeToken = 'YYYY' | 'MM' | 'DD' | 'HH' | 'mm' | 'ss';

const TOKEN_REGEXP = /(YYYY|MM|DD|HH|mm|ss)/g;

const TOKEN_MATCHER: Record<DateTimeToken, string> = {
  YYYY: '(\\d{4})',
  MM: '(\\d{1,2})',
  DD: '(\\d{1,2})',
  HH: '(\\d{1,2})',
  mm: '(\\d{1,2})',
  ss: '(\\d{1,2})',
};

const DEFAULT_FORMAT_BY_MODE: Record<DateTimeMode, string> = {
  datetime: 'YYYY-MM-DD HH:mm:ss',
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
};

const REQUIRED_TOKENS_BY_MODE: Record<DateTimeMode, DateTimeToken[]> = {
  datetime: ['YYYY', 'MM', 'DD', 'HH', 'mm'],
  date: ['YYYY', 'MM', 'DD'],
  time: ['HH', 'mm'],
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveNumber(value: unknown): number | null {
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

function hasAllRequiredTokens(mode: DateTimeMode, format: string) {
  return REQUIRED_TOKENS_BY_MODE[mode].every((token) => format.includes(token));
}

function buildFormatRegExp(format: string) {
  const tokens: DateTimeToken[] = [];
  let pattern = '^';
  let lastIndex = 0;

  for (const match of format.matchAll(TOKEN_REGEXP)) {
    const token = match[0] as DateTimeToken;
    const index = match.index ?? 0;
    pattern += escapeRegExp(format.slice(lastIndex, index));
    pattern += TOKEN_MATCHER[token];
    tokens.push(token);
    lastIndex = index + token.length;
  }

  pattern += escapeRegExp(format.slice(lastIndex));
  pattern += '$';

  return {
    regexp: new RegExp(pattern),
    tokens,
  };
}

export function resolveDateTimeMode(mode?: string | null): DateTimeMode {
  if (mode === 'date' || mode === 'time') {
    return mode;
  }

  return 'datetime';
}

export function resolveDateTimePanel(
  mode: DateTimeMode,
  panel?: DateTimePanel | null,
): DateTimePanel {
  if (mode === 'date') {
    return 'date';
  }

  if (mode === 'time') {
    return 'time';
  }

  return panel === 'time' ? 'time' : 'date';
}

export function resolveDateTimeFormat(params: {
  mode: DateTimeMode;
  format?: string | null;
}) {
  const { mode, format } = params;
  const fallback = DEFAULT_FORMAT_BY_MODE[mode];

  if (typeof format !== 'string' || !format.trim()) {
    return fallback;
  }

  const normalized = format.trim();
  if (!hasAllRequiredTokens(mode, normalized)) {
    return fallback;
  }

  return normalized;
}

export function hasSecondToken(format: string) {
  return format.includes('ss');
}

export function resolveYearRange(minYear?: number, maxYear?: number): YearRange {
  const rawMin = Number(minYear ?? 1900);
  const rawMax = Number(maxYear ?? 2099);
  const normalizedMin = Number.isFinite(rawMin) ? rawMin : 1900;
  const normalizedMax = Number.isFinite(rawMax) ? rawMax : 2099;

  if (normalizedMin <= normalizedMax) {
    return {
      minYear: normalizedMin,
      maxYear: normalizedMax,
    };
  }

  return {
    minYear: normalizedMax,
    maxYear: normalizedMin,
  };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function normalizeDateParts(parts: DateParts, range: YearRange): DateParts {
  const year = Math.min(range.maxYear, Math.max(range.minYear, Number(parts.year) || 0));
  const month = Math.min(12, Math.max(1, Number(parts.month) || 1));
  const maxDay = getDaysInMonth(year, month);
  const day = Math.min(maxDay, Math.max(1, Number(parts.day) || 1));

  return {
    year,
    month,
    day,
  };
}

export function normalizeTimeParts(parts: TimeParts): TimeParts {
  return {
    hour: Math.min(23, Math.max(0, Number(parts.hour) || 0)),
    minute: Math.min(59, Math.max(0, Number(parts.minute) || 0)),
    second: Math.min(59, Math.max(0, Number(parts.second) || 0)),
  };
}

export function normalizeDateTimeParts(
  parts: DateTimeParts,
  range: YearRange,
): DateTimeParts {
  return {
    date: normalizeDateParts(parts.date, range),
    time: normalizeTimeParts(parts.time),
  };
}

export function getFallbackDateTimeParts(range: YearRange): DateTimeParts {
  const now = new Date();
  return normalizeDateTimeParts(
    {
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
      time: {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      },
    },
    range,
  );
}

export function parseDateTimeValue(params: {
  value?: string | null;
  format: string;
  range: YearRange;
  fallback?: DateTimeParts;
}): DateTimeParts | null {
  const { value, format, range, fallback } = params;
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const source = value.trim();
  const { regexp, tokens } = buildFormatRegExp(format);
  const matched = source.match(regexp);
  if (!matched) {
    return null;
  }

  const base = fallback ?? getFallbackDateTimeParts(range);
  const next: DateTimeParts = {
    date: { ...base.date },
    time: { ...base.time },
  };

  tokens.forEach((token, index) => {
    const captured = resolveNumber(matched[index + 1]);
    if (captured === null) {
      return;
    }

    switch (token) {
      case 'YYYY':
        next.date.year = captured;
        break;
      case 'MM':
        next.date.month = captured;
        break;
      case 'DD':
        next.date.day = captured;
        break;
      case 'HH':
        next.time.hour = captured;
        break;
      case 'mm':
        next.time.minute = captured;
        break;
      case 'ss':
        next.time.second = captured;
        break;
      default:
        break;
    }
  });

  return normalizeDateTimeParts(next, range);
}

export function resolveDateTimeParts(params: {
  value?: string | null;
  format: string;
  range: YearRange;
  fallback?: DateTimeParts;
}) {
  const parsed = parseDateTimeValue(params);
  if (parsed) {
    return parsed;
  }

  if (params.fallback) {
    return normalizeDateTimeParts(params.fallback, params.range);
  }

  return getFallbackDateTimeParts(params.range);
}

export function formatDateTimeValue(parts: DateTimeParts, format: string) {
  const map: Record<DateTimeToken, string> = {
    YYYY: String(parts.date.year).padStart(4, '0'),
    MM: String(parts.date.month).padStart(2, '0'),
    DD: String(parts.date.day).padStart(2, '0'),
    HH: String(parts.time.hour).padStart(2, '0'),
    mm: String(parts.time.minute).padStart(2, '0'),
    ss: String(parts.time.second).padStart(2, '0'),
  };

  return format.replace(TOKEN_REGEXP, (token) => map[token as DateTimeToken] ?? token);
}

export function buildDateColumns(params: {
  parts: DateParts;
  range: YearRange;
}): DateTimeColumn[] {
  const { parts, range } = params;
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

export function buildTimeColumns(params: { includeSecond: boolean }): DateTimeColumn[] {
  const { includeSecond } = params;
  const columns: DateTimeColumn[] = [
    {
      id: 'hour',
      items: Array.from({ length: 24 }, (_, index) => ({
        id: index,
        label: `${String(index).padStart(2, '0')} 时`,
      })),
    },
    {
      id: 'minute',
      items: Array.from({ length: 60 }, (_, index) => ({
        id: index,
        label: `${String(index).padStart(2, '0')} 分`,
      })),
    },
  ];

  if (includeSecond) {
    columns.push({
      id: 'second',
      items: Array.from({ length: 60 }, (_, index) => ({
        id: index,
        label: `${String(index).padStart(2, '0')} 秒`,
      })),
    });
  }

  return columns;
}

export function resolveDateTimePartsFromPickerValue(params: {
  value: unknown;
  panel: DateTimePanel;
  current: DateTimeParts;
  range: YearRange;
  includeSecond: boolean;
}) {
  const { value, panel, current, range, includeSecond } = params;
  if (!Array.isArray(value)) {
    return current;
  }

  const next: DateTimeParts = {
    date: { ...current.date },
    time: { ...current.time },
  };

  if (panel === 'date') {
    next.date.year = resolveNumber(value[0]) ?? next.date.year;
    next.date.month = resolveNumber(value[1]) ?? next.date.month;
    next.date.day = resolveNumber(value[2]) ?? next.date.day;
  } else {
    next.time.hour = resolveNumber(value[0]) ?? next.time.hour;
    next.time.minute = resolveNumber(value[1]) ?? next.time.minute;
    if (includeSecond) {
      next.time.second = resolveNumber(value[2]) ?? next.time.second;
    }
  }

  return normalizeDateTimeParts(next, range);
}

function compareDateParts(left: DateParts, right: DateParts) {
  if (left.year !== right.year) {
    return left.year - right.year;
  }
  if (left.month !== right.month) {
    return left.month - right.month;
  }
  return left.day - right.day;
}

function compareTimeParts(left: TimeParts, right: TimeParts) {
  if (left.hour !== right.hour) {
    return left.hour - right.hour;
  }
  if (left.minute !== right.minute) {
    return left.minute - right.minute;
  }
  return left.second - right.second;
}

export function compareDateTimeParts(
  left: DateTimeParts,
  right: DateTimeParts,
  mode: DateTimeMode,
) {
  if (mode === 'date') {
    return compareDateParts(left.date, right.date);
  }
  if (mode === 'time') {
    return compareTimeParts(left.time, right.time);
  }

  const dateDiff = compareDateParts(left.date, right.date);
  if (dateDiff !== 0) {
    return dateDiff;
  }
  return compareTimeParts(left.time, right.time);
}

export function normalizeDateTimeRangeOrder(params: {
  rangeValue: DateTimeRangeParts;
  activeRange: DateTimeRangeKey;
  mode: DateTimeMode;
}): DateTimeRangeParts {
  const { rangeValue, activeRange, mode } = params;
  if (compareDateTimeParts(rangeValue.start, rangeValue.end, mode) <= 0) {
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
