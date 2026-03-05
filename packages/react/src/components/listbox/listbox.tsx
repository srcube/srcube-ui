import type React from 'react';
import { Scrollbox } from '../scrollbox';
import {
  defaultRangeExtractor,
  type Range,
  useVirtualizer,
} from '@tanstack/react-virtual';
import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  DEFAULT_LISTBOX_LOCALE,
  LISTBOX_EMPTY_TEXT,
} from './locale';
import { listbox, listboxItemState } from '@srcube-ui/styles/components/listbox';
import type { ListboxItem, ListboxReactProps } from './props';

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

function resolveActiveStickyIndex(
  stickyIndexes: number[],
  startIndex: number,
): number | null {
  let activeStickyIndex: number | null = null;

  for (const stickyIndex of stickyIndexes) {
    if (stickyIndex <= startIndex) {
      activeStickyIndex = stickyIndex;
      continue;
    }

    break;
  }

  return activeStickyIndex;
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
      locale = DEFAULT_LISTBOX_LOCALE,
      renderItem,
      getItemKey,
      orientation = 'y',
      size = 'md',
      hasDivider = false,
      className,
      classNames,
      itemClassName,
      itemLabelClassName,
      style,
      shouldMeasureItem,
      onItemPress,
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

    const scrollElementRef = useRef<HTMLDivElement>(null);
    const activeStickyIndexRef = useRef<number | null>(null);

    const setScrollElementRef = useCallback((node: HTMLDivElement | null) => {
      scrollElementRef.current = node;
    }, []);

    const estimate = useMemo(() => {
      if (typeof estimateSize === 'function') {
        return estimateSize;
      }
      return () => estimateSize;
    }, [estimateSize]);

    const stickyIndexes = useMemo(() => {
      const indexes: number[] = [];

      items.forEach((item, index) => {
        if (item.isSticky) {
          indexes.push(index);
        }
      });

      return indexes;
    }, [items]);

    const rangeExtractor = useCallback(
      (range: Range) => {
        const defaultIndexes = defaultRangeExtractor(range);

        if (stickyIndexes.length === 0) {
          activeStickyIndexRef.current = null;
          return defaultIndexes;
        }

        const activeStickyIndex = resolveActiveStickyIndex(
          stickyIndexes,
          range.startIndex,
        );

        activeStickyIndexRef.current = activeStickyIndex;

        if (activeStickyIndex == null) {
          return defaultIndexes;
        }

        return Array.from(new Set([...defaultIndexes, activeStickyIndex])).sort(
          (a, b) => a - b,
        );
      },
      [stickyIndexes],
    );

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
      rangeExtractor,
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
          size,
          hasDivider,
        }),
      [orientation, size, hasDivider],
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

    const activeStickyIndex = useMemo(() => {
      if (stickyIndexes.length === 0) {
        return null;
      }

      const rangeStartIndex = virtualizer.range?.startIndex;

      if (typeof rangeStartIndex === 'number') {
        return resolveActiveStickyIndex(stickyIndexes, rangeStartIndex);
      }

      return activeStickyIndexRef.current ?? resolveActiveStickyIndex(stickyIndexes, 0);
    }, [stickyIndexes, virtualizer.range?.startIndex]);

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
            <span>{emptyContent ?? LISTBOX_EMPTY_TEXT[locale]}</span>
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

              const isActiveStickyItem =
                item.isSticky && virtualItem.index === activeStickyIndex;

              const itemStyle: React.CSSProperties = isActiveStickyItem
                ? {
                    position: 'sticky',
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    width: isHorizontal ? virtualItem.size : '100%',
                    height: isHorizontal ? '100%' : virtualItem.size,
                  }
                : {
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
                isDisabled: item.isDisabled,
              });

              const baseItemClassName = slots.item({
                class: [
                  itemClassName,
                  classNames?.item,
                  item.className,
                  stateClassName,
                ],
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
                  data-index={virtualItem.index}
                  className={
                    isActiveStickyItem
                      ? slots.stickyItem({
                          class: [baseItemClassName, classNames?.stickyItem],
                        })
                      : baseItemClassName
                  }
                  style={itemStyle}
                  onClick={() => {
                    if (item.isDisabled) {
                      return;
                    }

                    onItemPress?.(item, virtualItem.index);
                  }}
                >
                  {renderItem ? (
                    <span
                      className={slots.itemLabel({
                        class: [
                          classNames?.itemLabel,
                          itemLabelClassName,
                          item.labelClassName,
                        ],
                      })}
                    >
                      {renderItem(item, virtualItem.index)}
                    </span>
                  ) : (
                    <span
                      className={slots.itemInner({ class: classNames?.itemInner })}
                    >
                      <span
                        className={slots.itemLabel({
                          class: [
                            classNames?.itemLabel,
                            itemLabelClassName,
                            item.labelClassName,
                          ],
                        })}
                      >
                        {item.label}
                      </span>

                      {item.endIconClassName ? (
                        <span
                          aria-hidden
                          className={slots.itemIcon({
                            class: [classNames?.itemIcon, item.endIconClassName],
                          })}
                        />
                      ) : null}
                    </span>
                  )}
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
