import { UIComponent } from '@srcube-ui/runtime/mini';
import type { PickerMiniColumn, PickerMiniMultiValue } from '../props';
import type { TimePickerMiniProps } from './props';
import { timePickerMiniProps } from './props';

type TimeParts = {
  hour: number;
  minute: number;
  second: number;
};

type TimePickerMiniState = {
  _innerValue: string;
  _pickerValue: PickerMiniMultiValue;
  _pickerColumns: PickerMiniColumn[];
  _draftParts: TimeParts;
};

type TimePickerMiniData = TimePickerMiniProps & TimePickerMiniState;

function isControlledValue(value: unknown) {
  return value !== null && value !== undefined;
}

function parseTimeValue(value: unknown): TimeParts | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const matched = value.trim().match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (!matched) {
    return null;
  }

  return normalizeTimeParts({
    hour: Number(matched[1]),
    minute: Number(matched[2]),
    second: Number(matched[3] ?? 0),
  });
}

function normalizeTimeParts(parts: TimeParts): TimeParts {
  return {
    hour: Math.min(23, Math.max(0, Number(parts.hour) || 0)),
    minute: Math.min(59, Math.max(0, Number(parts.minute) || 0)),
    second: Math.min(59, Math.max(0, Number(parts.second) || 0)),
  };
}

function getFallbackParts(): TimeParts {
  const now = new Date();
  return normalizeTimeParts({
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  });
}

function resolveCommittedParts(data: TimePickerMiniData): TimeParts {
  const source = isControlledValue(data.value)
    ? data.value
    : data._innerValue || data.defaultValue;
  const parsed = parseTimeValue(source);
  if (!parsed) {
    return getFallbackParts();
  }

  return parsed;
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

function resolvePartsFromPickerValue(value: unknown, fallback: TimeParts): TimeParts {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const hour = resolvePickerPartNumber(value[0]) ?? fallback.hour;
  const minute = resolvePickerPartNumber(value[1]) ?? fallback.minute;
  const second = resolvePickerPartNumber(value[2]) ?? fallback.second;

  return normalizeTimeParts({
    hour,
    minute,
    second,
  });
}

function buildTimeColumns(): PickerMiniColumn[] {
  return [
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
    {
      id: 'second',
      items: Array.from({ length: 60 }, (_, index) => ({
        id: index,
        label: `${String(index).padStart(2, '0')} 秒`,
      })),
    },
  ];
}

function formatTimeValue(parts: TimeParts) {
  const hour = String(parts.hour).padStart(2, '0');
  const minute = String(parts.minute).padStart(2, '0');
  const second = String(parts.second).padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    timePickerMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: '',
    _pickerValue: [] as PickerMiniMultiValue,
    _pickerColumns: [] as PickerMiniColumn[],
    _draftParts: {
      hour: 0,
      minute: 0,
      second: 0,
    },
  } satisfies TimePickerMiniState,

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
    isOpen(nextOpen: TimePickerMiniProps['isOpen']) {
      if (nextOpen === null || nextOpen === undefined) {
        return;
      }

      const committed = resolveCommittedParts(this.data as TimePickerMiniData);
      this.setData({
        _pickerValue: [committed.hour, committed.minute, committed.second],
        _draftParts: committed,
        _pickerColumns: buildTimeColumns(),
      } satisfies Partial<TimePickerMiniState>);
    },
  },

  lifetimes: {
    attached() {
      const committed = resolveCommittedParts(this.data as TimePickerMiniData);
      const formatted = formatTimeValue(committed);

      this.setData({
        _innerValue: isControlledValue(this.data.value)
          ? this.data._innerValue
          : formatted,
        _pickerValue: [committed.hour, committed.minute, committed.second],
        _pickerColumns: buildTimeColumns(),
        _draftParts: committed,
      } satisfies Partial<TimePickerMiniState>);
    },
  },

  methods: {
    syncFromCommitted() {
      const committed = resolveCommittedParts(this.data as TimePickerMiniData);
      const formatted = formatTimeValue(committed);

      this.setData({
        _pickerValue: [committed.hour, committed.minute, committed.second],
        _pickerColumns: buildTimeColumns(),
        _draftParts: committed,
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
      } satisfies Partial<TimePickerMiniState>);
    },

    handlePickerTap(e: WechatMiniprogram.TouchEvent) {
      this.triggerEvent('tap', e.detail ?? {});
    },

    handlePickerOpenChange(
      e: WechatMiniprogram.CustomEvent<{ isOpen?: boolean | null }>,
    ) {
      const isOpen = Boolean(e.detail?.isOpen);
      const committed = resolveCommittedParts(this.data as TimePickerMiniData);

      this.setData({
        _pickerValue: [committed.hour, committed.minute, committed.second],
        _draftParts: committed,
        _pickerColumns: buildTimeColumns(),
      } satisfies Partial<TimePickerMiniState>);

      this.triggerEvent('openchange', {
        isOpen,
      });
    },

    handlePickerCancel(e: WechatMiniprogram.CustomEvent) {
      const committed = resolveCommittedParts(this.data as TimePickerMiniData);

      this.setData({
        _pickerValue: [committed.hour, committed.minute, committed.second],
        _draftParts: committed,
        _pickerColumns: buildTimeColumns(),
      } satisfies Partial<TimePickerMiniState>);

      this.triggerEvent('cancel', e.detail ?? {});
    },

    handlePickerDraftValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const fallback = this.data._draftParts;
      const source = e.detail?.values ?? e.detail?.value;
      const nextParts = resolvePartsFromPickerValue(source, fallback);
      const formatted = formatTimeValue(nextParts);

      this.setData({
        _pickerValue: [nextParts.hour, nextParts.minute, nextParts.second],
        _draftParts: nextParts,
        _pickerColumns: buildTimeColumns(),
      } satisfies Partial<TimePickerMiniState>);

      this.triggerEvent('draftvaluechange', {
        value: formatted,
        hour: nextParts.hour,
        minute: nextParts.minute,
        second: nextParts.second,
      });
    },

    handlePickerValueChange(
      e: WechatMiniprogram.CustomEvent<{
        value?: unknown;
        values?: unknown;
      }>,
    ) {
      const fallback = this.data._draftParts;
      const source = e.detail?.values ?? e.detail?.value;
      const nextParts = resolvePartsFromPickerValue(source, fallback);
      const formatted = formatTimeValue(nextParts);

      this.setData({
        _pickerValue: [nextParts.hour, nextParts.minute, nextParts.second],
        _draftParts: nextParts,
        _pickerColumns: buildTimeColumns(),
        ...(isControlledValue(this.data.value) ? {} : { _innerValue: formatted }),
      } satisfies Partial<TimePickerMiniState>);

      this.triggerEvent('valuechange', {
        value: formatted,
        hour: nextParts.hour,
        minute: nextParts.minute,
        second: nextParts.second,
      });
    },
  },
});

export type { TimePickerMiniProps } from './props';
export { timePickerMiniProps } from './props';
