import type {
  PickerDraftDetail,
  PickerItemId,
  PickerMultiValue,
} from '@srcube-ui/picker/react';
import { Picker } from '@srcube-ui/picker/react';
import * as React from 'react';
import { cascader } from '../style';
import type {
  CascaderOption,
  CascaderOptionId,
  CascaderReactProps,
  CascaderValue,
  CascaderValueDetail,
} from './props';

function isSameOptionId(
  left: CascaderOptionId | null | undefined,
  right: CascaderOptionId | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  ) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return (
      Number.isFinite(leftNumber) &&
      Number.isFinite(rightNumber) &&
      leftNumber === rightNumber
    );
  }

  return false;
}

function getEnabledOption(options: CascaderOption[]) {
  return options.find((option) => !option.isDisabled) ?? options[0] ?? null;
}

function normalizeOptions(
  options: CascaderOption[] | undefined | null,
): CascaderOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .filter(
      (option): option is CascaderOption =>
        Boolean(option) &&
        typeof option === 'object' &&
        (typeof option.id === 'string' || typeof option.id === 'number'),
    )
    .map((option) => ({
      id: option.id,
      label: String(option.label ?? ''),
      isDisabled: option.isDisabled === true,
      children: normalizeOptions(option.children),
    }));
}

function normalizePath(options: CascaderOption[], input?: CascaderValue) {
  const normalized: CascaderValue = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    const desired = Array.isArray(input) ? input[levelIndex] : undefined;
    const matched = levelOptions.find(
      (option) => !option.isDisabled && isSameOptionId(option.id, desired),
    );

    const selected = matched ?? getEnabledOption(levelOptions);
    if (!selected) {
      break;
    }

    normalized.push(selected.id);
    levelOptions = selected.children ?? [];
    levelIndex += 1;
  }

  return normalized;
}

function resolveSelectedOptions(
  options: CascaderOption[],
  value: CascaderValue,
) {
  const selected: CascaderOption[] = [];
  let levelOptions = options;

  for (const itemId of value) {
    if (levelOptions.length === 0) {
      break;
    }

    const option = levelOptions.find((candidate) =>
      isSameOptionId(candidate.id, itemId),
    );
    if (!option) {
      break;
    }

    selected.push(option);
    levelOptions = option.children ?? [];
  }

  return selected;
}

function buildColumns(options: CascaderOption[], path: CascaderValue) {
  const columns: Array<{
    id: number;
    items: Array<{ id: PickerItemId; label: string; isDisabled?: boolean }>;
  }> = [];

  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    columns.push({
      id: levelIndex,
      items: levelOptions.map((option) => ({
        id: option.id,
        label: option.label,
        isDisabled: option.isDisabled,
      })),
    });

    const selected = levelOptions.find((option) =>
      isSameOptionId(option.id, path[levelIndex]),
    );

    const fallback = selected ?? getEnabledOption(levelOptions);
    if (!fallback) {
      break;
    }

    levelOptions = fallback.children ?? [];
    levelIndex += 1;
  }

  return columns;
}

function resolveChangedIndex(
  previous: CascaderValue,
  next: CascaderValue,
  detail?: Pick<PickerDraftDetail, 'columnIndex'>,
) {
  if (
    detail &&
    typeof detail.columnIndex === 'number' &&
    Number.isFinite(detail.columnIndex)
  ) {
    return Math.max(0, detail.columnIndex);
  }

  const total = Math.max(previous.length, next.length);
  for (let index = 0; index < total; index += 1) {
    if (!isSameOptionId(previous[index], next[index])) {
      return index;
    }
  }

  return undefined;
}

function toValueDetail(
  options: CascaderOption[],
  value: CascaderValue,
): CascaderValueDetail {
  const selectedOptions = resolveSelectedOptions(options, value);

  return {
    value,
    options: selectedOptions,
    labels: selectedOptions.map((option) => option.label),
  };
}

function toPickerValue(value: CascaderValue): PickerMultiValue {
  return value.map((item) => (item === undefined ? null : item));
}

export const Cascader = React.forwardRef<HTMLDivElement, CascaderReactProps>(
  (props, ref) => {
    const {
      options,
      value,
      defaultValue,
      className,
      classNames,
      pickerClassNames,
      style,
      onOpenChange,
      onValueChange,
      onDraftValueChange,
      ...rest
    } = props;

    const normalizedOptions = React.useMemo(
      () => normalizeOptions(options),
      [options],
    );

    const isValueControlled = value !== undefined;
    const [innerCommittedValue, setInnerCommittedValue] =
      React.useState<CascaderValue>(() =>
        normalizePath(normalizedOptions, value ?? defaultValue),
      );

    const committedValue = React.useMemo(
      () =>
        isValueControlled
          ? normalizePath(normalizedOptions, value)
          : normalizePath(normalizedOptions, innerCommittedValue),
      [innerCommittedValue, isValueControlled, normalizedOptions, value],
    );

    React.useEffect(() => {
      if (isValueControlled) {
        return;
      }

      setInnerCommittedValue((previous) =>
        normalizePath(
          normalizedOptions,
          previous.length > 0 ? previous : defaultValue,
        ),
      );
    }, [defaultValue, isValueControlled, normalizedOptions]);

    const isOpenControlled = rest.isOpen !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(Boolean(rest.defaultOpen));
    const resolvedOpen = isOpenControlled ? Boolean(rest.isOpen) : innerOpen;

    const [draftValue, setDraftValue] =
      React.useState<CascaderValue>(committedValue);

    React.useEffect(() => {
      if (resolvedOpen) {
        setDraftValue((previous) => normalizePath(normalizedOptions, previous));
        return;
      }

      setDraftValue(committedValue);
    }, [committedValue, normalizedOptions, resolvedOpen]);

    const activeValue = resolvedOpen ? draftValue : committedValue;

    const resolvedValue = React.useMemo(
      () => normalizePath(normalizedOptions, activeValue),
      [activeValue, normalizedOptions],
    );

    const resolvedColumns = React.useMemo(
      () => buildColumns(normalizedOptions, resolvedValue),
      [normalizedOptions, resolvedValue],
    );

    const slots = React.useMemo(() => cascader(), []);

    const handleOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (!isOpenControlled) {
          setInnerOpen(nextOpen);
        }

        setDraftValue(committedValue);
        onOpenChange?.(nextOpen);
      },
      [committedValue, isOpenControlled, onOpenChange],
    );

    const handleDraftValueChange = React.useCallback(
      (nextValue: PickerMultiValue, detail: PickerDraftDetail) => {
        const changedIndex = resolveChangedIndex(draftValue, nextValue, detail);
        const candidate =
          changedIndex === undefined
            ? nextValue
            : nextValue.slice(0, changedIndex + 1);
        const normalized = normalizePath(normalizedOptions, candidate);

        setDraftValue(normalized);
        const valueDetail = toValueDetail(normalizedOptions, normalized);

        onDraftValueChange?.(normalized, {
          ...valueDetail,
          columnIndex: changedIndex,
          optionId:
            changedIndex === undefined
              ? undefined
              : (normalized[changedIndex] ?? undefined),
        });
      },
      [draftValue, normalizedOptions, onDraftValueChange],
    );

    const handleValueChange = React.useCallback(
      (nextValue: PickerMultiValue) => {
        const normalized = normalizePath(normalizedOptions, nextValue);
        const valueDetail = toValueDetail(normalizedOptions, normalized);

        if (!isValueControlled) {
          setInnerCommittedValue(normalized);
        }

        setDraftValue(normalized);
        onValueChange?.(normalized, valueDetail);
      },
      [isValueControlled, normalizedOptions, onValueChange],
    );

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
      >
        <Picker
          {...rest}
          className={slots.picker({ class: classNames?.picker })}
          classNames={pickerClassNames}
          columns={resolvedColumns}
          value={toPickerValue(resolvedValue)}
          onOpenChange={handleOpenChange}
          onDraftValueChange={handleDraftValueChange}
          onValueChange={handleValueChange}
        />
      </div>
    );
  },
);

Cascader.displayName = 'Srcube.Cascader';
