import { UIComponent } from '../../shared/ui-component';
import {
  pickbox,
  pickboxItemState,
} from '@srcube-ui/styles/components/pickbox/style';
import type {
  PickboxMiniColumn,
  PickboxMiniItem,
  PickboxMiniItemId,
  PickboxMiniProps,
  PickboxMiniValue,
} from './props';
import { pickboxMiniProps } from './props';

type RenderItem = {
  id: PickboxMiniItemId;
  label: string;
  index: number;
  virtualKey: string;
  className: string;
  style: string;
};

type RenderColumn = {
  id: string;
  columnIndex: number;
  contentStyle: string;
  scrollTop: number;
  scrollWithAnimation: boolean;
  items: RenderItem[];
};

type PickboxMiniVirtualState = {
  containerHeight: number;
  resolvedPadding: number;
  resolvedEstimateSize: number;
  resolvedIndicatorHeight: number;
  innerValue: PickboxMiniValue;
  renderColumns: RenderColumn[];
};

type PickboxMiniData = PickboxMiniProps & PickboxMiniVirtualState;

type InternalColumnState = {
  hasInitialized: boolean;
  selectedIndex: number;
  anchorIndex: number;
  scrollTop: number;
  isTouching: boolean;
  startY: number;
  startScrollTop: number;
  lastTouchY: number;
  lastTouchAt: number;
  velocity: number;
  settleTimer: ReturnType<typeof setTimeout> | null;
  inertiaTimer: ReturnType<typeof setTimeout> | null;
  lastVibrateAt: number;
  lastSelectedId: PickboxMiniItemId | null | undefined;
  ignoreScrollUntil: number;
  pendingScrollTop: number | null;
};

type PickboxInternalState = {
  columns: InternalColumnState[];
};

type NestedScrollDetail = {
  detail?: {
    scrollTop?: number;
  };
  scrollTop?: number;
};

const internalStateMap = new WeakMap<object, PickboxInternalState>();

const VISIBLE_ROWS = 5;
const CENTER_OFFSET = Math.floor(VISIBLE_ROWS / 2);
const VIBRATE_GAP = 40;
const SCROLL_SETTLE_DELAY = 96;
const INERTIA_DECAY = 0.92;
const INERTIA_MIN_VELOCITY = 0.5;
const INERTIA_STEP_MS = 16;

function createColumnState(): InternalColumnState {
  return {
    hasInitialized: false,
    selectedIndex: 0,
    anchorIndex: 0,
    scrollTop: 0,
    isTouching: false,
    startY: 0,
    startScrollTop: 0,
    lastTouchY: 0,
    lastTouchAt: 0,
    velocity: 0,
    settleTimer: null,
    inertiaTimer: null,
    lastVibrateAt: 0,
    lastSelectedId: undefined,
    ignoreScrollUntil: 0,
    pendingScrollTop: null,
  };
}

function clearColumnTimers(columnState: InternalColumnState) {
  if (columnState.settleTimer) {
    clearTimeout(columnState.settleTimer);
    columnState.settleTimer = null;
  }
  if (columnState.inertiaTimer) {
    clearTimeout(columnState.inertiaTimer);
    columnState.inertiaTimer = null;
  }
}

function getInternalState(instance: object, columnCount: number) {
  const existing = internalStateMap.get(instance);
  if (!existing) {
    const next: PickboxInternalState = {
      columns: Array.from({ length: columnCount }, () => createColumnState()),
    };
    internalStateMap.set(instance, next);
    return next;
  }

  if (existing.columns.length > columnCount) {
    for (const columnState of existing.columns.slice(columnCount)) {
      clearColumnTimers(columnState);
    }
    existing.columns = existing.columns.slice(0, columnCount);
  } else if (existing.columns.length < columnCount) {
    existing.columns.push(
      ...Array.from({ length: columnCount - existing.columns.length }, () =>
        createColumnState(),
      ),
    );
  }

  return existing;
}

function cleanupInternalState(instance: object) {
  const current = internalStateMap.get(instance);
  if (!current) {
    return;
  }

  for (const columnState of current.columns) {
    clearColumnTimers(columnState);
  }

  internalStateMap.delete(instance);
}

function resolveColumns(rawColumns: unknown): PickboxMiniColumn[] {
  if (!Array.isArray(rawColumns)) {
    return [];
  }

  return rawColumns.map((column) => {
    if (
      !column ||
      typeof column !== 'object' ||
      !Array.isArray((column as PickboxMiniColumn).items)
    ) {
      return {
        items: [],
      };
    }

    const nextColumn = column as PickboxMiniColumn;

    return {
      id: nextColumn.id,
      items: nextColumn.items.map((item) => ({
        id: item?.id ?? '',
        label: String(item?.label ?? ''),
        isDisabled: item?.isDisabled === true,
      })),
    };
  });
}

function isArrayLikeValue(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isSamePickboxItemId(
  left: PickboxMiniItemId | null | undefined,
  right: PickboxMiniItemId | null | undefined,
) {
  if (left === right) {
    return true;
  }

  if (
    left === null ||
    left === undefined ||
    right === null ||
    right === undefined
  ) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return (
      Number.isFinite(leftNumber) &&
      Number.isFinite(rightNumber) &&
      leftNumber === rightNumber
    );
  }

  return false;
}

function getDefaultColumnValue(
  column: PickboxMiniColumn,
): PickboxMiniItemId | null {
  const firstEnabled = column.items.find((item) => !item.isDisabled);
  return firstEnabled?.id ?? column.items[0]?.id ?? null;
}

function normalizeColumnValue(
  column: PickboxMiniColumn,
  value: PickboxMiniItemId | null | undefined,
) {
  if (value === null || value === undefined) {
    return getDefaultColumnValue(column);
  }

  const matchedItem = column.items.find((item) =>
    isSamePickboxItemId(item.id, value),
  );
  if (matchedItem) {
    return matchedItem.id;
  }

  return getDefaultColumnValue(column);
}

function ensurePickboxValue(
  columns: PickboxMiniColumn[],
  input?: PickboxMiniValue | null,
): PickboxMiniValue {
  return columns.map((column, index) =>
    normalizeColumnValue(column, input?.[index]),
  );
}

function resolveSelectedIndex(
  items: PickboxMiniItem[],
  selectedId: PickboxMiniItemId | null,
) {
  if (items.length === 0) {
    return -1;
  }

  if (selectedId == null) {
    const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
  }

  const currentIndex = items.findIndex((item) =>
    isSamePickboxItemId(item.id, selectedId),
  );
  if (currentIndex >= 0) {
    return currentIndex;
  }

  const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
  return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(length - 1, index));
}

function resolveOffsetByIndex(index: number, estimateSize: number) {
  return -Math.max(0, index) * estimateSize;
}

function resolveScrollTopForIndex(index: number, estimateSize: number) {
  if (index < 0) {
    return 0;
  }
  return Math.max(0, Math.round(index * estimateSize));
}

function resolveIndexByScrollTop(
  scrollTop: number,
  estimateSize: number,
  length: number,
) {
  if (estimateSize <= 0) {
    return 0;
  }

  return clampIndex(Math.round(scrollTop / estimateSize), length);
}

function resolveDefaultMetricBySize(size: PickboxMiniProps['size']) {
  if (size === 'sm') {
    return 36;
  }

  if (size === 'lg') {
    return 52;
  }

  return 44;
}

function resolveTone(value?: string | null) {
  return value === 'dark' ? 'dark' : 'default';
}

function resolveMetricValue(value: unknown, fallback: number) {
  const next = Number(value);
  if (Number.isFinite(next) && next > 0) {
    return next;
  }
  return fallback;
}

function resolvePickboxMetrics(data: PickboxMiniData) {
  const fallback = resolveDefaultMetricBySize(data.size);
  const estimateSize = resolveMetricValue(data.estimateSize, fallback);
  const indicatorHeight = resolveMetricValue(
    data.indicatorHeight,
    estimateSize,
  );

  return {
    estimateSize,
    indicatorHeight,
  };
}

function resolveDefaultContainerHeightBySize(size: PickboxMiniProps['size']) {
  if (size === 'sm') {
    return 224;
  }

  if (size === 'lg') {
    return 288;
  }

  return 256;
}

function maybeVibrate(columnState: InternalColumnState) {
  const now = Date.now();
  if (now - columnState.lastVibrateAt < VIBRATE_GAP) {
    return;
  }

  columnState.lastVibrateAt = now;
  try {
    wx.vibrateShort({ type: 'light' });
  } catch {
    // ignore vibration failures
  }
}

function resolveNearestEnabledIndex(
  column: PickboxMiniColumn,
  targetIndex: number,
) {
  if (column.items.length === 0) {
    return -1;
  }

  const safeIndex = clampIndex(targetIndex, column.items.length);
  if (!column.items[safeIndex]?.isDisabled) {
    return safeIndex;
  }

  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  column.items.forEach((item, index) => {
    if (item.isDisabled) {
      return;
    }

    const distance = Math.abs(index - safeIndex);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex >= 0 ? bestIndex : safeIndex;
}

function resolveWindowRange(params: {
  itemCount: number;
  anchorIndex: number;
  visibleCount: number;
  overscan: number;
}) {
  const { itemCount, anchorIndex, visibleCount, overscan } = params;

  if (itemCount <= 0) {
    return {
      startIndex: 0,
      endIndex: -1,
    };
  }

  const lead = Math.max(CENTER_OFFSET + 1, overscan);
  const trail = Math.max(visibleCount + CENTER_OFFSET + 1, overscan + visibleCount);
  const startIndex = Math.max(0, anchorIndex - lead);
  const endIndex = Math.min(itemCount - 1, anchorIndex + trail);

  return {
    startIndex,
    endIndex,
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    pickboxMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    containerHeight: 0,
    resolvedPadding: 0,
    resolvedEstimateSize: 44,
    resolvedIndicatorHeight: 44,
    innerValue: [] as PickboxMiniValue,
    renderColumns: [] as RenderColumn[],
  } satisfies PickboxMiniVirtualState,

  observers: {
    columns() {
      this.syncInnerValueByColumns();
      this.recomputeVirtualColumns();
    },
    value() {
      this.recomputeVirtualColumns();
    },
    defaultValue() {
      this.syncInnerValueByColumns();
      this.recomputeVirtualColumns();
    },
    estimateSize() {
      this.recomputeVirtualColumns();
    },
    overscan() {
      this.recomputeVirtualColumns();
    },
    size() {
      this.remeasureAndRecompute();
    },
    color() {
      this.recomputeVirtualColumns();
    },
    indicatorHeight() {
      this.remeasureAndRecompute();
    },
  },

  lifetimes: {
    attached() {
      const columns = resolveColumns(this.data.columns);
      getInternalState(this, columns.length);
      this.syncInnerValueByColumns();
    },
    ready() {
      this.remeasureAndRecompute();
      this.scheduleDeferredMeasure();
    },
    detached() {
      if (this._measureTimer) {
        clearTimeout(this._measureTimer);
        this._measureTimer = null;
      }
      if (this._settleMeasureTimer) {
        clearTimeout(this._settleMeasureTimer);
        this._settleMeasureTimer = null;
      }
      cleanupInternalState(this);
    },
  },

  computed: {
    $classNames(data: PickboxMiniData) {
      const slots = pickbox({
        size: data.size ?? 'md',
        color: data.color ?? 'default',
        tone: resolveTone(data.tone),
      });
      const classNames = data.classNames ?? {};
      const baseClassName = [classNames.base, data.className]
        .filter((value): value is string => Boolean(value))
        .join(' ');

      return {
        base: slots.base({ class: baseClassName }),
        columns: slots.columns({ class: classNames.columns }),
        column: slots.column({ class: classNames.column }),
        columnScroll: slots.columnScroll({ class: classNames.columnScroll }),
        columnContent: slots.columnContent({ class: classNames.columnContent }),
        item: slots.item({ class: classNames.item }),
        itemLabel: slots.itemLabel({ class: classNames.itemLabel }),
        indicator: slots.indicator({ class: classNames.indicator }),
        maskTop: slots.maskTop({ class: classNames.maskTop }),
        maskBottom: slots.maskBottom({ class: classNames.maskBottom }),
      };
    },
  },

  methods: {
    refreshLayout() {
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);

      internalState.columns.forEach((columnState) => {
        clearColumnTimers(columnState);
        Object.assign(columnState, createColumnState());
      });

      this.remeasureAndRecompute();
      this.scheduleDeferredMeasure();
    },

    scheduleDeferredMeasure() {
      if (this._measureTimer) {
        clearTimeout(this._measureTimer);
      }
      if (this._settleMeasureTimer) {
        clearTimeout(this._settleMeasureTimer);
      }

      this._measureTimer = setTimeout(() => {
        this.remeasureAndRecompute();
        this._measureTimer = null;
      }, 0);

      this._settleMeasureTimer = setTimeout(() => {
        this.remeasureAndRecompute();
        this._settleMeasureTimer = null;
      }, 120);
    },

    syncInnerValueByColumns() {
      if (isArrayLikeValue(this.data.value)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const nextValue = ensurePickboxValue(
        columns,
        isArrayLikeValue(this.data.defaultValue)
          ? (this.data.defaultValue as PickboxMiniValue)
          : this.data.innerValue,
      );

      this.setData({
        innerValue: nextValue,
      } satisfies Partial<PickboxMiniVirtualState>);
    },

    remeasureAndRecompute() {
      const query = this.createSelectorQuery();
      query.select('.sr-pickbox').boundingClientRect();
      query.exec(
        (
          rects: Array<WechatMiniprogram.BoundingClientRectCallbackResult | null>,
        ) => {
          const rect = rects[0];
          const measuredHeight = Math.max(0, Number(rect?.height ?? 0));
          const { estimateSize, indicatorHeight } = resolvePickboxMetrics(
            this.data,
          );
          const fallbackHeight = resolveDefaultContainerHeightBySize(
            this.data.size,
          );
          const containerHeight =
            measuredHeight > 0
              ? measuredHeight
              : Math.max(fallbackHeight, estimateSize * VISIBLE_ROWS);
          const resolvedPadding = Math.max(
            0,
            containerHeight / 2 - indicatorHeight / 2,
          );

          this.setData(
            {
              containerHeight,
              resolvedPadding,
              resolvedEstimateSize: estimateSize,
              resolvedIndicatorHeight: indicatorHeight,
            } satisfies Partial<PickboxMiniVirtualState>,
            () => {
              this.recomputeVirtualColumns();
            },
          );
        },
      );
    },

    recomputeVirtualColumns() {
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const { estimateSize, indicatorHeight } = resolvePickboxMetrics(
        this.data,
      );
      const fallbackHeight = resolveDefaultContainerHeightBySize(
        this.data.size,
      );
      const containerHeight = Math.max(
        1,
        Number(this.data.containerHeight) ||
          Math.max(fallbackHeight, estimateSize * VISIBLE_ROWS),
      );
      const resolvedPadding = Math.max(
        0,
        Number(this.data.resolvedPadding) ||
          containerHeight / 2 - indicatorHeight / 2,
      );
      const visibleCount = Math.max(1, Math.ceil(containerHeight / estimateSize));
      const overscan = Math.max(2, Number(this.data.overscan) || 0);
      const mergedValue = ensurePickboxValue(
        columns,
        isArrayLikeValue(this.data.value)
          ? (this.data.value as PickboxMiniValue)
          : this.data.innerValue,
      );

      const renderColumns = columns.map((column, columnIndex) => {
        const columnState = internalState.columns[columnIndex] ?? createColumnState();
        const selectedId = mergedValue[columnIndex] ?? null;
        const selectedIndex = resolveSelectedIndex(column.items, selectedId);
        const normalizedSelectedIndex = Math.max(0, selectedIndex);
        const stableSelectedId =
          normalizedSelectedIndex >= 0
            ? (column.items[normalizedSelectedIndex]?.id ?? null)
            : null;

        if (
          !columnState.hasInitialized ||
          (!columnState.isTouching &&
            !isSamePickboxItemId(columnState.lastSelectedId, stableSelectedId))
        ) {
          const targetScrollTop = resolveScrollTopForIndex(
            normalizedSelectedIndex,
            estimateSize,
          );
          columnState.selectedIndex = normalizedSelectedIndex;
          columnState.anchorIndex = normalizedSelectedIndex;
          columnState.scrollTop = targetScrollTop;
          columnState.hasInitialized = true;
        } else {
          columnState.anchorIndex = resolveIndexByScrollTop(
            columnState.scrollTop,
            estimateSize,
            column.items.length,
          );
        }

        columnState.lastSelectedId = stableSelectedId;

        const { startIndex, endIndex } = resolveWindowRange({
          itemCount: column.items.length,
          anchorIndex: columnState.anchorIndex,
          visibleCount,
          overscan,
        });

        const items =
          endIndex >= startIndex
            ? column.items
                .slice(startIndex, endIndex + 1)
                .map((item, relativeIndex) => {
                  const itemIndex = startIndex + relativeIndex;
                  const isSelected = itemIndex === columnState.anchorIndex;
                  const stateClassName = pickboxItemState({
                    color: this.data.color ?? 'default',
                    tone: resolveTone(this.data.tone),
                    size: this.data.size ?? 'md',
                    isSelected,
                    isDisabled: item.isDisabled === true,
                  });

                  return {
                    id: item.id,
                    label: item.label,
                    index: itemIndex,
                    virtualKey: `${String(item.id)}-${itemIndex}`,
                    className: stateClassName,
                    style: `position:absolute;left:0;top:${resolvedPadding + itemIndex * estimateSize}px;width:100%;height:${estimateSize}px;`,
                  } satisfies RenderItem;
                })
            : [];

        const totalSize = resolvedPadding * 2 + column.items.length * estimateSize;

        const renderScrollTop = Math.max(
          0,
          Math.round(columnState.pendingScrollTop ?? columnState.scrollTop),
        );
        columnState.pendingScrollTop = null;

        return {
          id: String(column.id ?? columnIndex),
          columnIndex,
          contentStyle: `position:relative;width:100%;height:${totalSize}px;`,
          scrollTop: renderScrollTop,
          scrollWithAnimation: !columnState.isTouching,
          items,
        } satisfies RenderColumn;
      });

      this.setData({
        renderColumns,
        resolvedEstimateSize: estimateSize,
        resolvedIndicatorHeight: indicatorHeight,
      } satisfies Partial<PickboxMiniVirtualState>);
    },

    commitColumnIndex(
      columnIndex: number,
      nextIndex: number,
      reason: 'touchmove' | 'touchend' | 'inertia-end',
    ) {
      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      if (!column || column.items.length === 0) {
        return;
      }

      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      const estimateSize =
        this.data.resolvedEstimateSize ||
        resolvePickboxMetrics(this.data).estimateSize;
      const resolvedIndex = resolveNearestEnabledIndex(column, nextIndex);
      const nextItem = column.items[resolvedIndex];
      if (!nextItem) {
        return;
      }

      const mergedValue = ensurePickboxValue(
        columns,
        isArrayLikeValue(this.data.value)
          ? (this.data.value as PickboxMiniValue)
          : this.data.innerValue,
      );
      const prevValue = mergedValue[columnIndex] ?? null;
      const nextValue = [...mergedValue];
      nextValue[columnIndex] = nextItem.id;

      const targetScrollTop = resolveScrollTopForIndex(resolvedIndex, estimateSize);
      columnState.selectedIndex = resolvedIndex;
      columnState.anchorIndex = resolvedIndex;
      columnState.scrollTop = targetScrollTop;
      columnState.pendingScrollTop = targetScrollTop;
      columnState.ignoreScrollUntil = Date.now() + 80;

      const applyData = () => {
        this.recomputeVirtualColumns();
      };

      if (!isArrayLikeValue(this.data.value)) {
        this.setData(
          {
            innerValue: nextValue,
          } satisfies Partial<PickboxMiniVirtualState>,
          applyData,
        );
      } else {
        applyData();
      }

      if (!isSamePickboxItemId(prevValue, nextItem.id)) {
        maybeVibrate(columnState);
      }

      if (
        reason === 'touchmove' ||
        !isSamePickboxItemId(prevValue, nextItem.id)
      ) {
        this.triggerEvent('valuechange', {
          value: nextValue,
          columnIndex,
          itemId: nextItem.id,
        });
      }
    },

    settleColumn(columnIndex: number, reason: 'touchend' | 'inertia-end') {
      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      if (!column || column.items.length === 0) {
        return;
      }

      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      const estimateSize =
        this.data.resolvedEstimateSize ||
        resolvePickboxMetrics(this.data).estimateSize;
      const anchorIndex = resolveIndexByScrollTop(
        columnState.scrollTop,
        estimateSize,
        column.items.length,
      );

      this.commitColumnIndex(columnIndex, anchorIndex, reason);
    },

    scheduleSettle(columnIndex: number, reason: 'touchend' | 'inertia-end') {
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      if (columnState.settleTimer) {
        clearTimeout(columnState.settleTimer);
      }

      const delay = Math.max(48, Number(this.data.scrollEndDelay) || SCROLL_SETTLE_DELAY);
      columnState.settleTimer = setTimeout(() => {
        columnState.settleTimer = null;
        this.settleColumn(columnIndex, reason);
      }, delay);
    },

    startColumnInertia(columnIndex: number, initialVelocity: number) {
      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      if (!column || column.items.length === 0) {
        return;
      }

      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      const estimateSize =
        this.data.resolvedEstimateSize ||
        resolvePickboxMetrics(this.data).estimateSize;
      const maxScrollTop = Math.max(0, (column.items.length - 1) * estimateSize);

      clearColumnTimers(columnState);

      const tick = (velocity: number) => {
        const nextScrollTop = Math.max(
          0,
          Math.min(maxScrollTop, columnState.scrollTop - velocity),
        );
        const previousAnchor = columnState.anchorIndex;
        columnState.scrollTop = nextScrollTop;
        columnState.anchorIndex = resolveIndexByScrollTop(
          nextScrollTop,
          estimateSize,
          column.items.length,
        );

        if (columnState.anchorIndex !== previousAnchor) {
          this.commitColumnIndex(columnIndex, columnState.anchorIndex, 'touchmove');
        } else {
          this.recomputeVirtualColumns();
        }

        const nextVelocity = velocity * INERTIA_DECAY;
        if (
          Math.abs(nextVelocity) < INERTIA_MIN_VELOCITY ||
          nextScrollTop <= 0 ||
          nextScrollTop >= maxScrollTop
        ) {
          columnState.inertiaTimer = null;
          this.scheduleSettle(columnIndex, 'inertia-end');
          return;
        }

        columnState.inertiaTimer = setTimeout(() => tick(nextVelocity), INERTIA_STEP_MS);
      };

      columnState.inertiaTimer = setTimeout(
        () => tick(initialVelocity),
        INERTIA_STEP_MS,
      );
    },

    handleColumnTouchStart(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const touch =
        e.touches?.[0] ?? ({ clientY: 0 } as WechatMiniprogram.Touch);
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      clearColumnTimers(columnState);
      columnState.isTouching = true;
      columnState.pendingScrollTop = null;
      columnState.startY = touch.clientY;
      columnState.startScrollTop = columnState.scrollTop;
      columnState.lastTouchY = touch.clientY;
      columnState.lastTouchAt = Date.now();
      columnState.velocity = 0;
    },

    handleColumnTouchMove(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const touch = e.touches?.[0];
      if (!touch) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!column || !columnState || !columnState.isTouching) {
        return;
      }

      const estimateSize =
        this.data.resolvedEstimateSize ||
        resolvePickboxMetrics(this.data).estimateSize;
      const maxScrollTop = Math.max(0, (column.items.length - 1) * estimateSize);
      const deltaY = touch.clientY - columnState.startY;
      const nextScrollTop = Math.max(
        0,
        Math.min(maxScrollTop, columnState.startScrollTop - deltaY),
      );
      const previousAnchor = columnState.anchorIndex;
      const now = Date.now();
      const deltaMoveY = touch.clientY - columnState.lastTouchY;
      const deltaMoveAt = Math.max(1, now - columnState.lastTouchAt);

      columnState.scrollTop = nextScrollTop;
      columnState.anchorIndex = resolveIndexByScrollTop(
        nextScrollTop,
        estimateSize,
        column.items.length,
      );
      columnState.velocity = (deltaMoveY / deltaMoveAt) * 16;
      columnState.lastTouchY = touch.clientY;
      columnState.lastTouchAt = now;

      if (columnState.anchorIndex !== previousAnchor) {
        this.commitColumnIndex(columnIndex, columnState.anchorIndex, 'touchmove');
      } else {
        this.recomputeVirtualColumns();
      }
    },

    handleColumnTouchEnd(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState || !columnState.isTouching) {
        return;
      }

      columnState.isTouching = false;
      const releaseVelocity = columnState.velocity;
      if (Math.abs(releaseVelocity) >= 1) {
        this.startColumnInertia(columnIndex, releaseVelocity);
        return;
      }

      this.scheduleSettle(columnIndex, 'touchend');
    },

    handleColumnTouchCancel(e: WechatMiniprogram.TouchEvent) {
      this.handleColumnTouchEnd(e);
    },

    selectColumnItem(
      columnIndex: number,
      itemId: PickboxMiniItemId,
      behavior: 'auto' | 'smooth' = 'smooth',
    ) {
      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      if (!column) {
        return;
      }

      const itemIndex = column.items.findIndex((item) =>
        isSamePickboxItemId(item.id, itemId),
      );
      if (itemIndex < 0) {
        return;
      }

      this.commitColumnIndex(
        columnIndex,
        itemIndex,
        behavior === 'smooth' ? 'touchend' : 'inertia-end',
      );
    },

    handleColumnDragStart() {
      // touch-driven implementation: keep method for template compatibility
    },

    handleColumnDragging() {
      // touch-driven implementation: keep method for template compatibility
    },

    handleColumnDragEnd() {
      // touch-driven implementation: keep method for template compatibility
    },

    handleColumnScroll(e: WechatMiniprogram.CustomEvent<NestedScrollDetail>) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const column = columns[columnIndex];
      const columnState = getInternalState(this, columns.length).columns[columnIndex];
      if (!column || !columnState) {
        return;
      }

      if (Date.now() < columnState.ignoreScrollUntil) {
        return;
      }

      const detail = e.detail?.detail ?? e.detail;
      if (!columnState.isTouching && !columnState.hasInitialized) {
        return;
      }
      const nextScrollTop = Math.max(0, Number(detail?.scrollTop ?? 0));
      const estimateSize =
        this.data.resolvedEstimateSize ||
        resolvePickboxMetrics(this.data).estimateSize;
      const previousAnchor = columnState.anchorIndex;

      columnState.pendingScrollTop = null;
      columnState.scrollTop = nextScrollTop;
      columnState.anchorIndex = resolveIndexByScrollTop(
        nextScrollTop,
        estimateSize,
        column.items.length,
      );

      if (columnState.anchorIndex !== previousAnchor) {
        this.commitColumnIndex(columnIndex, columnState.anchorIndex, 'touchmove');
        return;
      }

      this.recomputeVirtualColumns();
    },
  },
});

export {
  pickbox,
  pickboxItemState,
} from '@srcube-ui/styles/components/pickbox/style';
export type {
  PickboxMiniColumn,
  PickboxMiniItem,
  PickboxMiniItemId,
  PickboxMiniProps,
  PickboxMiniValue,
} from './props';
export { pickboxMiniProps } from './props';
