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
  getFallbackDateTimeParts,
  hasSecondToken,
  normalizeDateTimeRangeOrder,
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
  PickerDatetimeRange,
  PickerDatetimeRangeReactProps,
  PickerDatetimeRangeValue,
  PickerDatetimeRangeValueDetail,
  PickerMultiValue,
} from './props';

function resolvePickerColor(
  value: PickerDatetimeRangeReactProps['color'],
): NonNullable<PickerDatetimeRangeReactProps['color']> {
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
  value: PickerDatetimeRangeReactProps['size'],
): NonNullable<PickerDatetimeRangeReactProps['size']> {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function formatRangeValue(params: {
  value: ReturnType<typeof resolveRangeParts>;
  format: string;
}): PickerDatetimeRangeValue {
  const { value, format } = params;
  return {
    start: formatDateTimeValue(value.start, format),
    end: formatDateTimeValue(value.end, format),
  };
}

function resolveDisplayValue(params: {
  value: PickerDatetimeRangeValue;
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

function resolveRangeParts(params: {
  value?: PickerDatetimeRangeValue | null;
  format: string;
  range: ReturnType<typeof resolveYearRange>;
  mode: ReturnType<typeof resolveDateTimeMode>;
}) {
  const { value, format, range, mode } = params;
  const fallback = getFallbackDateTimeParts(range);
  const startRaw = value?.start ?? null;
  const endRaw = value?.end ?? null;

  const start = resolveDateTimeParts({
    value: startRaw,
    format,
    range,
    fallback,
  });
  const end = resolveDateTimeParts({
    value: endRaw,
    format,
    range,
    fallback: start,
  });

  return normalizeDateTimeRangeOrder({
    rangeValue: {
      start,
      end,
    },
    activeRange: 'end',
    mode,
  });
}

function toPickerValue(params: {
  panel: PickerDatetimePanel;
  value: ReturnType<typeof resolveRangeParts>[PickerDatetimeRange];
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
  mode: PickerDatetimeRangeValueDetail['mode'];
  activeRange: PickerDatetimeRange;
  panel: PickerDatetimePanel;
  format: string;
  value: ReturnType<typeof resolveRangeParts>;
}): PickerDatetimeRangeValueDetail {
  const { mode, activeRange, panel, format, value } = params;

  return {
    mode,
    activeRange,
    panel,
    format,
    start: {
      date: {
        year: value.start.date.year,
        month: value.start.date.month,
        day: value.start.date.day,
      },
      time: {
        hour: value.start.time.hour,
        minute: value.start.time.minute,
        second: value.start.time.second,
      },
    },
    end: {
      date: {
        year: value.end.date.year,
        month: value.end.date.month,
        day: value.end.date.day,
      },
      time: {
        hour: value.end.time.hour,
        minute: value.end.time.minute,
        second: value.end.time.second,
      },
    },
  };
}

export const PickerDatetimeRange = React.forwardRef<
  HTMLDivElement,
  PickerDatetimeRangeReactProps
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
    startTabText = '开始',
    endTabText = '结束',
    dateTabText = '日期',
    timeTabText = '时间',
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
  const [innerCommittedValue, setInnerCommittedValue] =
    React.useState<PickerDatetimeRangeValue>(() =>
      formatRangeValue({
        value: resolveRangeParts({
          value: defaultValue ?? value,
          format: resolvedFormat,
          range: yearRange,
          mode: resolvedMode,
        }),
        format: resolvedFormat,
      }),
    );

  const committedParts = React.useMemo(
    () =>
      resolveRangeParts({
        value: isValueControlled ? value : innerCommittedValue,
        format: resolvedFormat,
        range: yearRange,
        mode: resolvedMode,
      }),
    [
      innerCommittedValue,
      isValueControlled,
      resolvedFormat,
      resolvedMode,
      value,
      yearRange,
    ],
  );

  const committedValue = React.useMemo(
    () =>
      formatRangeValue({
        value: committedParts,
        format: resolvedFormat,
      }),
    [committedParts, resolvedFormat],
  );

  const isOpenControlled = isOpenProp !== null && isOpenProp !== undefined;
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const resolvedOpen = isOpenControlled ? Boolean(isOpenProp) : innerOpen;

  const [activeRange, setActiveRange] = React.useState<PickerDatetimeRange>('start');
  const [innerPanel, setInnerPanel] = React.useState<PickerDatetimePanel>(() =>
    resolveDateTimePanel(resolvedMode, 'date'),
  );
  const activePanel = resolveDateTimePanel(resolvedMode, innerPanel);

  const [draftParts, setDraftParts] = React.useState(committedParts);
  const pendingCommittedRef = React.useRef<ReturnType<typeof resolveRangeParts> | null>(
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

  const displayValue = React.useMemo(
    () =>
      resolveDisplayValue({
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

  const activeParts = draftParts[activeRange];
  const pickerColumns = React.useMemo(
    () =>
      activePanel === 'date'
        ? buildDateColumns({
            parts: activeParts.date,
            range: yearRange,
          })
        : buildTimeColumns({
            includeSecond,
          }),
    [activePanel, activeParts.date, includeSecond, yearRange],
  );

  const pickerValue = React.useMemo(
    () =>
      toPickerValue({
        panel: activePanel,
        value: activeParts,
        includeSecond,
      }),
    [activePanel, activeParts, includeSecond],
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

  const handleRangeChange = React.useCallback((nextRange: PickerDatetimeRange) => {
    setActiveRange(nextRange);
  }, []);

  const handlePanelChange = React.useCallback(
    (panel: PickerDatetimePanel) => {
      setInnerPanel(resolveDateTimePanel(resolvedMode, panel));
    },
    [resolvedMode],
  );

  const handleDraftValueChange = React.useCallback(
    (nextValue: PickerMultiValue) => {
      const nextActiveParts = resolveDateTimePartsFromPickerValue({
        value: nextValue,
        panel: activePanel,
        current: draftParts[activeRange],
        range: yearRange,
        includeSecond,
      });

      const merged = normalizeDateTimeRangeOrder({
        rangeValue: {
          ...draftParts,
          [activeRange]: nextActiveParts,
        },
        activeRange,
        mode: resolvedMode,
      });

      const nextFormatted = formatRangeValue({
        value: merged,
        format: resolvedFormat,
      });

      setDraftParts(merged);
      onDraftValueChange?.(
        nextFormatted,
        toValueDetail({
          mode: resolvedMode,
          activeRange,
          panel: activePanel,
          format: resolvedFormat,
          value: merged,
        }),
      );
    },
    [
      activePanel,
      activeRange,
      draftParts,
      includeSecond,
      onDraftValueChange,
      resolvedFormat,
      resolvedMode,
      yearRange,
    ],
  );

  const handleConfirmTap = React.useCallback(() => {
    const normalized = normalizeDateTimeRangeOrder({
      rangeValue: draftParts,
      activeRange,
      mode: resolvedMode,
    });
    const nextValue = formatRangeValue({
      value: normalized,
      format: resolvedFormat,
    });
    pendingCommittedRef.current = normalized;

    if (!isValueControlled) {
      setInnerCommittedValue(nextValue);
    }

    onValueChange?.(
      nextValue,
      toValueDetail({
        mode: resolvedMode,
        activeRange,
        panel: activePanel,
        format: resolvedFormat,
        value: normalized,
      }),
    );
    setOpen(false);
  }, [
    activePanel,
    activeRange,
    draftParts,
    isValueControlled,
    onValueChange,
    resolvedFormat,
    resolvedMode,
    setOpen,
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
              <div className={slots.$rangeTabs({ class: classNames?.$rangeTabs })}>
                <ButtonGroup
                  size={resolvedSize}
                  isBlock
                  className={slots.rangeTabs({ class: classNames?.rangeTabs })}
                >
                  <Button
                    className={slots.modeTabButton({ class: classNames?.modeTabButton })}
                    color={activeRange === 'start' ? resolvedColor : 'default'}
                    variant={activeRange === 'start' ? 'solid' : 'flat'}
                    onTap={() => {
                      handleRangeChange('start');
                    }}
                  >
                    {startTabText}
                  </Button>
                  <Button
                    className={slots.modeTabButton({ class: classNames?.modeTabButton })}
                    color={activeRange === 'end' ? resolvedColor : 'default'}
                    variant={activeRange === 'end' ? 'solid' : 'flat'}
                    onTap={() => {
                      handleRangeChange('end');
                    }}
                  >
                    {endTabText}
                  </Button>
                </ButtonGroup>
              </div>

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

PickerDatetimeRange.displayName = 'Srcube.PickerDatetimeRange';
