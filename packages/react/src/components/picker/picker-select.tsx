import { Button } from '../button';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '../drawer';
import { Field } from '../field';
import { Selectbox } from '../selectbox';
import * as React from 'react';
import { picker } from '@srcube-ui/styles/components/picker';
import type {
  PickerSelectDraftDetail,
  PickerSelectItem,
  PickerSelectReactProps,
  PickerSelectValue,
  PickerReactProps,
} from './props';

function isSameItemId(
  left: string | number | null | undefined,
  right: string | number | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (left === null || left === undefined || right === null || right === undefined) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string')
    || (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber === rightNumber;
  }

  return false;
}

function resolvePickerColor(
  value: PickerReactProps['color'],
): NonNullable<PickerReactProps['color']> {
  if (
    value === 'primary'
    || value === 'secondary'
    || value === 'success'
    || value === 'warning'
    || value === 'danger'
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

function resolveValueByItems(
  items: PickerSelectItem[],
  value: PickerSelectValue | undefined | null,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((candidateId) =>
    items.some((item) => isSameItemId(item.id, candidateId)));
}

function resolveDisplayValue(params: {
  items: PickerSelectItem[];
  value: PickerSelectValue;
  separator: string;
}) {
  const { items, value, separator } = params;
  const labels = value
    .map((itemId) =>
      items.find((candidate) => isSameItemId(candidate.id, itemId))?.label ?? '')
    .filter(Boolean);

  return labels.join(separator);
}

function toOutputValue(value: PickerSelectValue): PickerSelectValue {
  return [...value];
}

function resolveDraftDetail(params: {
  previous: PickerSelectValue;
  next: PickerSelectValue;
}): PickerSelectDraftDetail {
  const { previous, next } = params;
  const added = next.find(
    (itemId) => !previous.some((candidate) => isSameItemId(candidate, itemId)),
  );
  if (added !== undefined) {
    return {
      value: toOutputValue(next),
      itemId: added,
      index: next.findIndex((itemId) => isSameItemId(itemId, added)),
    };
  }

  const removed = previous.find(
    (itemId) => !next.some((candidate) => isSameItemId(candidate, itemId)),
  );

  return {
    value: toOutputValue(next),
    itemId: removed,
    index: removed === undefined
      ? undefined
      : previous.findIndex((itemId) => isSameItemId(itemId, removed)),
  };
}

export const PickerSelect = React.forwardRef<HTMLDivElement, PickerSelectReactProps>(
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
      items = [],
      value,
      defaultValue,
      selectionMode = 'multiple',
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
    const resolvedItems = React.useMemo(
      () => items.map((item) => ({ ...item })),
      [items],
    );

    const isValueControlled = value !== undefined;
    const [innerCommittedValue, setInnerCommittedValue] =
      React.useState<PickerSelectValue>(() =>
        resolveValueByItems(resolvedItems, defaultValue),
      );

    const committedValue = React.useMemo(
      () =>
        isValueControlled
          ? resolveValueByItems(resolvedItems, value)
          : resolveValueByItems(resolvedItems, innerCommittedValue),
      [innerCommittedValue, isValueControlled, resolvedItems, value],
    );

    React.useEffect(() => {
      if (isValueControlled) {
        return;
      }

      setInnerCommittedValue((previous) =>
        resolveValueByItems(resolvedItems, previous),
      );
    }, [isValueControlled, resolvedItems]);

    const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

    const [draftValue, setDraftValue] = React.useState<PickerSelectValue>(committedValue);
    const pendingCommittedRef = React.useRef<PickerSelectValue | null>(null);

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
          items: resolvedItems,
          value: committedValue,
          separator,
        }),
      [committedValue, resolvedItems, separator],
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
        body: slots.drawerBody({
          class: [classNames?.drawerBody, 'overflow-hidden'],
        }),
        footer: slots.drawerFooter({ class: classNames?.drawerFooter }),
      }),
      [classNames?.drawerBody, classNames?.drawerFooter, slots],
    );
    const selectboxListboxClassNames = React.useMemo(
      () => ({
        scrollbox: 'h-[50vh]',
        scrollboxContent: 'pb-6 pb-safe-4',
      }),
      [],
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
      (nextValue: PickerSelectValue) => {
        const normalized = resolveValueByItems(resolvedItems, nextValue);
        const detail = resolveDraftDetail({
          previous: draftValue,
          next: normalized,
        });

        setDraftValue(normalized);
        onDraftValueChange?.(toOutputValue(normalized), detail);
      },
      [draftValue, onDraftValueChange, resolvedItems],
    );

    const handleConfirmTap = React.useCallback(() => {
      const normalized = resolveValueByItems(resolvedItems, draftValue);
      pendingCommittedRef.current = normalized;

      if (!isValueControlled) {
        setInnerCommittedValue(normalized);
      }

      onValueChange?.(toOutputValue(normalized));
      setOpen(false);
    }, [draftValue, isValueControlled, onValueChange, resolvedItems, setOpen]);

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
        Boolean(isDisabled || isReadOnly)
        || resolvedItems.every((item) => item.isDisabled === true),
      [isDisabled, isReadOnly, resolvedItems],
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
            <DrawerHeader
              className={slots.drawerTitle({ class: classNames?.drawerTitle })}
            >
              {drawerTitle ?? label}
            </DrawerHeader>
            <DrawerBody>
              <Selectbox
                className={slots.pickbox({ class: classNames?.pickbox })}
                color={resolvedColor}
                size={resolvedSize}
                selectionMode={selectionMode}
                selectIcon
                items={resolvedItems}
                value={draftValue}
                estimateSize={estimateSize}
                overscan={overscan}
                hasDivider
                listboxClassNames={selectboxListboxClassNames}
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

PickerSelect.displayName = 'Srcube.PickerSelect';
