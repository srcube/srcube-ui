import * as React from 'react';
import { Picker } from './picker';
import type {
  PickerColumn,
  PickerMultiValue,
  PickerSingleValue,
  TimePickerReactProps,
  TimePickerValue,
  TimePickerValueDetail,
} from './props';

type TimeParts = TimePickerValueDetail;

function normalizeTimeParts(parts: TimeParts): TimeParts {
  return {
    hour: Math.min(23, Math.max(0, Number(parts.hour) || 0)),
    minute: Math.min(59, Math.max(0, Number(parts.minute) || 0)),
    second: Math.min(59, Math.max(0, Number(parts.second) || 0)),
  };
}

function parseTimeValue(value: TimePickerValue): TimeParts | null {
  if (!value || typeof value !== 'string') {
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

function getFallbackTimeParts(): TimeParts {
  const now = new Date();
  return normalizeTimeParts({
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  });
}

function resolveTimeParts(value: TimePickerValue): TimeParts {
  return parseTimeValue(value) ?? getFallbackTimeParts();
}

function formatTimeValue(parts: TimeParts): string {
  const hour = String(parts.hour).padStart(2, '0');
  const minute = String(parts.minute).padStart(2, '0');
  const second = String(parts.second).padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

function resolveValueArray(value: PickerSingleValue | PickerMultiValue): PickerMultiValue {
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

function resolveDraftPartsFromValue(
  value: PickerSingleValue | PickerMultiValue,
): TimeParts {
  const values = resolveValueArray(value);
  return normalizeTimeParts({
    hour: Number(values[0] ?? 0),
    minute: Number(values[1] ?? 0),
    second: Number(values[2] ?? 0),
  });
}

function createTimeColumns(): PickerColumn[] {
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

export function TimePicker(props: TimePickerReactProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    onDraftValueChange,
    onOpenChange,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<TimePickerValue>(() => {
    const initial = resolveTimeParts(defaultValue ?? value ?? null);
    return formatTimeValue(initial);
  });

  const committedValue = isControlled ? value ?? null : innerValue;
  const committedParts = React.useMemo(
    () => resolveTimeParts(committedValue),
    [committedValue],
  );

  const [draftParts, setDraftParts] = React.useState<TimeParts>(committedParts);
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

  const columns = React.useMemo(() => createTimeColumns(), []);

  const pickerValue = React.useMemo<PickerMultiValue>(() => {
    const source = innerOpen ? draftParts : committedParts;
    return [source.hour, source.minute, source.second];
  }, [committedParts, draftParts, innerOpen]);

  const handlePickerValueChange = React.useCallback(
    (nextValue: PickerSingleValue | PickerMultiValue) => {
      const nextParts = resolveDraftPartsFromValue(nextValue);
      const nextTimeValue = formatTimeValue(nextParts);

      if (!isControlled) {
        setInnerValue(nextTimeValue);
      }

      setDraftParts(nextParts);
      onValueChange?.(nextTimeValue, nextParts);
    },
    [isControlled, onValueChange],
  );

  const handlePickerDraftValueChange = React.useCallback(
    (nextValue: PickerSingleValue | PickerMultiValue) => {
      const nextParts = resolveDraftPartsFromValue(nextValue);
      setDraftParts(nextParts);
      onDraftValueChange?.(formatTimeValue(nextParts), nextParts);
    },
    [onDraftValueChange],
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
