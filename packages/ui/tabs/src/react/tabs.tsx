import * as React from 'react';
import { tabs, tabsTabState } from '../style';
import { TabsContext } from './context';
import type { TabsItem, TabsReactProps, TabsValue } from './props';

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const TAP_SWITCH_DURATION = 120;
const TAP_SWITCH_SCALE = 0.92;

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
      className,
      classNames,
      style,
      children,
      ...rest
    } = props;

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

    const slots = React.useMemo(
      () =>
        tabs({
          orientation,
          size,
          radius,
          color,
          isDisabled,
        }),
      [color, isDisabled, orientation, radius, size],
    );

    const tabsListRef = React.useRef<HTMLDivElement>(null);
    const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const [indicatorRect, setIndicatorRect] =
      React.useState<IndicatorRect | null>(null);
    const [isTapSwitching, setIsTapSwitching] = React.useState(false);
    const lastActiveTokenRef = React.useRef<string>(
      activeValue === null ? '' : toValueToken(activeValue),
    );

    const setTabRef = React.useCallback(
      (tabValue: TabsValue, node: HTMLButtonElement | null) => {
        const token = toValueToken(tabValue);

        if (node) {
          tabRefs.current.set(token, node);
          return;
        }

        tabRefs.current.delete(token);
      },
      [],
    );

    const measureIndicator = React.useCallback(() => {
      const listNode = tabsListRef.current;
      if (!listNode || !activeItem) {
        setIndicatorRect(null);
        return;
      }

      const tabNode = tabRefs.current.get(toValueToken(activeItem.value));
      if (!tabNode) {
        setIndicatorRect(null);
        return;
      }

      const listRect = listNode.getBoundingClientRect();
      const tabRect = tabNode.getBoundingClientRect();

      setIndicatorRect({
        left: Math.max(0, tabRect.left - listRect.left),
        top: Math.max(0, tabRect.top - listRect.top),
        width: tabRect.width,
        height: tabRect.height,
      });
    }, [activeItem]);

    React.useLayoutEffect(() => {
      measureIndicator();
    }, [measureIndicator, items, orientation, radius, size]);

    React.useEffect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const handleResize = () => {
        measureIndicator();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [measureIndicator]);

    React.useEffect(() => {
      const nextToken = activeValue === null ? '' : toValueToken(activeValue);
      const prevToken = lastActiveTokenRef.current;

      if (prevToken && nextToken && prevToken !== nextToken) {
        setIsTapSwitching(true);
        const timer = globalThis.setTimeout(() => {
          setIsTapSwitching(false);
        }, TAP_SWITCH_DURATION);
        lastActiveTokenRef.current = nextToken;

        return () => {
          globalThis.clearTimeout(timer);
        };
      }

      lastActiveTokenRef.current = nextToken;
      return undefined;
    }, [activeValue]);

    const indicatorStyle = React.useMemo<React.CSSProperties | undefined>(() => {
      if (!indicatorRect) {
        return undefined;
      }

      const scale = isTapSwitching ? TAP_SWITCH_SCALE : 1;
      const transform =
        orientation === 'y'
          ? `translate3d(0, ${indicatorRect.top}px, 0) scaleY(${scale})`
          : `translate3d(${indicatorRect.left}px, 0, 0) scaleX(${scale})`;

      return {
        width: indicatorRect.width,
        height: indicatorRect.height,
        transform,
        transformOrigin: 'center center',
      };
    }, [indicatorRect, isTapSwitching, orientation]);

    const handleSelect = React.useCallback(
      (item: TabsItem) => {
        if (isDisabled || item.isDisabled) {
          return;
        }

        if (activeValue === item.value) {
          return;
        }

        if (!isControlled) {
          setInnerValue(item.value);
        }

        onValueChange?.(item.value);
      },
      [activeValue, isControlled, isDisabled, onValueChange],
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

    return (
      <TabsContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={slots.base({ class: [classNames?.base, className] })}
          style={styleObj}
          {...rest}
        >
          <div className={slots.tabsWrapper({ class: classNames?.tabsWrapper })}>
            <div
              ref={tabsListRef}
              role="tablist"
              aria-orientation={orientation === 'y' ? 'vertical' : 'horizontal'}
              className={slots.tabsList({ class: classNames?.tabsList })}
            >
              {indicatorStyle ? (
                <span
                  aria-hidden
                  className={slots.indicator({ class: classNames?.indicator })}
                  style={indicatorStyle}
                />
              ) : null}

              {items.map((item) => {
                const itemDisabled = Boolean(isDisabled || item.isDisabled);
                const isSelected = activeValue === item.value;
                const stateClassName = tabsTabState({
                  color,
                  isSelected,
                  isDisabled: itemDisabled,
                });

                return (
                  <button
                    key={toValueToken(item.value)}
                    ref={(node) => {
                      setTabRef(item.value, node);
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-disabled={itemDisabled || undefined}
                    className={slots.tab({
                      class: [classNames?.tab, stateClassName],
                    })}
                    onClick={() => {
                      handleSelect(item);
                    }}
                  >
                    <span className={slots.tabLabel({ class: classNames?.tabLabel })}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
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
