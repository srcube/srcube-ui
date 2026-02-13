import * as React from 'react';
import { Scrollbox } from '@srcube-ui/scrollbox/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { tabs, tabsTabState } from '../style';
import { TabsContext } from './context';
import type { TabsItem, TabsReactProps, TabsValue } from './props';

type ScrollSide = 'start' | 'end' | 'top' | 'bottom' | null;

type FallbackVirtualItem = {
  key: string;
  index: number;
  start: number;
  size: number;
};

const HORIZONTAL_ESTIMATE_BY_SIZE = {
  sm: 72,
  md: 88,
  lg: 104,
} as const;

const VERTICAL_ESTIMATE_BY_SIZE = {
  sm: 28,
  md: 32,
  lg: 36,
} as const;

const CROSS_SIZE_BY_SIZE = {
  sm: 28,
  md: 32,
  lg: 36,
} as const;

const EDGE_SHIFT_BY_SIZE = {
  x: {
    sm: 45,
    md: 50,
    lg: 55,
  },
  y: {
    sm: 15,
    md: 20,
    lg: 25,
  },
} as const;

function resolveFallbackValue(items: TabsItem[]): TabsValue | null {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

function toValueToken(value: TabsValue): string {
  return `${typeof value}:${String(value)}`;
}

function findItemByValue(items: TabsItem[], value: TabsValue | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return items.find((item) => item.value === value) ?? null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveEstimateSize({
  orientation,
  size,
  estimateSize,
}: {
  orientation: 'x' | 'y';
  size: NonNullable<TabsReactProps['size']>;
  estimateSize?: number;
}) {
  const preferred = Math.max(0, Number(estimateSize) || 0);
  if (preferred > 0) {
    return preferred;
  }

  if (orientation === 'x') {
    return HORIZONTAL_ESTIMATE_BY_SIZE[size];
  }

  return VERTICAL_ESTIMATE_BY_SIZE[size];
}

function resolveCrossSize(size: NonNullable<TabsReactProps['size']>) {
  return CROSS_SIZE_BY_SIZE[size];
}

function resolveEdgeShift({
  orientation,
  size,
}: {
  orientation: 'x' | 'y';
  size: NonNullable<TabsReactProps['size']>;
}) {
  return EDGE_SHIFT_BY_SIZE[orientation][size];
}

function resolveMaskBleedClassNames({
  orientation,
  size,
}: {
  orientation: 'x' | 'y';
  size: NonNullable<TabsReactProps['size']>;
}) {
  const isSm = size === 'sm';

  if (orientation === 'x') {
    return {
      maskLeft: isSm ? '-left-0.5' : '-left-1',
      maskRight: isSm ? '-right-0.5' : '-right-1',
    };
  }

  return {
    maskTop: isSm ? '-top-0.5' : '-top-1',
    maskBottom: isSm ? '-bottom-0.5' : '-bottom-1',
  };
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsReactProps>(
  (props, ref) => {
    const {
      items,
      value,
      defaultValue,
      onValueChange,
      orientation = 'x',
      size = 'md',
      radius = 'md',
      color = 'default',
      isDisabled = false,
      estimateSize,
      overscan = 5,
      hideMasks = false,
      className,
      classNames,
      style,
      children,
      ...rest
    } = props;

    const resolvedOrientation = orientation === 'y' ? 'y' : 'x';
    const resolvedSize = size;
    const resolvedEstimateSize = React.useMemo(
      () =>
        resolveEstimateSize({
          orientation: resolvedOrientation,
          size: resolvedSize,
          estimateSize,
        }),
      [estimateSize, resolvedOrientation, resolvedSize],
    );
    const resolvedCrossSize = React.useMemo(
      () => resolveCrossSize(resolvedSize),
      [resolvedSize],
    );
    const resolvedOverscan = Math.max(1, Number(overscan) || 5);

    const isControlled = value !== null && value !== undefined;
    const [innerValue, setInnerValue] = React.useState<TabsValue | null>(() => {
      if (isControlled) {
        return value ?? null;
      }
      if (defaultValue !== null && defaultValue !== undefined) {
        return defaultValue;
      }
      return resolveFallbackValue(items);
    });

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      const currentItem = findItemByValue(items, innerValue);
      if (currentItem && !currentItem.isDisabled) {
        return;
      }

      const nextValue = resolveFallbackValue(items);
      if (nextValue !== innerValue) {
        setInnerValue(nextValue);
      }
    }, [innerValue, isControlled, items]);

    const activeValue = isControlled ? (value ?? null) : innerValue;
    const activeItem = React.useMemo(
      () => findItemByValue(items, activeValue),
      [activeValue, items],
    );
    const activeIndex = React.useMemo(() => {
      if (!activeItem) {
        return -1;
      }
      return items.findIndex((item) => item.value === activeItem.value);
    }, [activeItem, items]);

    const slots = React.useMemo(
      () =>
        tabs({
          orientation: resolvedOrientation,
          size: resolvedSize,
          radius,
          color,
          isDisabled,
        }),
      [color, isDisabled, radius, resolvedOrientation, resolvedSize],
    );

    const scrollElementRef = React.useRef<HTMLDivElement>(null);
    const setScrollElementRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        scrollElementRef.current = node;
      },
      [],
    );

    const virtualizer = useVirtualizer({
      count: items.length,
      getScrollElement: () => scrollElementRef.current,
      estimateSize: () => resolvedEstimateSize,
      horizontal: resolvedOrientation === 'x',
      overscan: resolvedOverscan,
      initialRect:
        resolvedOrientation === 'x'
          ? { width: 320, height: resolvedCrossSize }
          : { width: 200, height: 320 },
      getItemKey: (index) => {
        const item = items[index];
        return item ? toValueToken(item.value) : `index:${index}`;
      },
    });

    const totalSize = virtualizer.getTotalSize();
    const virtualItems = virtualizer.getVirtualItems();
    const hasVirtualItems = virtualItems.length > 0;

    const fallbackVirtualItems = React.useMemo<FallbackVirtualItem[]>(() => {
      if (hasVirtualItems || items.length === 0) {
        return [];
      }

      const fallbackCount = Math.min(
        items.length,
        Math.max(1, resolvedOverscan * 2 + 1),
      );

      return Array.from({ length: fallbackCount }, (_, index) => ({
        key: `fallback-${index}`,
        index,
        start: index * resolvedEstimateSize,
        size: resolvedEstimateSize,
      }));
    }, [hasVirtualItems, items.length, resolvedEstimateSize, resolvedOverscan]);

    const renderVirtualItems = hasVirtualItems ? virtualItems : fallbackVirtualItems;

    const tabsListStyle = React.useMemo<React.CSSProperties>(
      () =>
        resolvedOrientation === 'x'
          ? {
              position: 'relative',
              width: totalSize,
              height: resolvedCrossSize,
            }
          : {
              position: 'relative',
              width: '100%',
              height: totalSize,
            },
      [resolvedCrossSize, resolvedOrientation, totalSize],
    );

    const indicatorStyle = React.useMemo<React.CSSProperties | undefined>(() => {
      if (activeIndex < 0) {
        return undefined;
      }

      const start = activeIndex * resolvedEstimateSize;
      const transform =
        resolvedOrientation === 'y'
          ? `translate3d(0, ${start}px, 0)`
          : `translate3d(${start}px, 0, 0)`;

      return resolvedOrientation === 'y'
        ? {
            width: '100%',
            height: resolvedEstimateSize,
            transform,
            transformOrigin: 'center center',
          }
        : {
            width: resolvedEstimateSize,
            height: '100%',
            transform,
            transformOrigin: 'center center',
          };
    }, [activeIndex, resolvedEstimateSize, resolvedOrientation]);

    const ensureTabVisible = React.useCallback(
      (
        tabIndex: number,
        preferSide: ScrollSide = null,
        behavior: ScrollBehavior = 'smooth',
      ) => {
        if (tabIndex < 0) {
          return;
        }

        const node = scrollElementRef.current;
        if (!node) {
          return;
        }

        const viewportSize =
          resolvedOrientation === 'x' ? node.clientWidth : node.clientHeight;
        if (viewportSize <= 0) {
          return;
        }

        const edgeShift = resolveEdgeShift({
          orientation: resolvedOrientation,
          size: resolvedSize,
        });
        const maxOffset = Math.max(0, totalSize - viewportSize);
        const itemStart = tabIndex * resolvedEstimateSize;
        const itemEnd = itemStart + resolvedEstimateSize;
        const currentOffset =
          resolvedOrientation === 'x' ? node.scrollLeft : node.scrollTop;
        const visibleStart = currentOffset;
        const visibleEnd = currentOffset + viewportSize;
        const shouldAlignByEdge =
          preferSide === 'start' ||
          preferSide === 'end' ||
          preferSide === 'top' ||
          preferSide === 'bottom';
        const nearStart = shouldAlignByEdge && itemStart - visibleStart <= edgeShift;
        const nearEnd = shouldAlignByEdge && visibleEnd - itemEnd <= edgeShift;
        const outStart = itemStart < visibleStart;
        const outEnd = itemEnd > visibleEnd;

        if (!outStart && !outEnd && !nearStart && !nearEnd) {
          return;
        }

        const candidateMin = clamp(itemStart - edgeShift, 0, maxOffset);
        const candidateMax = clamp(
          Math.max(0, itemEnd - viewportSize) + edgeShift,
          0,
          maxOffset,
        );

        let target = currentOffset;

        if (preferSide === 'start' || preferSide === 'top') {
          target = candidateMin;
        } else if (preferSide === 'end' || preferSide === 'bottom') {
          target = candidateMax;
        } else if (outStart) {
          target = candidateMin;
        } else if (outEnd) {
          target = candidateMax;
        } else if (nearEnd) {
          target = candidateMax;
        } else if (nearStart) {
          target = candidateMin;
        }

        if (Math.abs(target - currentOffset) < 1) {
          return;
        }

        if (resolvedOrientation === 'x') {
          node.scrollTo({ left: target, behavior });
        } else {
          node.scrollTo({ top: target, behavior });
        }
      },
      [resolvedEstimateSize, resolvedOrientation, resolvedSize, totalSize],
    );

    const resolveTapSideForIndex = React.useCallback(
      (tabIndex: number): ScrollSide => {
        const node = scrollElementRef.current;
        if (!node) {
          return null;
        }

        const viewportSize =
          resolvedOrientation === 'x' ? node.clientWidth : node.clientHeight;
        if (viewportSize <= 0) {
          return null;
        }

        const itemStart = tabIndex * resolvedEstimateSize;
        const itemCenter = itemStart + resolvedEstimateSize / 2;
        const currentOffset =
          resolvedOrientation === 'x' ? node.scrollLeft : node.scrollTop;
        const relativeCenter = itemCenter - currentOffset;

        if (resolvedOrientation === 'x') {
          return relativeCenter < viewportSize / 2 ? 'start' : 'end';
        }

        return relativeCenter < viewportSize / 2 ? 'top' : 'bottom';
      },
      [resolvedEstimateSize, resolvedOrientation],
    );

    React.useEffect(() => {
      if (activeIndex < 0) {
        return;
      }

      if (typeof window === 'undefined') {
        ensureTabVisible(activeIndex, null, 'auto');
        return;
      }

      const frame = window.requestAnimationFrame(() => {
        ensureTabVisible(activeIndex, null, 'auto');
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [activeIndex, ensureTabVisible]);

    const handleSelect = React.useCallback(
      (item: TabsItem, index: number) => {
        if (isDisabled || item.isDisabled) {
          return;
        }

        if (activeValue === item.value) {
          return;
        }

        const preferSide = resolveTapSideForIndex(index);

        if (!isControlled) {
          setInnerValue(item.value);
        }

        onValueChange?.(item.value);
        ensureTabVisible(index, preferSide, 'smooth');
      },
      [
        activeValue,
        ensureTabVisible,
        isControlled,
        isDisabled,
        onValueChange,
        resolveTapSideForIndex,
      ],
    );

    const panelClassName = React.useMemo(
      () => slots.panel({ class: classNames?.panel }),
      [classNames?.panel, slots],
    );

    const contextValue = React.useMemo(
      () => ({
        activeValue,
        panelClassName,
      }),
      [activeValue, panelClassName],
    );

    const styleObj = typeof style === 'string' ? undefined : style;
    const scrollboxContentClassName = slots.scrollboxContent({
      class: classNames?.scrollboxContent,
    });
    const scrollboxMaskClassNames = React.useMemo(
      () =>
        resolveMaskBleedClassNames({
          orientation: resolvedOrientation,
          size: resolvedSize,
        }),
      [resolvedOrientation, resolvedSize],
    );
    const scrollboxClassNames = React.useMemo(
      () => ({
        content: scrollboxContentClassName,
        ...scrollboxMaskClassNames,
      }),
      [scrollboxContentClassName, scrollboxMaskClassNames],
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={slots.base({ class: [classNames?.base, className] })}
          style={styleObj}
          {...rest}
        >
          <div className={slots.tabsWrapper({ class: classNames?.tabsWrapper })}>
            <Scrollbox
              orientation={resolvedOrientation}
              hideMasks={hideMasks}
              showScrollbar={false}
              className={slots.scrollbox({ class: classNames?.scrollbox })}
              classNames={scrollboxClassNames}
              scrollRef={setScrollElementRef}
            >
              <div
                role="tablist"
                aria-orientation={resolvedOrientation === 'y' ? 'vertical' : 'horizontal'}
                className={slots.tabsList({ class: classNames?.tabsList })}
                style={tabsListStyle}
              >
                {indicatorStyle ? (
                  <span
                    aria-hidden
                    className={slots.indicator({ class: classNames?.indicator })}
                    style={indicatorStyle}
                  />
                ) : null}

                {renderVirtualItems.map((virtualItem) => {
                  const item = items[virtualItem.index];
                  if (!item) {
                    return null;
                  }

                  const itemDisabled = Boolean(isDisabled || item.isDisabled);
                  const isSelected = activeValue === item.value;
                  const stateClassName = tabsTabState({
                    color,
                    isSelected,
                    isDisabled: itemDisabled,
                  });

                  const tabStyle: React.CSSProperties =
                    resolvedOrientation === 'x'
                      ? {
                          top: 0,
                          left: 0,
                          width: virtualItem.size,
                          height: '100%',
                          transform: `translate3d(${virtualItem.start}px,0,0)`,
                        }
                      : {
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: virtualItem.size,
                          transform: `translate3d(0,${virtualItem.start}px,0)`,
                        };

                  return (
                    <button
                      key={virtualItem.key}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      aria-disabled={itemDisabled || undefined}
                      className={slots.tab({
                        class: [classNames?.tab, stateClassName],
                      })}
                      style={tabStyle}
                      onClick={() => {
                        handleSelect(item, virtualItem.index);
                      }}
                    >
                      <span className={slots.tabLabel({ class: classNames?.tabLabel })}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Scrollbox>
          </div>

          {children ? (
            <div className={slots.panels({ class: classNames?.panels })}>
              {children}
            </div>
          ) : null}
        </div>
      </TabsContext.Provider>
    );
  },
);

Tabs.displayName = 'Srcube.Tabs';
