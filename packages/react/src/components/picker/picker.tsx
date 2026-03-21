import { picker } from '@srcube-ui/styles/components/picker';
import * as React from 'react';
import { Button } from '../button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '../drawer';
import { Field } from '../field';
import { Pickbox } from '../pickbox';
import type {
  PickerColumn,
  PickerDraftDetail,
  PickerItem,
  PickerItemId,
  PickerMultiValue,
  PickerOption,
  PickerReactProps,
} from './props';

function isSameItemId(
  left: PickerItemId | null | undefined,
  right: PickerItemId | null | undefined,
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

function normalizeInputArray(
  value?: PickerMultiValue | PickerItemId | null,
): PickerMultiValue {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [value];
}

function hasPickerInputValue(value?: PickerMultiValue | PickerItemId | null) {
  return normalizeInputArray(value).some(
    (item) => item !== null && item !== undefined,
  );
}

function normalizePickerOptions(
  options: PickerReactProps['options'],
): PickerOption[] {
  if (!Array.isArray(options)) {
    return [];
  }

  return options
    .filter(
      (option): option is PickerOption =>
        Boolean(option) &&
        typeof option === 'object' &&
        (typeof option.id === 'string' || typeof option.id === 'number'),
    )
    .map((option) => ({
      id: option.id,
      label: String(option.label ?? ''),
      isDisabled: option.isDisabled === true,
      children: normalizePickerOptions(option.children),
    }));
}

function getEnabledOption(options: PickerOption[]) {
  return options.find((option) => !option.isDisabled) ?? options[0] ?? null;
}

function normalizeCascadeValue(
  options: PickerOption[],
  input?: PickerMultiValue,
): PickerMultiValue {
  const normalized: PickerMultiValue = [];
  let levelOptions = options;
  let levelIndex = 0;

  while (levelOptions.length > 0) {
    const desired = input?.[levelIndex];
    const matched = levelOptions.find(
      (option) => !option.isDisabled && isSameItemId(option.id, desired),
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

function buildCascadeColumns(
  options: PickerOption[],
  value: PickerMultiValue,
): PickerColumn[] {
  const columns: PickerColumn[] = [];
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
      isSameItemId(option.id, value[levelIndex]),
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

function resolveCascadeDisplayLabels(
  options: PickerOption[],
  value: PickerMultiValue,
) {
  const labels: string[] = [];
  let levelOptions = options;

  for (const itemId of value) {
    if (levelOptions.length === 0) {
      break;
    }

    const selected = levelOptions.find((option) =>
      isSameItemId(option.id, itemId),
    );
    if (!selected) {
      break;
    }

    labels.push(selected.label);
    levelOptions = selected.children ?? [];
  }

  return labels;
}

function resolvePickerColumns(params: {
  items?: PickerItem[];
  columns?: PickerColumn[];
}): PickerColumn[] {
  const { items, columns } = params;
  const normalizedColumns = Array.isArray(columns) ? columns : [];
  if (normalizedColumns.length > 0) {
    return normalizedColumns;
  }

  if (Array.isArray(items) && items.length > 0) {
    return [
      {
        id: 'picker-single',
        items,
      },
    ];
  }

  return [];
}

function getDefaultColumnValue(column: PickerColumn): PickerItemId | null {
  const firstEnabled = column.items.find((item) => !item.isDisabled);
  return firstEnabled?.id ?? column.items[0]?.id ?? null;
}

function normalizeColumnValue(
  column: PickerColumn,
  value: PickerItemId | null | undefined,
) {
  if (value === null || value === undefined) {
    return getDefaultColumnValue(column);
  }

  const matchedItem = column.items.find((item) => isSameItemId(item.id, value));
  if (matchedItem) {
    return matchedItem.id;
  }

  return getDefaultColumnValue(column);
}

function ensureNormalizedValue(
  columns: PickerColumn[],
  input?: PickerMultiValue,
): PickerMultiValue {
  return columns.map((column, index) =>
    normalizeColumnValue(column, input?.[index]),
  );
}

function toOutputValue(value: PickerMultiValue): PickerMultiValue {
  return [...value];
}

function resolveDisplayValue(params: {
  columns: PickerColumn[];
  value: PickerMultiValue;
  separator: string;
}) {
  const { columns, value, separator } = params;
  const labels = value
    .map((itemId, index) => {
      if (itemId === null || itemId === undefined) {
        return '';
      }

      const item = columns[index]?.items.find((candidate) =>
        isSameItemId(candidate.id, itemId),
      );
      return item?.label ?? '';
    })
    .filter(Boolean);

  return labels.join(separator);
}

function resolveChangedIndex(
  previous: PickerMultiValue,
  next: PickerMultiValue,
) {
  const total = Math.max(previous.length, next.length);
  for (let index = 0; index < total; index += 1) {
    if (!isSameItemId(previous[index], next[index])) {
      return index;
    }
  }
  return undefined;
}

function resolvePickerColor(
  value: PickerReactProps['color'],
): NonNullable<PickerReactProps['color']> {
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
  value: PickerReactProps['size'],
): NonNullable<PickerReactProps['size']> {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolvePickerTone(
  value: PickerReactProps['tone'],
): NonNullable<PickerReactProps['tone']> {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveButtonTone(
  value: PickerReactProps['tone'],
): 'light' | 'dark' {
  return resolvePickerTone(value) === 'dark' ? 'dark' : 'light';
}

export const Picker = React.forwardRef<HTMLDivElement, PickerReactProps>(
  (props, ref) => {
    const {
      id,
      label,
      labelPlacement,
      placeholder = '请选择',
      description,
      errorMessage,
      isClearable,
      color,
      tone,
      variant,
      size,
      radius,
      isDisabled,
      isReadOnly,
      isInvalid,
      isRequired,
      isLoading,
      type = 'default',
      items,
      columns,
      options,
      value,
      defaultValue,
      isOpen: isOpenProp,
      defaultOpen = false,
      separator = ' / ',
      confirmText = '确认',
      drawerTitle,
      isDismissable = true,
      hasBackdrop = true,
      backdrop,
      estimateSize,
      overscan = 5,
      indicatorHeight,
      scrollEndDelay = 120,
      className,
      classNames,
      style,
      onTap,
      onClear,
      onCancel,
      onOpenChange,
      onValueChange,
      onDraftValueChange,
      ...rest
    } = props;

    const resolvedSize = resolvePickerSize(size);
    const resolvedColor = resolvePickerColor(color);
    const resolvedTone = resolvePickerTone(tone);
    const staticColumns = React.useMemo(
      () =>
        resolvePickerColumns({
          items,
          columns,
        }),
      [columns, items],
    );
    const normalizedOptions = React.useMemo(
      () => normalizePickerOptions(options),
      [options],
    );
    const isCascade = normalizedOptions.length > 0;

    const isValueControlled = value !== undefined;
    const [innerCommittedValue, setInnerCommittedValue] =
      React.useState<PickerMultiValue>(() => {
        if (!hasPickerInputValue(defaultValue)) {
          return [];
        }

        const input = normalizeInputArray(defaultValue);
        if (isCascade) {
          return normalizeCascadeValue(normalizedOptions, input);
        }

        return ensureNormalizedValue(staticColumns, input);
      });

    const committedValue = React.useMemo(() => {
      const input = isValueControlled
        ? normalizeInputArray(value)
        : innerCommittedValue;

      if (!hasPickerInputValue(input)) {
        return [];
      }

      if (isCascade) {
        return normalizeCascadeValue(normalizedOptions, input);
      }

      return ensureNormalizedValue(staticColumns, input);
    }, [
      innerCommittedValue,
      isCascade,
      isValueControlled,
      normalizedOptions,
      staticColumns,
      value,
    ]);

    React.useEffect(() => {
      if (isValueControlled) {
        return;
      }

      setInnerCommittedValue((prev) => {
        if (!hasPickerInputValue(prev)) {
          return [];
        }

        if (isCascade) {
          return normalizeCascadeValue(normalizedOptions, prev);
        }
        return ensureNormalizedValue(staticColumns, prev);
      });
    }, [isCascade, isValueControlled, normalizedOptions, staticColumns]);

    const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

    const [draftValue, setDraftValue] =
      React.useState<PickerMultiValue>(committedValue);
    const pendingCommittedRef = React.useRef<PickerMultiValue | null>(null);

    React.useEffect(() => {
      if (resolvedOpen) {
        setDraftValue(committedValue);
        return;
      }

      if (pendingCommittedRef.current) {
        setDraftValue(pendingCommittedRef.current);
        pendingCommittedRef.current = null;
        return;
      }

      setDraftValue(committedValue);
    }, [committedValue, resolvedOpen]);

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (!isOpenControlled) {
          setInnerOpen(nextOpen);
        }

        onOpenChange?.(nextOpen);
      },
      [isOpenControlled, onOpenChange],
    );

    const activeValue = resolvedOpen ? draftValue : committedValue;
    const resolvedColumns = React.useMemo(() => {
      if (isCascade) {
        return buildCascadeColumns(
          normalizedOptions,
          normalizeCascadeValue(normalizedOptions, activeValue),
        );
      }

      return staticColumns;
    }, [activeValue, isCascade, normalizedOptions, staticColumns]);

    const displayValue = React.useMemo(() => {
      if (isCascade) {
        const labels = resolveCascadeDisplayLabels(
          normalizedOptions,
          committedValue,
        );
        return labels.join(separator);
      }

      return resolveDisplayValue({
        columns: staticColumns,
        value: committedValue,
        separator,
      });
    }, [
      committedValue,
      isCascade,
      normalizedOptions,
      separator,
      staticColumns,
    ]);

    const slots = React.useMemo(
      () =>
        picker({
          type,
          tone: resolvedTone,
          size: resolvedSize,
        }),
      [resolvedSize, resolvedTone, type],
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

        setDraftValue(committedValue);
        setOpen(true);
      },
      [committedValue, isDisabled, isReadOnly, onTap, setOpen],
    );

    const handleClear = React.useCallback(() => {
      const clearedValue: PickerMultiValue = [];

      pendingCommittedRef.current = null;
      setDraftValue(clearedValue);

      if (!isValueControlled) {
        setInnerCommittedValue(clearedValue);
      }

      onValueChange?.(toOutputValue(clearedValue));
      onClear?.();
    }, [isValueControlled, onClear, onValueChange]);

    const handleDraftValueChange = React.useCallback(
      (nextValue: PickerMultiValue) => {
        let normalized: PickerMultiValue;
        let changedIndex: number | undefined;

        if (isCascade) {
          const nextNormalizedInput = normalizeInputArray(nextValue);
          changedIndex = resolveChangedIndex(draftValue, nextNormalizedInput);
          const cascadeInput =
            changedIndex === undefined
              ? nextNormalizedInput
              : nextNormalizedInput.slice(0, changedIndex + 1);
          normalized = normalizeCascadeValue(normalizedOptions, cascadeInput);
          if (changedIndex !== undefined && changedIndex >= normalized.length) {
            changedIndex = normalized.length - 1;
          }
        } else {
          normalized = ensureNormalizedValue(staticColumns, nextValue);
          changedIndex = resolveChangedIndex(draftValue, normalized);
        }

        const detail: PickerDraftDetail = {
          values: normalized,
          columnIndex: changedIndex,
          itemId:
            changedIndex === undefined
              ? undefined
              : (normalized[changedIndex] ?? undefined),
        };

        setDraftValue(normalized);
        onDraftValueChange?.(toOutputValue(normalized), detail);
      },
      [
        draftValue,
        isCascade,
        normalizedOptions,
        onDraftValueChange,
        staticColumns,
      ],
    );

    const handleConfirmTap = React.useCallback(() => {
      const normalized = isCascade
        ? normalizeCascadeValue(normalizedOptions, draftValue)
        : ensureNormalizedValue(staticColumns, draftValue);

      pendingCommittedRef.current = normalized;

      if (!isValueControlled) {
        setInnerCommittedValue(normalized);
      }

      onValueChange?.(toOutputValue(normalized));
      setOpen(false);
    }, [
      draftValue,
      isCascade,
      isValueControlled,
      normalizedOptions,
      onValueChange,
      setOpen,
      staticColumns,
    ]);

    const handleDrawerOpenChange = React.useCallback(
      (nextOpen: boolean) => {
        if (nextOpen) {
          setDraftValue(committedValue);
          setOpen(true);
          return;
        }

        const hasPendingConfirm = pendingCommittedRef.current !== null;
        const closeBase = pendingCommittedRef.current ?? committedValue;
        pendingCommittedRef.current = null;
        setDraftValue(closeBase);
        setOpen(false);

        if (!hasPendingConfirm) {
          onCancel?.();
        }
      },
      [committedValue, onCancel, setOpen],
    );

    const isConfirmDisabled = React.useMemo(
      () =>
        Boolean(isDisabled || isReadOnly) ||
        resolvedColumns.every((column) => column.items.length === 0),
      [isDisabled, isReadOnly, resolvedColumns],
    );

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
          isClearable={isClearable}
          color={resolvedColor}
          tone={resolvedTone}
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
          onClear={handleClear}
        />

        <Drawer
          placement="bottom"
          title={drawerTitle ?? label}
          isOpen={resolvedOpen}
          isDismissable={isDismissable}
          hasBackdrop={hasBackdrop}
          backdrop={backdrop}
          tone={resolvedTone}
          onOpenChange={handleDrawerOpenChange}
          className={slots.drawer({ class: classNames?.drawer })}
          classNames={drawerClassNames}
        >
          <DrawerContent>
            <DrawerHeader
              className={slots.drawerTitle({ class: classNames?.drawerTitle })}
            >
              {drawerTitle ?? label}
            </DrawerHeader>
            <DrawerBody>
              <Pickbox
                className={slots.pickbox({ class: classNames?.pickbox })}
                size={resolvedSize}
                color={resolvedColor}
                tone={resolvedTone}
                columns={resolvedColumns}
                value={draftValue}
                estimateSize={estimateSize}
                overscan={overscan}
                indicatorHeight={indicatorHeight}
                scrollEndDelay={scrollEndDelay}
                onValueChange={handleDraftValueChange}
              />
            </DrawerBody>

            <DrawerFooter>
              <Button
                className={slots.confirmButton({
                  class: classNames?.confirmButton,
                })}
                color={resolvedColor}
                tone={resolveButtonTone(resolvedTone)}
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
  },
);

Picker.displayName = 'Srcube.Picker';
