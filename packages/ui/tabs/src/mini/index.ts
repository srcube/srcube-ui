import { UIComponent } from '@srcube-ui/mini';
import { Virtualizer } from '@tanstack/virtual-core';
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
type ScrollSide = 'start' | 'end' | 'top' | 'bottom' | null;
type ScrollBehavior = 'auto' | 'smooth';

type RenderTab = {
  token: string;
  value: TabsMiniValue;
  label: string;
  index: number;
  isDisabled: boolean;
  tabClassName: string;
  tabLabelClassName: string;
  style: string;
};

type ScrollEventDetail = {
  scrollTop?: number;
  scrollLeft?: number;
};

type NestedScrollDetail = {
  detail?: ScrollEventDetail;
} & ScrollEventDetail;

type TabsMiniData = TabsMiniProps & {
  _innerValue: TabsMiniValue | null;
  _isTapSwitching: boolean;
  _isScrollControlled: boolean;
  viewportMainSize: number;
  viewportCrossSize: number;
  currentOffset: number;
  totalSize: number;
  tabsContentStyle: string;
  renderTabs: RenderTab[];
  indicatorStyle: string;
  _scrollTop: number;
  _scrollLeft: number;
  _scrollWithAnimation: boolean;
};

const TAP_SWITCH_DURATION = 120;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resolveEstimateSize({
  orientation,
  size,
  estimateSize,
}: {
  orientation: TabsOrientation;
  size: TabsSize;
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

function resolveCrossSize(size: TabsSize) {
  return CROSS_SIZE_BY_SIZE[size];
}

function resolveEdgeShift({
  orientation,
  size,
}: {
  orientation: TabsOrientation;
  size: TabsSize;
}) {
  return EDGE_SHIFT_BY_SIZE[orientation][size];
}

function resolveMaskBleedClassNames({
  orientation,
  size,
}: {
  orientation: TabsOrientation;
  size: TabsSize;
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

function resolveMaskVisibilityOverrideClasses(params: {
  orientation: TabsOrientation;
  currentOffset: number;
  totalSize: number;
  viewportMainSize: number;
}) {
  const { orientation, currentOffset, totalSize, viewportMainSize } = params;
  const maxOffset = Math.max(0, totalSize - viewportMainSize);
  const edgeEpsilon = Math.max(16, viewportMainSize * 0.08);
  const isNearStart = currentOffset <= edgeEpsilon;
  const isNearEnd = maxOffset <= edgeEpsilon || currentOffset >= maxOffset - edgeEpsilon;

  if (orientation === 'x') {
    return {
      maskLeft: isNearStart ? '!opacity-0' : '',
      maskRight: isNearEnd ? '!opacity-0' : '',
    };
  }

  return {
    maskTop: isNearStart ? '!opacity-0' : '',
    maskBottom: isNearEnd ? '!opacity-0' : '',
  };
}

function resolveScrollDetail(rawDetail: NestedScrollDetail | undefined | null) {
  if (!rawDetail) {
    return {
      scrollTop: 0,
      scrollLeft: 0,
    };
  }

  const detail = rawDetail.detail ?? rawDetail;
  return {
    scrollTop: Number(detail.scrollTop ?? 0),
    scrollLeft: Number(detail.scrollLeft ?? 0),
  };
}

function createVirtualizer(params: {
  count: number;
  estimateSize: number;
  overscan: number;
  isHorizontal: boolean;
  viewportMainSize: number;
  offset: number;
}) {
  const {
    count,
    estimateSize,
    overscan,
    isHorizontal,
    viewportMainSize,
    offset,
  } = params;

  return new Virtualizer<Element, Element>({
    count,
    getScrollElement: () => null,
    estimateSize: () => estimateSize,
    overscan,
    horizontal: isHorizontal,
    scrollToFn: () => {},
    observeElementRect: () => {},
    observeElementOffset: () => {},
    initialRect: isHorizontal
      ? { width: viewportMainSize, height: 0 }
      : { width: 0, height: viewportMainSize },
    initialOffset: offset,
  });
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
    _isScrollControlled: false,
    viewportMainSize: 0,
    viewportCrossSize: 0,
    currentOffset: 0,
    totalSize: 0,
    tabsContentStyle: '',
    renderTabs: [] as RenderTab[],
    indicatorStyle: '',
    _scrollTop: 0,
    _scrollLeft: 0,
    _scrollWithAnimation: false,
  } satisfies TabsMiniData,

  observers: {
    items() {
      this.syncInnerValue();
      this.remeasureAndRecompute();
    },
    value() {
      this.handleValueObserver();
      this.remeasureAndRecompute();
    },
    defaultValue() {
      this.syncInnerValue();
      this.remeasureAndRecompute();
    },
    orientation() {
      this.remeasureAndRecompute();
    },
    size() {
      this.remeasureAndRecompute();
    },
    radius() {
      this.remeasureAndRecompute();
    },
    color() {
      this.recomputeVirtualTabs();
    },
    isDisabled() {
      this.recomputeVirtualTabs();
    },
    estimateSize() {
      this.remeasureAndRecompute();
    },
    overscan() {
      this.recomputeVirtualTabs();
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
      this.remeasureAndRecompute();
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
        $scrollbox: slots.$scrollbox({ class: classNames.$scrollbox }),
        scrollbox: slots.scrollbox({ class: classNames.scrollbox }),
        scrollboxContent: slots.scrollboxContent({
          class: classNames.scrollboxContent,
        }),
        tabsList: slots.tabsList({ class: classNames.tabsList }),
        indicator: slots.indicator({ class: classNames.indicator }),
        tabLabel: slots.tabLabel({ class: classNames.tabLabel }),
        panels: slots.panels({ class: classNames.panels }),
      };
    },
    $scrollboxClassNames(data: TabsMiniData) {
      const orientation = resolveOrientation(data.orientation);
      const size = resolveSize(data.size);
      const slots = tabs({
        orientation,
        color: resolveColor(data.color),
        size,
        radius: resolveRadius(data.radius),
        isDisabled: Boolean(data.isDisabled),
      });
      const classNames = data.classNames ?? {};
      const maskClassNames = resolveMaskBleedClassNames({
        orientation,
        size,
      });
      const currentOffset = Math.max(0, Number(data.currentOffset) || 0);
      const totalSize = Math.max(0, Number(data.totalSize) || 0);
      const viewportMainSize = Math.max(0, Number(data.viewportMainSize) || 0);
      const maskVisibilityOverrideClasses = resolveMaskVisibilityOverrideClasses({
        orientation,
        currentOffset,
        totalSize,
        viewportMainSize,
      });

      return {
        content: slots.scrollboxContent({
          class: classNames.scrollboxContent,
        }),
        maskTop: [maskClassNames.maskTop, maskVisibilityOverrideClasses.maskTop]
          .filter(Boolean)
          .join(' '),
        maskBottom: [
          maskClassNames.maskBottom,
          maskVisibilityOverrideClasses.maskBottom,
        ]
          .filter(Boolean)
          .join(' '),
        maskLeft: [maskClassNames.maskLeft, maskVisibilityOverrideClasses.maskLeft]
          .filter(Boolean)
          .join(' '),
        maskRight: [
          maskClassNames.maskRight,
          maskVisibilityOverrideClasses.maskRight,
        ]
          .filter(Boolean)
          .join(' '),
      };
    },
  },

  methods: {
    resolveCurrentOffset(orientation: TabsOrientation) {
      const instance = this as typeof this & {
        _liveScrollTop?: number;
        _liveScrollLeft?: number;
      };

      const liveOffset =
        orientation === 'x' ? instance._liveScrollLeft : instance._liveScrollTop;
      return Math.max(0, Number(liveOffset ?? this.data.currentOffset) || 0);
    },

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

    remeasureAndRecompute() {
      const query = this.createSelectorQuery();
      query.select('.sr-tabs__scroll-host').boundingClientRect();
      query.exec(
        (
          rects: Array<WechatMiniprogram.BoundingClientRectCallbackResult | null>,
        ) => {
          const scrollRect = rects[0];
          if (!scrollRect) {
            return;
          }

          const orientation = resolveOrientation(this.data.orientation);
          const nextViewportMainSize =
            orientation === 'x'
              ? (scrollRect.width ?? 0)
              : (scrollRect.height ?? 0);
          const nextViewportCrossSize =
            orientation === 'x'
              ? (scrollRect.height ?? 0)
              : (scrollRect.width ?? 0);

          this.setData(
            {
              viewportMainSize: nextViewportMainSize,
              viewportCrossSize: nextViewportCrossSize,
            },
            () => {
              this.recomputeVirtualTabs();
              this.ensureActiveVisible(null, 'auto');
            },
          );
        },
      );
    },

    recomputeVirtualTabs() {
      const items = normalizeItems(this.data.items);
      if (items.length === 0) {
        this.setData(
          {
            totalSize: 0,
            tabsContentStyle: '',
            renderTabs: [],
            indicatorStyle: '',
          } satisfies Partial<TabsMiniData>,
        );
        return;
      }

      const orientation = resolveOrientation(this.data.orientation);
      const size = resolveSize(this.data.size);
      const color = resolveColor(this.data.color);
      const radius = resolveRadius(this.data.radius);
      const isHorizontal = orientation === 'x';
      const estimate = resolveEstimateSize({
        orientation,
        size,
        estimateSize: this.data.estimateSize,
      });
      const overscan = Math.max(1, Number(this.data.overscan) || 5);
      const offset = Math.max(0, Number(this.data.currentOffset) || 0);
      const viewportMainSize = Math.max(
        0,
        Number(this.data.viewportMainSize) || 0,
      );
      const viewportCrossSize = Math.max(
        0,
        Number(this.data.viewportCrossSize) || 0,
      );
      const crossSize = Math.max(1, viewportCrossSize || resolveCrossSize(size));

      const slots = tabs({
        orientation,
        color,
        size,
        radius,
        isDisabled: Boolean(this.data.isDisabled),
      });
      const classNames = this.data.classNames ?? {};

      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;

      const virtualizer = createVirtualizer({
        count: items.length,
        estimateSize: estimate,
        overscan,
        isHorizontal,
        viewportMainSize,
        offset,
      });

      const virtualItems = virtualizer.getVirtualItems();
      const hasVirtualItems = virtualItems.length > 0;
      const fallbackCount = Math.min(items.length, Math.max(1, overscan * 2 + 1));
      const fallbackStartIndex = clamp(
        Math.floor(offset / Math.max(1, estimate)) - overscan,
        0,
        Math.max(0, items.length - fallbackCount),
      );
      const fallbackItems = hasVirtualItems
        ? []
        : Array.from({ length: fallbackCount }, (_, index) => ({
            key: `fallback-${fallbackStartIndex + index}`,
            index: fallbackStartIndex + index,
            start: (fallbackStartIndex + index) * estimate,
            size: estimate,
          }));
      const renderSource = hasVirtualItems ? virtualItems : fallbackItems;
      const totalSize = virtualizer.getTotalSize();

      const renderTabs: RenderTab[] = renderSource
        .map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) {
            return null;
          }

          const itemDisabled = Boolean(this.data.isDisabled || item.isDisabled);
          const stateClassName = tabsTabState({
            color,
            isSelected: activeValue === item.value,
            isDisabled: itemDisabled,
          });

          const style = isHorizontal
            ? `position:absolute;left:0;top:0;width:${virtualItem.size}px;height:100%;transform:translate3d(${virtualItem.start}px,0,0);`
            : `position:absolute;left:0;top:0;width:100%;height:${virtualItem.size}px;transform:translate3d(0,${virtualItem.start}px,0);`;

          return {
            token: toValueToken(item.value),
            value: item.value,
            label: String(item.label ?? ''),
            index: virtualItem.index,
            isDisabled: itemDisabled,
            tabClassName: slots.tab({
              class: [classNames.tab, stateClassName],
            }),
            tabLabelClassName: slots.tabLabel({ class: classNames.tabLabel }),
            style,
          };
        })
        .filter((item): item is RenderTab => !!item);

      const tabsContentStyle = isHorizontal
        ? `position:relative;width:${totalSize}px;height:${crossSize}px;`
        : `position:relative;width:100%;height:${totalSize}px;`;

      this.setData(
        {
          totalSize,
          tabsContentStyle,
          renderTabs,
        } satisfies Partial<TabsMiniData>,
        () => {
          this.updateIndicatorStyle();
        },
      );
    },

    updateIndicatorStyle() {
      const items = normalizeItems(this.data.items);
      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      const activeIndex = items.findIndex((item) => item.value === activeValue);

      if (activeIndex < 0) {
        if (this.data.indicatorStyle !== '') {
          this.setData({ indicatorStyle: '' });
        }
        return;
      }

      const orientation = resolveOrientation(this.data.orientation);
      const size = resolveSize(this.data.size);
      const estimate = resolveEstimateSize({
        orientation,
        size,
        estimateSize: this.data.estimateSize,
      });
      const start = activeIndex * estimate;
      const indicatorStyle =
        orientation === 'y'
          ? `width:100%;height:${estimate}px;transform:translate3d(0,${start}px,0);`
          : `width:${estimate}px;height:100%;transform:translate3d(${start}px,0,0);`;

      if (indicatorStyle !== this.data.indicatorStyle) {
        this.setData({ indicatorStyle });
      }
    },

    resolveTapSide(tabIndex: number): ScrollSide {
      const orientation = resolveOrientation(this.data.orientation);
      const size = resolveSize(this.data.size);
      const estimate = resolveEstimateSize({
        orientation,
        size,
        estimateSize: this.data.estimateSize,
      });
      const viewportSize = Math.max(0, Number(this.data.viewportMainSize) || 0);

      if (viewportSize <= 0) {
        return null;
      }

      const itemCenter = tabIndex * estimate + estimate / 2;
      const relativeCenter =
        itemCenter - this.resolveCurrentOffset(orientation);

      if (orientation === 'x') {
        return relativeCenter < viewportSize / 2 ? 'start' : 'end';
      }

      return relativeCenter < viewportSize / 2 ? 'top' : 'bottom';
    },

    ensureActiveVisible(preferSide: ScrollSide = null, behavior: ScrollBehavior = 'auto') {
      const items = normalizeItems(this.data.items);
      const activeValue =
        this.data.value !== null && this.data.value !== undefined
          ? this.data.value
          : this.data._innerValue;
      const activeIndex = items.findIndex((item) => item.value === activeValue);
      if (activeIndex < 0) {
        return;
      }

      this.ensureTabVisible(activeIndex, preferSide, behavior);
    },

    ensureTabVisible(
      tabIndex: number,
      preferSide: ScrollSide = null,
      behavior: ScrollBehavior = 'smooth',
    ) {
      if (tabIndex < 0) {
        return;
      }

      const orientation = resolveOrientation(this.data.orientation);
      const size = resolveSize(this.data.size);
      const estimate = resolveEstimateSize({
        orientation,
        size,
        estimateSize: this.data.estimateSize,
      });
      const viewportSize = Math.max(0, Number(this.data.viewportMainSize) || 0);
      const totalSize = Math.max(0, Number(this.data.totalSize) || 0);

      if (viewportSize <= 0) {
        return;
      }

      const maxOffset = Math.max(0, totalSize - viewportSize);
      const edgeShift = resolveEdgeShift({ orientation, size });
      const itemStart = tabIndex * estimate;
      const itemEnd = itemStart + estimate;
      const visibleStart = this.resolveCurrentOffset(orientation);
      const visibleEnd = visibleStart + viewportSize;
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

      let target = visibleStart;
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

      if (Math.abs(target - visibleStart) < 1) {
        return;
      }

      this.applyScrollOffset(target, behavior);
    },

    applyScrollOffset(target: number, behavior: ScrollBehavior) {
      const orientation = resolveOrientation(this.data.orientation);
      const maxOffset = Math.max(
        0,
        Number(this.data.totalSize) - Number(this.data.viewportMainSize),
      );
      const nextOffset = clamp(target, 0, maxOffset);
      const currentOffset = this.resolveCurrentOffset(orientation);
      const instance = this as typeof this & {
        _liveScrollTop?: number;
        _liveScrollLeft?: number;
      };

      if (orientation === 'x') {
        instance._liveScrollLeft = nextOffset;
      } else {
        instance._liveScrollTop = nextOffset;
      }

      if (Math.abs(nextOffset - currentOffset) < 1) {
        return;
      }

      const axisKey = orientation === 'x' ? '_scrollLeft' : '_scrollTop';
      const withAnimation = behavior === 'smooth';

      this.setData({
        [axisKey]: nextOffset,
        _isScrollControlled: true,
        currentOffset: nextOffset,
        _scrollWithAnimation: withAnimation,
      } as unknown as Partial<TabsMiniData>);
    },

    releaseScrollControl() {
      if (!this.data._isScrollControlled && !this.data._scrollWithAnimation) {
        return;
      }

      this.setData({
        _isScrollControlled: false,
        _scrollWithAnimation: false,
      } as unknown as Partial<TabsMiniData>);
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

    handleScroll(e: WechatMiniprogram.CustomEvent<NestedScrollDetail>) {
      const orientation = resolveOrientation(this.data.orientation);
      const detail = resolveScrollDetail(e.detail);
      const nextOffset =
        orientation === 'x' ? detail.scrollLeft : detail.scrollTop;
      const instance = this as typeof this & {
        _liveScrollTop?: number;
        _liveScrollLeft?: number;
      };

      instance._liveScrollTop = detail.scrollTop;
      instance._liveScrollLeft = detail.scrollLeft;

      const nextData: Record<string, number | boolean> = {};
      let hasDataChange = false;
      let shouldRecompute = false;

      const prevOffset = Math.max(0, Number(this.data.currentOffset) || 0);
      if (Math.abs(prevOffset - nextOffset) >= 1) {
        nextData.currentOffset = nextOffset;
        hasDataChange = true;
        shouldRecompute = true;
      }

      if (!hasDataChange) {
        return;
      }

      this.setData(nextData as unknown as Partial<TabsMiniData>, () => {
        if (shouldRecompute) {
          this.recomputeVirtualTabs();
        }
      });
    },

    handleScrollEnd() {
      this.releaseScrollControl();
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
        this.ensureTabVisible(index, this.resolveTapSide(index), 'smooth');
        return;
      }

      const preferSide = this.resolveTapSide(index);
      this.triggerTapSwitch();

      if (this.data.value === null || this.data.value === undefined) {
        this.setData(
          {
            _innerValue: item.value,
          },
          () => {
            this.recomputeVirtualTabs();
            this.ensureTabVisible(index, preferSide, 'smooth');
          },
        );
      } else {
        this.ensureTabVisible(index, preferSide, 'smooth');
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
