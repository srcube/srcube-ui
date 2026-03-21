import {
  forwardRef,
  useLayoutEffect,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { pickbox, pickboxItemState } from '@srcube-ui/styles/components/pickbox';
import type {
  PickboxColumn,
  PickboxItem,
  PickboxItemId,
  PickboxReactProps,
  PickboxValue,
} from './props';

function getDefaultColumnValue(column: PickboxColumn): PickboxItemId | null {
  const firstEnabled = column.items.find((item) => !item.isDisabled);
  return firstEnabled?.id ?? column.items[0]?.id ?? null;
}

function ensurePickboxValue(
  columns: PickboxColumn[],
  input?: PickboxValue,
): PickboxValue {
  return columns.map((column, index) => input?.[index] ?? getDefaultColumnValue(column));
}

function resolveSelectedIndex(items: PickboxItem[], selectedId: PickboxItemId | null) {
  if (items.length === 0) {
    return -1;
  }

  if (selectedId == null) {
    const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
  }

  const currentIndex = items.findIndex((item) => item.id === selectedId);
  if (currentIndex >= 0) {
    return currentIndex;
  }

  const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
  return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
}

function resolveDefaultMetricBySize(size: PickboxReactProps['size']) {
  if (size === 'sm') {
    return 36;
  }

  if (size === 'lg') {
    return 52;
  }

  return 44;
}

function resolveTone(value: PickboxReactProps['tone']) {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveMetricValue(
  value: number | undefined,
  fallback: number,
) {
  const next = Number(value);
  if (Number.isFinite(next) && next > 0) {
    return next;
  }
  return fallback;
}

type ColumnViewProps = {
  slots: ReturnType<typeof pickbox>;
  color: NonNullable<PickboxReactProps['color']>;
  tone: NonNullable<PickboxReactProps['tone']>;
  size: NonNullable<PickboxReactProps['size']>;
  column: PickboxColumn;
  columnIndex: number;
  selectedId: PickboxItemId | null;
  estimateSize: number;
  overscan: number;
  padding: number;
  scrollEndDelay: number;
  classNames?: PickboxReactProps['classNames'];
  onSelect: (columnIndex: number, itemId: PickboxItemId) => void;
  renderItem?: PickboxReactProps['renderItem'];
  getItemKey?: PickboxReactProps['getItemKey'];
};

function ColumnView({
  slots,
  color,
  tone,
  size,
  column,
  columnIndex,
  selectedId,
  estimateSize,
  overscan,
  padding,
  scrollEndDelay,
  classNames,
  onSelect,
  renderItem,
  getItemKey,
}: ColumnViewProps) {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoAdjustTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAutoAdjustingRef = useRef(false);

  const selectedIndex = useMemo(
    () => resolveSelectedIndex(column.items, selectedId),
    [column.items, selectedId],
  );

  const virtualizer = useVirtualizer({
    count: column.items.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => estimateSize,
    initialRect: { width: 1, height: 320 },
    overscan,
    paddingStart: padding,
    paddingEnd: padding,
    getItemKey: (index) => {
      const item = column.items[index];
      if (!item) {
        return `${columnIndex}-${index}`;
      }
      return getItemKey ? getItemKey(item, columnIndex, index) : item.id;
    },
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  const scheduleAutoAdjustEnd = useCallback(() => {
    if (autoAdjustTimerRef.current !== null) {
      clearTimeout(autoAdjustTimerRef.current);
    }

    autoAdjustTimerRef.current = setTimeout(() => {
      isAutoAdjustingRef.current = false;
    }, Math.max(scrollEndDelay, 80));
  }, [scrollEndDelay]);

  const cancelScrollAnimation = useCallback(() => {
    if (
      animationFrameRef.current !== null &&
      typeof cancelAnimationFrame === 'function'
    ) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = null;
  }, []);

  const alignToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      if (index < 0) {
        return;
      }

      if (scrollStopTimerRef.current !== null) {
        clearTimeout(scrollStopTimerRef.current);
        scrollStopTimerRef.current = null;
      }

      const scrollElement = scrollElementRef.current;
      if (!scrollElement) {
        isAutoAdjustingRef.current = true;
        virtualizer.scrollToIndex(index, {
          align: 'center',
          behavior,
        });

        if (behavior === 'smooth') {
          scheduleAutoAdjustEnd();
          return;
        }

        isAutoAdjustingRef.current = false;
        return;
      }

      const targetOffset = Math.max(
        0,
        padding + index * estimateSize + estimateSize / 2 - scrollElement.clientHeight / 2,
      );

      cancelScrollAnimation();
      isAutoAdjustingRef.current = true;

      if (behavior !== 'smooth') {
        scrollElement.scrollTop = targetOffset;
        isAutoAdjustingRef.current = false;
        return;
      }

      const startOffset = scrollElement.scrollTop;
      const distance = targetOffset - startOffset;

      if (Math.abs(distance) < 1 || typeof requestAnimationFrame !== 'function') {
        scrollElement.scrollTop = targetOffset;
        isAutoAdjustingRef.current = false;
        return;
      }

      const duration = Math.max(110, Math.min(190, Math.abs(distance) * 0.45));
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        scrollElement.scrollTop = startOffset + distance * eased;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
        isAutoAdjustingRef.current = false;
      };

      animationFrameRef.current = requestAnimationFrame(step);
      scheduleAutoAdjustEnd();
    },
    [
      cancelScrollAnimation,
      estimateSize,
      padding,
      scheduleAutoAdjustEnd,
      virtualizer,
    ],
  );

  const snapToNearest = useCallback(() => {
    if (column.items.length === 0) {
      return;
    }

    const scrollElement = scrollElementRef.current;
    if (!scrollElement) {
      return;
    }

    const visibleItems = virtualizer.getVirtualItems();
    if (visibleItems.length === 0) {
      return;
    }

    const viewportCenter = scrollElement.scrollTop + scrollElement.clientHeight / 2;

    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const virtualItem of visibleItems) {
      const item = column.items[virtualItem.index];
      if (!item || item.isDisabled) {
        continue;
      }

      const itemCenter = virtualItem.start + virtualItem.size / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = virtualItem.index;
      }
    }

    if (nearestIndex < 0) {
      return;
    }

    const nearestItem = column.items[nearestIndex];
    if (!nearestItem) {
      return;
    }

    alignToIndex(nearestIndex, 'smooth');
    onSelect(columnIndex, nearestItem.id);
  }, [alignToIndex, column.items, columnIndex, onSelect, virtualizer]);

  useLayoutEffect(() => {
    if (column.items.length === 0 || selectedIndex < 0) {
      return;
    }

    // Keep reopen/value-sync positioning immediate to avoid replay animation.
    alignToIndex(selectedIndex, 'auto');
  }, [alignToIndex, column.items.length, selectedIndex, padding]);

  useEffect(() => {
    return () => {
      if (scrollStopTimerRef.current !== null) {
        clearTimeout(scrollStopTimerRef.current);
      }

      if (autoAdjustTimerRef.current !== null) {
        clearTimeout(autoAdjustTimerRef.current);
      }

      cancelScrollAnimation();
    };
  }, [cancelScrollAnimation]);

  const handleScroll = useCallback(() => {
    if (isAutoAdjustingRef.current) {
      scheduleAutoAdjustEnd();
      return;
    }

    if (scrollStopTimerRef.current !== null) {
      clearTimeout(scrollStopTimerRef.current);
    }

    scrollStopTimerRef.current = setTimeout(() => {
      snapToNearest();
    }, scrollEndDelay);
  }, [scheduleAutoAdjustEnd, scrollEndDelay, snapToNearest]);

  const columnClassName = slots.column({ class: classNames?.column });
  const columnScrollClassName = slots.columnScroll({
    class: classNames?.columnScroll,
  });
  const columnContentClassName = slots.columnContent({
    class: classNames?.columnContent,
  });
  const itemBaseClassName = slots.item({ class: classNames?.item });
  const itemLabelClassName = slots.itemLabel({ class: classNames?.itemLabel });

  return (
    <div className={columnClassName}>
      <div
        className={columnScrollClassName}
        ref={scrollElementRef}
        onScroll={handleScroll}
        role="listbox"
        aria-label={column.id != null ? `${column.id}` : `column-${columnIndex + 1}`}
      >
        <div
          className={columnContentClassName}
          style={{
            height: totalSize,
          }}
        >
          {virtualItems.map((virtualItem) => {
            const item = column.items[virtualItem.index];
            if (!item) {
              return null;
            }

            const isSelected = selectedId === item.id;
            const isDisabled = Boolean(item.isDisabled);
            const stateClassName = pickboxItemState({
              color,
              tone,
              size,
              isSelected,
              isDisabled,
            });
            const content = renderItem
              ? renderItem(item, columnIndex, virtualItem.index, {
                  isSelected,
                  isDisabled,
                })
              : item.label;

            return (
              <div
                key={virtualItem.key}
                className={`${itemBaseClassName} ${stateClassName}`.trim()}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                style={{
                  top: 0,
                  transform: `translateY(${virtualItem.start}px)`,
                  height: virtualItem.size,
                }}
              >
                <span className={itemLabelClassName}>{content}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const Pickbox = forwardRef<HTMLDivElement, PickboxReactProps>((props, ref) => {
  const {
    columns,
    size = 'md',
    color = 'default',
    tone = 'default',
    value,
    defaultValue,
    onValueChange,
    estimateSize,
    overscan = 5,
    indicatorHeight,
    scrollEndDelay = 120,
    className,
    classNames,
    getItemKey,
    renderItem,
    style,
    ...rest
  } = props;

  const rootRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [innerValue, setInnerValue] = useState<PickboxValue>(() =>
    ensurePickboxValue(columns, defaultValue),
  );

  const mergedValue = useMemo(
    () => ensurePickboxValue(columns, value ?? innerValue),
    [columns, innerValue, value],
  );
  const resolvedEstimateSize = useMemo(() => {
    const fallback = resolveDefaultMetricBySize(size);
    return resolveMetricValue(estimateSize, fallback);
  }, [estimateSize, size]);
  const resolvedIndicatorHeight = useMemo(() => {
    return resolveMetricValue(indicatorHeight, resolvedEstimateSize);
  }, [indicatorHeight, resolvedEstimateSize]);

  const resolvedPadding = useMemo(
    () => Math.max(0, containerHeight / 2 - resolvedIndicatorHeight / 2),
    [containerHeight, resolvedIndicatorHeight],
  );

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const measureContainer = useCallback(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }

    const nextHeight = node.getBoundingClientRect().height;
    if (Number.isFinite(nextHeight) && nextHeight > 0) {
      setContainerHeight(nextHeight);
    }
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      return;
    }

    setInnerValue((prev) => ensurePickboxValue(columns, prev));
  }, [columns, value]);

  useEffect(() => {
    measureContainer();
  }, [columns.length, measureContainer, resolvedIndicatorHeight]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureContainer();
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [measureContainer]);

  const slots = useMemo(
    () =>
      pickbox({
        size,
        color,
        tone,
      }),
    [color, size, tone],
  );
  const maskTopStyle = useMemo(
    () => ({
      background:
        'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 22%, rgba(255,255,255,0.78) 56%, rgba(255,255,255,0.4) 82%, rgba(255,255,255,0) 100%)',
    }),
    [],
  );
  const maskBottomStyle = useMemo(
    () => ({
      background:
        'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 22%, rgba(255,255,255,0.78) 56%, rgba(255,255,255,0.4) 82%, rgba(255,255,255,0) 100%)',
    }),
    [],
  );

  const handleSelect = useCallback(
    (columnIndex: number, nextItemId: PickboxItemId) => {
      const nextValue = [...mergedValue];
      nextValue[columnIndex] = nextItemId;

      if (value === undefined) {
        setInnerValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [mergedValue, onValueChange, value],
  );

  return (
    <div
      ref={setRefs}
      className={slots.base({ class: [classNames?.base, className] })}
      style={style}
      {...rest}
    >
      <div className={slots.columns({ class: classNames?.columns })}>
        {columns.map((column, columnIndex) => (
          <ColumnView
            key={column.id ?? columnIndex}
              slots={slots}
              color={color}
              tone={resolveTone(tone)}
              size={size}
            column={column}
            columnIndex={columnIndex}
            selectedId={mergedValue[columnIndex] ?? null}
            estimateSize={resolvedEstimateSize}
            overscan={overscan}
            padding={resolvedPadding}
            scrollEndDelay={scrollEndDelay}
            classNames={classNames}
            onSelect={handleSelect}
            getItemKey={getItemKey}
            renderItem={renderItem}
          />
        ))}
      </div>

      <div
        className={slots.indicator({ class: classNames?.indicator })}
        style={{ height: resolvedIndicatorHeight }}
      />
      <div
        className={slots.maskTop({ class: classNames?.maskTop })}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '33.3333%',
          zIndex: 20,
          pointerEvents: 'none',
          ...maskTopStyle,
        }}
      />
      <div
        className={slots.maskBottom({ class: classNames?.maskBottom })}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '33.3333%',
          zIndex: 20,
          pointerEvents: 'none',
          ...maskBottomStyle,
        }}
      />
    </div>
  );
});

Pickbox.displayName = 'Srcube.Pickbox';
