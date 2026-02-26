import type React from 'react';
import { Listbox } from '@srcube-ui/listbox/react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { selectbox, selectboxItemState } from '../style';
import type {
  SelectboxItem,
  SelectboxReactProps,
  SelectboxValue,
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

function resolveControlledValue(
  items: SelectboxItem[],
  value: SelectboxValue | undefined,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((candidateId) =>
    items.some((item) => isSameItemId(item.id, candidateId)));
}

type BlockPosition = 'none' | 'single' | 'start' | 'middle' | 'end';

function resolveBlockPosition(params: {
  selectedSet: Set<string | number>;
  items: SelectboxItem[];
  index: number;
}): BlockPosition {
  const { selectedSet, items, index } = params;
  const current = items[index];
  if (!current || !selectedSet.has(current.id)) {
    return 'none';
  }

  const prev = items[index - 1];
  const next = items[index + 1];
  const hasPrev = Boolean(prev && selectedSet.has(prev.id));
  const hasNext = Boolean(next && selectedSet.has(next.id));

  if (!hasPrev && !hasNext) {
    return 'single';
  }

  if (!hasPrev && hasNext) {
    return 'start';
  }

  if (hasPrev && hasNext) {
    return 'middle';
  }

  return 'end';
}

function resolveColor(value: SelectboxReactProps['color']) {
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

function resolveSize(value: SelectboxReactProps['size']) {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveDefaultMetricBySize(size: SelectboxReactProps['size']) {
  if (size === 'sm') {
    return 36;
  }

  if (size === 'lg') {
    return 52;
  }

  return 44;
}

function resolveEstimateSize(
  estimateSize: SelectboxReactProps['estimateSize'],
  size: SelectboxReactProps['size'],
) {
  if (typeof estimateSize === 'function') {
    return estimateSize;
  }

  const next = Number(estimateSize);
  if (Number.isFinite(next) && next > 0) {
    return next;
  }

  return resolveDefaultMetricBySize(size);
}

export const Selectbox = forwardRef<HTMLDivElement, SelectboxReactProps>(
  (props, ref) => {
    const {
      items,
      value,
      defaultValue,
      selectionMode = 'multiple',
      color,
      orientation = 'y',
      size = 'md',
      className,
      classNames,
      listboxClassNames,
      itemClassName,
      itemLabelClassName,
      selectIcon = false,
      onValueChange,
      onItemPress,
      renderItem,
      estimateSize,
      overscan,
      hasDivider,
      emptyContent,
      hideEmptyContent,
      locale,
      hideMasks,
      upperThreshold,
      lowerThreshold,
      scrollTop,
      scrollLeft,
      scrollIntoView,
      scrollWithAnimation,
      enableBackToTop,
      showScrollbar,
      enhanced,
      bounces,
      pagingEnabled,
      fastDeceleration,
      enableFlex,
      scrollAnchoring,
      refresherEnabled,
      refresherThreshold,
      refresherDefaultStyle,
      refresherBackground,
      refresherTriggered,
      onScroll,
      onScrollToUpper,
      onScrollToLower,
      shouldMeasureItem,
      getItemKey,
      ...rest
    } = props;

    const resolvedColor = resolveColor(color);
    const resolvedSize = resolveSize(size);
    const resolvedEstimateSize = useMemo(
      () => resolveEstimateSize(estimateSize, resolvedSize),
      [estimateSize, resolvedSize],
    );
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<SelectboxValue>(
      () => resolveControlledValue(items, defaultValue),
    );

    const selectedValue = useMemo(
      () =>
        isControlled
          ? resolveControlledValue(items, value)
          : resolveControlledValue(items, innerValue),
      [innerValue, isControlled, items, value],
    );

    const selectedSet = useMemo(
      () => new Set(selectedValue),
      [selectedValue],
    );

    const slots = useMemo(
      () =>
        selectbox({
          color: resolvedColor,
          orientation,
          size: resolvedSize,
        }),
      [orientation, resolvedColor, resolvedSize],
    );

    const nextValueByItem = useCallback(
      (itemId: string | number) => {
        if (selectionMode === 'single') {
          return [itemId];
        }

        if (selectedSet.has(itemId)) {
          return selectedValue.filter((candidate) => !isSameItemId(candidate, itemId));
        }

        return [...selectedValue, itemId];
      },
      [selectedSet, selectedValue, selectionMode],
    );

    const enhancedItems = useMemo(
      () =>
        items.map((item, index) => {
          const isSelected = selectedSet.has(item.id);
          const blockPosition = resolveBlockPosition({
            selectedSet,
            items,
            index,
          });

          return {
            ...item,
            className: selectboxItemState({
              color: resolvedColor,
              orientation,
              size: resolvedSize,
              isSelected,
              isDisabled: Boolean(item.isDisabled),
              blockPosition,
              class: slots.item({
                class: [itemClassName, classNames?.item, item.className],
              }),
            }),
            labelClassName: slots.itemLabel({
              class: [itemLabelClassName, classNames?.itemLabel, item.labelClassName],
            }),
            endIconClassName:
              selectIcon && isSelected
                ? slots.itemIcon({
                    class: classNames?.itemIcon,
                  })
                : '',
          };
        }),
      [
        classNames?.item,
        classNames?.itemIcon,
        classNames?.itemLabel,
        itemClassName,
        itemLabelClassName,
        items,
        orientation,
        resolvedSize,
        resolvedColor,
        selectedSet,
        selectIcon,
        slots,
      ],
    );

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        {...rest}
      >
        <Listbox
          className={slots.listbox({ class: classNames?.listbox })}
          classNames={listboxClassNames}
          items={enhancedItems}
          estimateSize={resolvedEstimateSize}
          overscan={overscan}
          orientation={orientation}
          size={resolvedSize}
          hasDivider={hasDivider}
          emptyContent={emptyContent}
          hideEmptyContent={hideEmptyContent}
          locale={locale}
          hideMasks={hideMasks}
          upperThreshold={upperThreshold}
          lowerThreshold={lowerThreshold}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          scrollIntoView={scrollIntoView}
          scrollWithAnimation={scrollWithAnimation}
          enableBackToTop={enableBackToTop}
          showScrollbar={showScrollbar}
          enhanced={enhanced}
          bounces={bounces}
          pagingEnabled={pagingEnabled}
          fastDeceleration={fastDeceleration}
          enableFlex={enableFlex}
          scrollAnchoring={scrollAnchoring}
          refresherEnabled={refresherEnabled}
          refresherThreshold={refresherThreshold}
          refresherDefaultStyle={refresherDefaultStyle}
          refresherBackground={refresherBackground}
          refresherTriggered={refresherTriggered}
          shouldMeasureItem={shouldMeasureItem}
          getItemKey={getItemKey}
          renderItem={(item, index) => {
            if (renderItem) {
              return renderItem(item, index, selectedSet.has(item.id));
            }
            return item.label;
          }}
          onItemPress={(item, index) => {
            if (item.isDisabled) {
              return;
            }

            const nextValue = nextValueByItem(item.id);

            if (!isControlled) {
              setInnerValue(nextValue);
            }

            onValueChange?.(nextValue);
            onItemPress?.(item, index, nextValue);
          }}
          onScroll={onScroll}
          onScrollToUpper={onScrollToUpper}
          onScrollToLower={onScrollToLower}
        />
      </div>
    );
  },
);

Selectbox.displayName = 'Srcube.Selectbox';
