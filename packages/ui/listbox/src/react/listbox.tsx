import type React from 'react';
import { Scrollbox } from '@srcube-ui/scrollbox/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { listbox, listboxItemState } from '../style';
import type { ListboxItem, ListboxLocale, ListboxReactProps } from './props';

const EMPTY_TEXT: Record<ListboxLocale, string> = {
  en: 'No items.',
  'zh-CN': '暂无内容',
  'zh-TW': '暫無內容',
};

function shouldMeasure(
  value: ListboxReactProps['shouldMeasureItem'],
  item: ListboxItem,
  index: number,
) {
  if (typeof value === 'function') {
    return value(item, index);
  }
  return value === true;
}

function getDefaultRender(item: ListboxItem) {
  return item.label;
}

type FallbackVirtualItem = {
  key: string | number;
  index: number;
  start: number;
  size: number;
};

export const Listbox = forwardRef<HTMLDivElement, ListboxReactProps>(
  (props, ref) => {
    const {
      items,
      estimateSize,
      overscan = 5,
      emptyContent,
      hideEmptyContent = false,
      locale = 'en',
      selectedKeys: selectedKeysProp,
      defaultSelectedKeys,
      onSelectionChange,
      renderItem,
      getItemKey,
      orientation = 'y',
      hasDivider = false,
      className,
      classNames,
      itemClassName,
      style,
      shouldMeasureItem,
      onScroll,
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
      onScrollToUpper,
      onScrollToLower,
      ...rest
    } = props;

    const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState<
      Array<string | number>
    >(defaultSelectedKeys ?? []);

    const mergedSelectedKeys = selectedKeysProp ?? uncontrolledSelectedKeys;

    const selectedSet = useMemo(
      () => new Set(mergedSelectedKeys),
      [mergedSelectedKeys],
    );

    const scrollElementRef = useRef<HTMLDivElement>(null);

    const setScrollElementRef = useCallback((node: HTMLDivElement | null) => {
      scrollElementRef.current = node;
    }, []);

    const estimate = useMemo(() => {
      if (typeof estimateSize === 'function') {
        return estimateSize;
      }
      return () => estimateSize;
    }, [estimateSize]);

    const initialRect = useMemo(
      () =>
        orientation === 'x'
          ? { width: 320, height: 1 }
          : { width: 1, height: 320 },
      [orientation],
    );

    const virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => scrollElementRef.current,
      estimateSize: estimate,
      horizontal: orientation === 'x',
      overscan,
      initialRect,
      getItemKey: (index) =>
        getItemKey ? getItemKey(items[index]!, index) : items[index]!.id,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();
    const hasVirtualItems = virtualItems.length > 0;

    const fallbackVirtualItems = useMemo<FallbackVirtualItem[]>(() => {
      if (hasVirtualItems || items.length === 0) {
        return [];
      }

      const fallbackCount = Math.min(items.length, Math.max(1, overscan * 2 + 1));
      const next: FallbackVirtualItem[] = [];
      let offset = 0;

      for (let index = 0; index < fallbackCount; index += 1) {
        const item = items[index];
        if (!item) {
          continue;
        }

        const size = Math.max(1, Number(estimate(index)) || 1);

        next.push({
          key: getItemKey ? getItemKey(item, index) : item.id,
          index,
          start: offset,
          size,
        });

        offset += size;
      }

      return next;
    }, [estimate, getItemKey, hasVirtualItems, items, overscan]);

    const renderVirtualItems = hasVirtualItems ? virtualItems : fallbackVirtualItems;

    const slots = useMemo(
      () =>
        listbox({
          orientation,
          hasDivider,
        }),
      [orientation, hasDivider],
    );

    const isHorizontal = orientation === 'x';

    const contentStyle = useMemo<React.CSSProperties>(
      () => ({
        position: 'relative',
        width: isHorizontal ? totalSize : '100%',
        height: isHorizontal ? '100%' : totalSize,
      }),
      [isHorizontal, totalSize],
    );

    const listboxScrollboxClassName = slots.scrollbox({
      class: classNames?.scrollbox,
    });
    const listboxScrollboxContentClassName = slots.scrollboxContent({
      class: classNames?.scrollboxContent,
    });

    const scrollboxClassNames = useMemo(
      () => ({
        content: listboxScrollboxContentClassName,
      }),
      [listboxScrollboxContentClassName],
    );

    const handleSelect = useCallback(
      (item: ListboxItem) => {
        if (item.isDisabled) {
          return;
        }

        const isSelected = selectedSet.has(item.id);
        const next = isSelected
          ? mergedSelectedKeys.filter((key) => key !== item.id)
          : [...mergedSelectedKeys, item.id];

        if (selectedKeysProp === undefined) {
          setUncontrolledSelectedKeys(next);
        }

        onSelectionChange?.(next);
      },
      [mergedSelectedKeys, onSelectionChange, selectedKeysProp, selectedSet],
    );

    if (items.length === 0 && !hideEmptyContent) {
      return (
        <div
          ref={ref}
          className={slots.base({ class: [classNames?.base, className] })}
          style={style}
          {...rest}
        >
          <div
            className={slots.emptyContent({ class: classNames?.emptyContent })}
          >
            <span className={slots._iEmpty()} />
            <span>{emptyContent ?? EMPTY_TEXT[locale]}</span>
          </div>
        </div>
      );
    }

    if (items.length === 0 && hideEmptyContent) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <Scrollbox
          className={listboxScrollboxClassName}
          classNames={scrollboxClassNames}
          orientation={orientation}
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
          onScroll={onScroll}
          onScrollToUpper={onScrollToUpper}
          onScrollToLower={onScrollToLower}
          scrollRef={setScrollElementRef}
        >
          <div
            role="listbox"
            className={slots.content({ class: classNames?.content })}
            style={contentStyle}
          >
            {renderVirtualItems.map((virtualItem) => {
              const item = items[virtualItem.index];
              if (!item) {
                return null;
              }

              const itemStyle: React.CSSProperties = {
                position: 'absolute',
                top: 0,
                left: 0,
                width: isHorizontal ? virtualItem.size : '100%',
                height: isHorizontal ? '100%' : virtualItem.size,
                transform: isHorizontal
                  ? `translateX(${virtualItem.start}px)`
                  : `translateY(${virtualItem.start}px)`,
              };

              const stateClassName = listboxItemState({
                orientation,
                isSelected: selectedSet.has(item.id),
                isDisabled: item.isDisabled,
              });

              return (
                <div
                  key={virtualItem.key}
                  ref={
                    hasVirtualItems &&
                    shouldMeasure(shouldMeasureItem, item, virtualItem.index)
                      ? virtualizer.measureElement
                      : undefined
                  }
                  role="option"
                  aria-selected={selectedSet.has(item.id)}
                  data-index={virtualItem.index}
                  className={slots.item({
                    class: [itemClassName, classNames?.item, stateClassName],
                  })}
                  style={itemStyle}
                  onClick={() => handleSelect(item)}
                >
                  <span
                    className={slots.itemLabel({ class: classNames?.itemLabel })}
                  >
                    {renderItem
                      ? renderItem(item, virtualItem.index)
                      : getDefaultRender(item)}
                  </span>
                </div>
              );
            })}
          </div>
        </Scrollbox>
      </div>
    );
  },
);

Listbox.displayName = 'Srcube.Listbox';
