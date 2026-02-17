import { Button, ButtonGroup } from '@srcube-ui/button/react';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from '@srcube-ui/drawer/react';
import { Field } from '@srcube-ui/field/react';
import { Pickbox } from '@srcube-ui/pickbox/react';
import * as React from 'react';
import {
  buildDateColumns,
  buildTimeColumns,
  formatDateTimeValue,
  hasSecondToken,
  resolveDateTimeFormat,
  resolveDateTimeMode,
  resolveDateTimePanel,
  resolveDateTimeParts,
  resolveDateTimePartsFromPickerValue,
  resolveYearRange,
} from '../shared/datetime';
import { picker } from '../style';
import type {
  PickerDatetimePanel,
  PickerDatetimeReactProps,
  PickerDatetimeValueDetail,
  PickerMultiValue,
} from './props';

function resolvePickerColor(
  value: PickerDatetimeReactProps['color'],
): NonNullable<PickerDatetimeReactProps['color']> {
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
  value: PickerDatetimeReactProps['size'],
): NonNullable<PickerDatetimeReactProps['size']> {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function toPickerValue(params: {
  panel: PickerDatetimePanel;
  value: ReturnType<typeof resolveDateTimeParts>;
  includeSecond: boolean;
}): PickerMultiValue {
  const { panel, value, includeSecond } = params;
  if (panel === 'date') {
    return [value.date.year, value.date.month, value.date.day];
  }

  if (includeSecond) {
    return [value.time.hour, value.time.minute, value.time.second];
  }

  return [value.time.hour, value.time.minute];
}

function toValueDetail(params: {
  mode: PickerDatetimeValueDetail['mode'];
  panel: PickerDatetimePanel;
  format: string;
  value: ReturnType<typeof resolveDateTimeParts>;
}): PickerDatetimeValueDetail {
  const { mode, panel, format, value } = params;
  return {
    mode,
    panel,
    format,
    date: {
      year: value.date.year,
      month: value.date.month,
      day: value.date.day,
    },
    time: {
      hour: value.time.hour,
      minute: value.time.minute,
      second: value.time.second,
    },
  };
}

export const PickerDatetime = React.forwardRef<
  HTMLDivElement,
  PickerDatetimeReactProps
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
    mode = 'datetime',
    value,
    defaultValue,
    format,
    minYear = 1900,
    maxYear = 2099,
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
    dateTabText = '日期',
    timeTabText = '时间',
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

  const resolvedMode = resolveDateTimeMode(mode);
  const resolvedFormat = resolveDateTimeFormat({
    mode: resolvedMode,
    format,
  });
  const resolvedSize = resolvePickerSize(size);
  const resolvedColor = resolvePickerColor(color);
  const includeSecond = hasSecondToken(resolvedFormat);
  const yearRange = React.useMemo(
    () => resolveYearRange(minYear, maxYear),
    [maxYear, minYear],
  );

  const isValueControlled = value !== undefined;
  const [innerCommittedValue, setInnerCommittedValue] = React.useState(() =>
    formatDateTimeValue(
      resolveDateTimeParts({
        value: defaultValue ?? value,
        format: resolvedFormat,
        range: yearRange,
      }),
      resolvedFormat,
    ),
  );

  const committedParts = React.useMemo(
    () =>
      resolveDateTimeParts({
        value: isValueControlled ? (value ?? null) : innerCommittedValue,
        format: resolvedFormat,
        range: yearRange,
      }),
    [innerCommittedValue, isValueControlled, resolvedFormat, value, yearRange],
  );

  const committedValue = React.useMemo(
    () => formatDateTimeValue(committedParts, resolvedFormat),
    [committedParts, resolvedFormat],
  );

  const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

  const [innerPanel, setInnerPanel] = React.useState<PickerDatetimePanel>(() =>
    resolveDateTimePanel(resolvedMode, 'date'),
  );
  const activePanel = resolveDateTimePanel(resolvedMode, innerPanel);
  const [draftParts, setDraftParts] = React.useState(committedParts);
  const pendingCommittedRef = React.useRef<ReturnType<typeof resolveDateTimeParts> | null>(
    null,
  );

  React.useEffect(() => {
    setInnerPanel((prev) => resolveDateTimePanel(resolvedMode, prev));
  }, [resolvedMode]);

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

  const pickerColumns = React.useMemo(
    () =>
      activePanel === 'date'
        ? buildDateColumns({
            parts: draftParts.date,
            range: yearRange,
          })
        : buildTimeColumns({
            includeSecond,
          }),
    [activePanel, draftParts.date, includeSecond, yearRange],
  );

  const pickerValue = React.useMemo(
    () =>
      toPickerValue({
        panel: activePanel,
        value: draftParts,
        includeSecond,
      }),
    [activePanel, draftParts, includeSecond],
  );

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

  const handlePanelChange = React.useCallback(
    (panel: PickerDatetimePanel) => {
      setInnerPanel(resolveDateTimePanel(resolvedMode, panel));
    },
    [resolvedMode],
  );

  const handleDraftValueChange = React.useCallback(
    (nextValue: PickerMultiValue) => {
      const nextParts = resolveDateTimePartsFromPickerValue({
        value: nextValue,
        panel: activePanel,
        current: draftParts,
        range: yearRange,
        includeSecond,
      });
      const nextFormatted = formatDateTimeValue(nextParts, resolvedFormat);

      setDraftParts(nextParts);
      onDraftValueChange?.(
        nextFormatted,
        toValueDetail({
          mode: resolvedMode,
          panel: activePanel,
          format: resolvedFormat,
          value: nextParts,
        }),
      );
    },
    [
      activePanel,
      draftParts,
      includeSecond,
      onDraftValueChange,
      resolvedFormat,
      resolvedMode,
      yearRange,
    ],
  );

  const handleConfirmTap = React.useCallback(() => {
    const normalized = resolveDateTimeParts({
      value: formatDateTimeValue(draftParts, resolvedFormat),
      format: resolvedFormat,
      range: yearRange,
      fallback: draftParts,
    });
    const nextValue = formatDateTimeValue(normalized, resolvedFormat);
    pendingCommittedRef.current = normalized;

    if (!isValueControlled) {
      setInnerCommittedValue(nextValue);
    }

    onValueChange?.(
      nextValue,
      toValueDetail({
        mode: resolvedMode,
        panel: activePanel,
        format: resolvedFormat,
        value: normalized,
      }),
    );
    setOpen(false);
  }, [
    activePanel,
    draftParts,
    isValueControlled,
    onValueChange,
    resolvedFormat,
    resolvedMode,
    setOpen,
    yearRange,
  ]);

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
        value={committedValue}
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
              {resolvedMode === 'datetime' ? (
                <div className={slots.$modeTabs({ class: classNames?.$modeTabs })}>
                  <ButtonGroup
                    size={resolvedSize}
                    isBlock
                    className={slots.modeTabs({ class: classNames?.modeTabs })}
                  >
                    <Button
                      className={slots.modeTabButton({ class: classNames?.modeTabButton })}
                      color={activePanel === 'date' ? resolvedColor : 'default'}
                      variant={activePanel === 'date' ? 'solid' : 'flat'}
                      onTap={() => {
                        handlePanelChange('date');
                      }}
                    >
                      {dateTabText}
                    </Button>
                    <Button
                      className={slots.modeTabButton({ class: classNames?.modeTabButton })}
                      color={activePanel === 'time' ? resolvedColor : 'default'}
                      variant={activePanel === 'time' ? 'solid' : 'flat'}
                      onTap={() => {
                        handlePanelChange('time');
                      }}
                    >
                      {timeTabText}
                    </Button>
                  </ButtonGroup>
                </div>
              ) : null}

              <Pickbox
                className={slots.pickbox({ class: classNames?.pickbox })}
                color={resolvedColor}
                size={resolvedSize}
                columns={pickerColumns}
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

PickerDatetime.displayName = 'Srcube.PickerDatetime';
