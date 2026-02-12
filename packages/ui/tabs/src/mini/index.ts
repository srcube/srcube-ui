import { UIComponent } from '@srcube-ui/mini';
import { tabs, tabsTabState } from '../style';
import type { TabsMiniItem, TabsMiniProps, TabsMiniValue } from './props';
import { tabsMiniProps } from './props';

type TabsOrientation = 'x' | 'y';
type TabsColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';
type TabsSize = 'sm' | 'md' | 'lg';
type TabsRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

type TabMetric = {
  token: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type TabsMiniData = TabsMiniProps & {
  _innerValue: TabsMiniValue | null;
  _isTapSwitching: boolean;
  _tabMetrics: TabMetric[];
  indicatorStyle: string;
};

const TAP_SWITCH_DURATION = 120;
const TAP_SWITCH_SCALE = 0.92;

function resolveOrientation(value?: string | null): TabsOrientation {
  return value === 'y' ? 'y' : 'x';
}

function resolveColor(value?: string | null): TabsColor {
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

function resolveSize(value?: string | null): TabsSize {
  if (value === 'sm' || value === 'lg') {
    return value;
  }
  return 'md';
}

function resolveRadius(value?: string | null): TabsRadius {
  if (
    value === 'none' ||
    value === 'sm' ||
    value === 'lg' ||
    value === 'full'
  ) {
    return value;
  }
  return 'md';
}

function toValueToken(value: TabsMiniValue): string {
  return `${typeof value}:${String(value)}`;
}

function normalizeItems(items: unknown): TabsMiniItem[] {
  return Array.isArray(items) ? (items as TabsMiniItem[]) : [];
}

function resolveFallbackValue(items: TabsMiniItem[]): TabsMiniValue | null {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

function findItemByValue(items: TabsMiniItem[], value: TabsMiniValue | null) {
  if (value === null || value === undefined) {
    return null;
  }

  return items.find((item) => item.value === value) ?? null;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties: tabsMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _innerValue: null as TabsMiniValue | null,
    _isTapSwitching: false,
    _tabMetrics: [] as TabMetric[],
    indicatorStyle: '',
  },

  observers: {
    items() {
      this.syncInnerValue();
      this.remeasureAndUpdateIndicator();
    },
    value() {
      this.handleValueObserver();
      this.remeasureAndUpdateIndicator();
    },
    defaultValue() {
      this.syncInnerValue();
      this.remeasureAndUpdateIndicator();
    },
    orientation() {
      this.remeasureAndUpdateIndicator();
    },
    size() {
      this.remeasureAndUpdateIndicator();
    },
    radius() {
      this.remeasureAndUpdateIndicator();
    },
    isDisabled() {
      this.remeasureAndUpdateIndicator();
    },
  },

  lifetimes: {
    attached() {
      this.syncInnerValue();
      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      const instance = this as typeof this & {
        _lastActiveToken?: string;
      };

      instance._lastActiveToken =
        activeValue === null || activeValue === undefined
          ? ''
          : toValueToken(activeValue);
    },
    ready() {
      this.remeasureAndUpdateIndicator();
    },
    detached() {
      const instance = this as typeof this & {
        _tapSwitchTimer?: ReturnType<typeof setTimeout>;
      };

      if (instance._tapSwitchTimer) {
        clearTimeout(instance._tapSwitchTimer);
        instance._tapSwitchTimer = undefined;
      }
    },
  },

  computed: {
    $orientation(data: TabsMiniData) {
      return resolveOrientation(data.orientation);
    },
    $activeValue(data: TabsMiniData) {
      if (data.value !== null && data.value !== undefined) {
        return data.value;
      }

      return data._innerValue;
    },
    $classNames(data: TabsMiniData) {
      const slots = tabs({
        orientation: resolveOrientation(data.orientation),
        color: resolveColor(data.color),
        size: resolveSize(data.size),
        radius: resolveRadius(data.radius),
        isDisabled: Boolean(data.isDisabled),
      });

      const classNames = data.classNames ?? {};

      return {
        base: slots.base({ class: classNames.base }),
        tabsWrapper: slots.tabsWrapper({ class: classNames.tabsWrapper }),
        tabsList: slots.tabsList({ class: classNames.tabsList }),
        indicator: slots.indicator({ class: classNames.indicator }),
        tabLabel: slots.tabLabel({ class: classNames.tabLabel }),
        panels: slots.panels({ class: classNames.panels }),
      };
    },
    $renderItems(data: TabsMiniData) {
      const slots = tabs({
        orientation: resolveOrientation(data.orientation),
        color: resolveColor(data.color),
        size: resolveSize(data.size),
        radius: resolveRadius(data.radius),
        isDisabled: Boolean(data.isDisabled),
      });

      const classNames = data.classNames ?? {};
      const items = normalizeItems(data.items);
      const activeValue =
        data.value !== null && data.value !== undefined
          ? data.value
          : data._innerValue;

      return items.map((item) => {
        const itemDisabled = Boolean(data.isDisabled || item.isDisabled);
        const stateClassName = tabsTabState({
          color: resolveColor(data.color),
          isSelected: activeValue === item.value,
          isDisabled: itemDisabled,
        });

        return {
          ...item,
          token: toValueToken(item.value),
          tabClassName: slots.tab({
            class: [classNames.tab, stateClassName],
          }),
          tabLabelClassName: slots.tabLabel({ class: classNames.tabLabel }),
          isDisabled: itemDisabled,
        };
      });
    },
  },

  methods: {
    syncInnerValue() {
      if (this.data.value !== null && this.data.value !== undefined) {
        return;
      }

      const items = normalizeItems(this.data.items);
      const currentItem = findItemByValue(items, this.data._innerValue);

      if (currentItem && !currentItem.isDisabled) {
        return;
      }

      const preferredValue =
        this.data.defaultValue !== null && this.data.defaultValue !== undefined
          ? this.data.defaultValue
          : this.data._innerValue;
      const preferredItem = findItemByValue(items, preferredValue);
      const nextValue =
        preferredItem && !preferredItem.isDisabled
          ? preferredItem.value
          : resolveFallbackValue(items);

      if (nextValue !== this.data._innerValue) {
        this.setData({
          _innerValue: nextValue,
        });
      }
    },

    handleValueObserver() {
      const instance = this as typeof this & {
        _lastActiveToken?: string;
      };

      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      const nextToken =
        activeValue === null || activeValue === undefined
          ? ''
          : toValueToken(activeValue);

      const prevToken = instance._lastActiveToken ?? '';
      if (prevToken && nextToken && prevToken !== nextToken) {
        this.triggerTapSwitch();
      }

      instance._lastActiveToken = nextToken;
    },

    remeasureAndUpdateIndicator() {
      this.measureTabs(() => {
        this.updateIndicatorStyle();
      });
    },

    measureTabs(done?: () => void) {
      const query = this.createSelectorQuery();
      query.select('.sr-tabs__tabs-list').boundingClientRect();
      query.selectAll('.sr-tabs__tab-item').boundingClientRect();
      query.exec(
        (
          rects: Array<
            | WechatMiniprogram.BoundingClientRectCallbackResult
            | WechatMiniprogram.BoundingClientRectCallbackResult[]
            | null
          >,
        ) => {
          const listRect = rects[0] as
            | WechatMiniprogram.BoundingClientRectCallbackResult
            | null;
          const tabRects = Array.isArray(rects[1])
            ? (rects[1] as WechatMiniprogram.BoundingClientRectCallbackResult[])
            : [];

          if (!listRect) {
            this.setData(
              {
                _tabMetrics: [],
              },
              () => {
                done?.();
              },
            );
            return;
          }

          const items = normalizeItems(this.data.items);
          const metrics: TabMetric[] = [];

          tabRects.forEach((rect, index) => {
            const item = items[index];
            if (!item) {
              return;
            }

            metrics.push({
              token: toValueToken(item.value),
              left: Math.max(0, (rect.left ?? 0) - (listRect.left ?? 0)),
              top: Math.max(0, (rect.top ?? 0) - (listRect.top ?? 0)),
              width: rect.width ?? 0,
              height: rect.height ?? 0,
            });
          });

          this.setData(
            {
              _tabMetrics: metrics,
            },
            () => {
              done?.();
            },
          );
        },
      );
    },

    updateIndicatorStyle() {
      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;

      if (activeValue === null || activeValue === undefined) {
        if (this.data.indicatorStyle !== '') {
          this.setData({ indicatorStyle: '' });
        }
        return;
      }

      const token = toValueToken(activeValue);
      const metric = this.data._tabMetrics.find((item) => item.token === token);

      if (!metric) {
        if (this.data.indicatorStyle !== '') {
          this.setData({ indicatorStyle: '' });
        }
        return;
      }

      const scale = this.data._isTapSwitching ? TAP_SWITCH_SCALE : 1;
      const orientation = resolveOrientation(this.data.orientation);
      const indicatorStyle =
        orientation === 'y'
          ? `width:${metric.width}px;height:${metric.height}px;transform:translate3d(0,${metric.top}px,0) scaleY(${scale});`
          : `width:${metric.width}px;height:${metric.height}px;transform:translate3d(${metric.left}px,0,0) scaleX(${scale});`;

      if (indicatorStyle !== this.data.indicatorStyle) {
        this.setData({ indicatorStyle });
      }
    },

    triggerTapSwitch() {
      const instance = this as typeof this & {
        _tapSwitchTimer?: ReturnType<typeof setTimeout>;
      };

      if (instance._tapSwitchTimer) {
        clearTimeout(instance._tapSwitchTimer);
        instance._tapSwitchTimer = undefined;
      }

      this.setData(
        {
          _isTapSwitching: true,
        },
        () => {
          this.updateIndicatorStyle();
        },
      );

      instance._tapSwitchTimer = setTimeout(() => {
        this.setData(
          {
            _isTapSwitching: false,
          },
          () => {
            this.updateIndicatorStyle();
          },
        );
        instance._tapSwitchTimer = undefined;
      }, TAP_SWITCH_DURATION);
    },

    handleTabTap(e: WechatMiniprogram.BaseEvent) {
      const index = Number(e.currentTarget.dataset.index);
      if (Number.isNaN(index)) {
        return;
      }

      const items = normalizeItems(this.data.items);
      const item = items[index];
      if (!item) {
        return;
      }

      const itemDisabled = Boolean(this.data.isDisabled || item.isDisabled);
      if (itemDisabled) {
        return;
      }

      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      if (activeValue === item.value) {
        return;
      }

      this.triggerTapSwitch();

      if (this.data.value === null || this.data.value === undefined) {
        this.setData(
          {
            _innerValue: item.value,
          },
          () => {
            this.remeasureAndUpdateIndicator();
          },
        );
      } else {
        this.updateIndicatorStyle();
      }

      this.triggerEvent('change', {
        value: item.value,
      });
    },
  },
});

export { tabs } from '../style';
export type { TabsMiniProps } from './props';
export { tabsMiniProps } from './props';
