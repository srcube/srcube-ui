import { Button } from '@srcube-ui/button/react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from '@srcube-ui/drawer/react';
import { Field } from '@srcube-ui/field/react';
import { Pickbox } from '@srcube-ui/pickbox/react';
import * as React from 'react';
import { picker } from '../style';
import type {
  PickerColumn,
  PickerDraftDetail,
  PickerItem,
  PickerItemId,
  PickerMode,
  PickerMultiValue,
  PickerReactProps,
  PickerSingleValue,
} from './props';

function resolveMode(mode?: PickerMode): PickerMode {
  return mode === 'multiple' ? 'multiple' : 'single';
}

function resolvePickerColumns(params: {
  mode: PickerMode;
  items?: PickerItem[];
  columns?: PickerColumn[];
}): PickerColumn[] {
  const { mode, items, columns } = params;

  if (mode === 'multiple') {
    return Array.isArray(columns) ? columns : [];
  }

  if (Array.isArray(items) && items.length > 0) {
    return [
      {
        id: 'picker-single',
        items,
      },
    ];
  }

  const firstColumn = Array.isArray(columns) ? columns[0] : null;
  if (!firstColumn) {
    return [];
  }

  return [firstColumn];
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

  const itemExists = column.items.some((item) => item.id === value);
  if (itemExists) {
    return value;
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

function normalizeInputValue(params: {
  mode: PickerMode;
  value?: PickerSingleValue | PickerMultiValue;
  columns: PickerColumn[];
}): PickerMultiValue {
  const { mode, value, columns } = params;

  if (mode === 'multiple') {
    if (Array.isArray(value)) {
      return ensureNormalizedValue(columns, value);
    }

    if (value === null || value === undefined) {
      return ensureNormalizedValue(columns);
    }

    return ensureNormalizedValue(columns, [value]);
  }

  if (Array.isArray(value)) {
    return ensureNormalizedValue(columns, [value[0] ?? null]);
  }

  return ensureNormalizedValue(columns, [value ?? null]);
}

function toOutputValue(
  mode: PickerMode,
  value: PickerMultiValue,
): PickerSingleValue | PickerMultiValue {
  if (mode === 'multiple') {
    return [...value];
  }

  return value[0] ?? null;
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

      const item = columns[index]?.items.find((candidate) => candidate.id === itemId);
      return item?.label ?? '';
    })
    .filter(Boolean);

  return labels.join(separator);
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

export const Picker = React.forwardRef<HTMLDivElement, PickerReactProps>(
  (props, ref) => {
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
      mode: modeProp = 'single',
      items,
      columns,
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
      onCancel,
      onOpenChange,
      onValueChange,
      onDraftValueChange,
      ...rest
    } = props;

    const resolvedMode = resolveMode(modeProp);
    const resolvedSize = resolvePickerSize(size);
    const resolvedColor = resolvePickerColor(color);
    const resolvedColumns = React.useMemo(
      () =>
        resolvePickerColumns({
          mode: resolvedMode,
          items,
          columns,
        }),
      [columns, items, resolvedMode],
    );

    const isValueControlled = value !== undefined;
    const [innerCommittedValue, setInnerCommittedValue] =
      React.useState<PickerMultiValue>(() =>
        normalizeInputValue({
          mode: resolvedMode,
          value: defaultValue,
          columns: resolvedColumns,
        }),
      );

    const committedValue = React.useMemo(
      () =>
        isValueControlled
          ? normalizeInputValue({
              mode: resolvedMode,
              value,
              columns: resolvedColumns,
            })
          : ensureNormalizedValue(resolvedColumns, innerCommittedValue),
      [
        innerCommittedValue,
        isValueControlled,
        resolvedColumns,
        resolvedMode,
        value,
      ],
    );

    React.useEffect(() => {
      if (isValueControlled) {
        return;
      }

      setInnerCommittedValue((prev) => ensureNormalizedValue(resolvedColumns, prev));
    }, [isValueControlled, resolvedColumns]);

    const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

    const [draftValue, setDraftValue] = React.useState<PickerMultiValue>(() =>
      normalizeInputValue({
        mode: resolvedMode,
        value: value ?? defaultValue,
        columns: resolvedColumns,
      }),
    );
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

    const displayValue = React.useMemo(
      () =>
        resolveDisplayValue({
          columns: resolvedColumns,
          value: committedValue,
          separator,
        }),
      [committedValue, resolvedColumns, separator],
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

        setDraftValue(committedValue);
        setOpen(true);
      },
      [committedValue, isDisabled, isReadOnly, onTap, setOpen],
    );

    const handleDraftValueChange = React.useCallback(
      (nextValue: PickerMultiValue) => {
        const normalized = ensureNormalizedValue(resolvedColumns, nextValue);
        const changedIndex = normalized.findIndex(
          (item, index) => draftValue[index] !== item,
        );
        const detail: PickerDraftDetail = {
          values: normalized,
          columnIndex: changedIndex >= 0 ? changedIndex : undefined,
          itemId:
            changedIndex >= 0
              ? (normalized[changedIndex] ?? undefined)
              : undefined,
        };

        setDraftValue(normalized);
        onDraftValueChange?.(toOutputValue(resolvedMode, normalized), detail);
      },
      [draftValue, onDraftValueChange, resolvedColumns, resolvedMode],
    );

    const handleConfirmTap = React.useCallback(() => {
      const normalized = ensureNormalizedValue(resolvedColumns, draftValue);
      pendingCommittedRef.current = normalized;

      if (!isValueControlled) {
        setInnerCommittedValue(normalized);
      }

      onValueChange?.(toOutputValue(resolvedMode, normalized));
      setOpen(false);
    }, [
      draftValue,
      isValueControlled,
      onValueChange,
      resolvedColumns,
      resolvedMode,
      setOpen,
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
              <Pickbox
                className={slots.pickbox({ class: classNames?.pickbox })}
                color={resolvedColor}
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
