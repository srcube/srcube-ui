import { UIComponent } from '../../shared/ui-component';
import { pickbox, pickboxItemState } from '@srcube-ui/styles/components/pickbox/style';
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
type PickboxScrollBehavior = 'auto' | 'smooth';

type NestedScrollDetail = {
  detail?: {
    scrollTop?: number;
  };
  scrollTop?: number;
};

type NestedDragDetail = {
  detail?: {
    scrollTop?: number;
    scrollLeft?: number;
    velocity?: number;
  };
  scrollTop?: number;
  scrollLeft?: number;
  velocity?: number;
};

type InternalColumnState = {
  hasInitialized: boolean;
  hasUserInteracted: boolean;
  lastTouchAt: number;
  currentOffset: number;
  controlledOffset: number;
  lastSelectedId: PickboxMiniItemId | null | undefined;
  isScrolling: boolean;
  isAutoAdjusting: boolean;
  alignPhase: 'idle' | 'prepare' | 'running';
  pendingAlignOffset: number | null;
  pendingScrollWithAnimation: boolean;
  ignoreScrollEventsUntil: number;
  lastScrollAt: number;
  isTouching: boolean;
  scrollStopTimer: ReturnType<typeof setTimeout> | null;
  autoAdjustTimer: ReturnType<typeof setTimeout> | null;
};

type PickboxInternalState = {
  columns: InternalColumnState[];
};

const internalStateMap = new WeakMap<object, PickboxInternalState>();

function createColumnState(): InternalColumnState {
  return {
    hasInitialized: false,
    hasUserInteracted: false,
    lastTouchAt: 0,
    currentOffset: 0,
    controlledOffset: 0,
    lastSelectedId: undefined,
    isScrolling: false,
    isAutoAdjusting: false,
    alignPhase: 'idle',
    pendingAlignOffset: null,
    pendingScrollWithAnimation: false,
    ignoreScrollEventsUntil: 0,
    lastScrollAt: 0,
    isTouching: false,
    scrollStopTimer: null,
    autoAdjustTimer: null,
  };
}

function clearColumnTimers(columnState: InternalColumnState) {
  if (columnState.scrollStopTimer) {
    clearTimeout(columnState.scrollStopTimer);
    columnState.scrollStopTimer = null;
  }

  if (columnState.autoAdjustTimer) {
    clearTimeout(columnState.autoAdjustTimer);
    columnState.autoAdjustTimer = null;
  }
}

function cancelColumnAutoAdjust(columnState: InternalColumnState) {
  if (columnState.autoAdjustTimer) {
    clearTimeout(columnState.autoAdjustTimer);
    columnState.autoAdjustTimer = null;
  }

  columnState.isScrolling = false;
  columnState.isAutoAdjusting = false;
  columnState.controlledOffset = columnState.currentOffset;
  columnState.pendingAlignOffset = null;
  columnState.pendingScrollWithAnimation = false;
  columnState.alignPhase = 'idle';
  columnState.ignoreScrollEventsUntil = 0;
}

function isPassiveRollbackToStart(
  columnState: InternalColumnState,
  nextOffset: number,
) {
  const rollbackTolerance = 2;
  const controlledOffset = Math.max(0, columnState.controlledOffset);
  return nextOffset <= rollbackTolerance && controlledOffset > rollbackTolerance;
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

  if (left === null || left === undefined || right === null || right === undefined) {
    return false;
  }

  if (
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number')
  ) {
    const leftNumber = Number(left);
    const rightNumber = Number(right);
    return Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber === rightNumber;
  }

  return false;
}

function getDefaultColumnValue(column: PickboxMiniColumn): PickboxMiniItemId | null {
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

  const matchedItem = column.items.find((item) => isSamePickboxItemId(item.id, value));
  if (matchedItem) {
    return matchedItem.id;
  }

  return getDefaultColumnValue(column);
}

function ensurePickboxValue(
  columns: PickboxMiniColumn[],
  input?: PickboxMiniValue | null,
): PickboxMiniValue {
  return columns.map((column, index) => normalizeColumnValue(column, input?.[index]));
}

function resolveSelectedIndex(items: PickboxMiniItem[], selectedId: PickboxMiniItemId | null) {
  if (items.length === 0) {
    return -1;
  }

  if (selectedId == null) {
    const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
  }

  const currentIndex = items.findIndex((item) => isSamePickboxItemId(item.id, selectedId));
  if (currentIndex >= 0) {
    return currentIndex;
  }

  const firstEnabledIndex = items.findIndex((item) => !item.isDisabled);
  return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
}

function resolveScrollTopForIndex(params: {
  index: number;
  estimateSize: number;
  resolvedPadding: number;
  containerHeight: number;
}) {
  const { index, estimateSize, resolvedPadding, containerHeight } = params;
  if (index < 0) {
    return 0;
  }

  const itemCenter = resolvedPadding + index * estimateSize + estimateSize / 2;
  const viewportCenter = containerHeight / 2;
  return Math.max(0, itemCenter - viewportCenter);
}

function resolveScrollDetail(detail: NestedScrollDetail | undefined | null) {
  if (!detail) {
    return { scrollTop: 0 };
  }

  const payload = detail.detail ?? detail;
  return {
    scrollTop: Number(payload.scrollTop ?? 0),
  };
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
  const indicatorHeight = resolveMetricValue(data.indicatorHeight, estimateSize);

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
        cancelColumnAutoAdjust(columnState);
        columnState.hasInitialized = false;
        columnState.hasUserInteracted = false;
        columnState.lastTouchAt = 0;
        columnState.currentOffset = 0;
        columnState.controlledOffset = 0;
        columnState.lastSelectedId = undefined;
        columnState.ignoreScrollEventsUntil = 0;
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

      // Drawer mount/animation can delay final layout; remeasure twice to lock center.
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
          const fallbackHeight = resolveDefaultContainerHeightBySize(this.data.size);
          const containerHeight =
            measuredHeight > 0
              ? measuredHeight
              : Math.max(fallbackHeight, estimateSize, indicatorHeight);
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
      const fallbackHeight = resolveDefaultContainerHeightBySize(this.data.size);
      const containerHeight = Math.max(
        1,
        Number(this.data.containerHeight) ||
          Math.max(fallbackHeight, estimateSize, indicatorHeight),
      );
      const resolvedPadding = Math.max(
        0,
        Number(this.data.resolvedPadding) || containerHeight / 2 - indicatorHeight / 2,
      );

      const mergedValue = ensurePickboxValue(
        columns,
        isArrayLikeValue(this.data.value)
          ? (this.data.value as PickboxMiniValue)
          : this.data.innerValue,
      );

      const renderColumns = columns.map((column, columnIndex) => {
        const columnState = internalState.columns[columnIndex] ?? createColumnState();
        const propSelectedItemId = mergedValue[columnIndex] ?? null;
        const selectedItemId =
          columnState.isAutoAdjusting &&
          columnState.lastSelectedId !== undefined
            ? (columnState.lastSelectedId ?? null)
            : propSelectedItemId;
        const selectedIndex = resolveSelectedIndex(column.items, selectedItemId);
        const selectedId = selectedItemId;

        const shouldAlignSelected =
          !columnState.hasInitialized ||
          (columnState.lastSelectedId !== selectedItemId &&
            !columnState.isAutoAdjusting &&
            columnState.pendingAlignOffset === null);

        if (shouldAlignSelected) {
          const targetOffset = resolveScrollTopForIndex({
            index: selectedIndex,
            estimateSize,
            resolvedPadding,
            containerHeight,
          });

          // Keep controlled/open-sync alignment immediate to avoid reopen replay.
          columnState.currentOffset = targetOffset;
          columnState.controlledOffset = targetOffset;
          columnState.pendingAlignOffset = null;
          columnState.pendingScrollWithAnimation = false;
          columnState.alignPhase = 'idle';
          columnState.isScrolling = false;
          columnState.isAutoAdjusting = false;
          columnState.ignoreScrollEventsUntil = Date.now() + 80;
          columnState.hasInitialized = true;
        }

        columnState.lastSelectedId = selectedItemId;

        const totalSize =
          Math.max(0, resolvedPadding * 2) + column.items.length * estimateSize;

        const renderItems = column.items.map((item, itemIndex) => {
          const isSelected = selectedId === item.id;
          const isDisabled = item.isDisabled === true;
          const stateClassName = pickboxItemState({
            color: this.data.color ?? 'default',
            tone: resolveTone(this.data.tone),
            size: this.data.size ?? 'md',
            isSelected,
            isDisabled,
          });
          const start = resolvedPadding + itemIndex * estimateSize;

          return {
            id: item.id,
            label: item.label,
            index: itemIndex,
            virtualKey: `${String(item.id)}-${itemIndex}`,
            className: stateClassName,
            style: `position:absolute;left:0;top:${start}px;width:100%;height:${estimateSize}px;`,
          };
        });

        const contentStyle = `position:relative;width:100%;height:${totalSize}px;`;
        const hasPendingAlign = columnState.pendingAlignOffset !== null;

        return {
          id: String(column.id ?? columnIndex),
          columnIndex,
          contentStyle,
          scrollTop: Math.max(
            0,
            hasPendingAlign
              ? (columnState.pendingAlignOffset ?? columnState.currentOffset)
              : columnState.isScrolling
                ? columnState.currentOffset
                : columnState.controlledOffset,
          ),
          scrollWithAnimation: hasPendingAlign
            ? columnState.pendingScrollWithAnimation
            : false,
          items: renderItems,
        };
      });

      this.setData({
        renderColumns,
        resolvedEstimateSize: estimateSize,
        resolvedIndicatorHeight: indicatorHeight,
      } satisfies Partial<PickboxMiniVirtualState>);

      const autoAdjustDuration = Math.max(
        220,
        Number(this.data.scrollEndDelay) || 120,
      );

      internalState.columns.forEach((columnState) => {
        if (!columnState.isAutoAdjusting) {
          return;
        }

        if (columnState.autoAdjustTimer) {
          clearTimeout(columnState.autoAdjustTimer);
        }

        columnState.autoAdjustTimer = setTimeout(() => {
          columnState.isAutoAdjusting = false;
          if (columnState.pendingAlignOffset !== null) {
            columnState.currentOffset = columnState.pendingAlignOffset;
            columnState.controlledOffset = columnState.pendingAlignOffset;
            columnState.pendingAlignOffset = null;
            columnState.pendingScrollWithAnimation = false;
            columnState.alignPhase = 'idle';
          }

          if (columnState.isScrolling) {
            columnState.isScrolling = false;
          }

          this.recomputeVirtualColumns();
        }, autoAdjustDuration);
      });
    },

    handleColumnTouchStart(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      cancelColumnAutoAdjust(columnState);
      columnState.isTouching = true;
      columnState.lastTouchAt = Date.now();
      columnState.ignoreScrollEventsUntil = 0;
    },

    handleColumnTouchMove(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      if (!columnState.hasUserInteracted) {
        columnState.hasUserInteracted = true;
      }
      columnState.lastTouchAt = Date.now();
    },

    handleColumnTouchEnd(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      columnState.isTouching = false;
      columnState.lastTouchAt = Date.now();
    },

    handleColumnTouchCancel(e: WechatMiniprogram.TouchEvent) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      columnState.isTouching = false;
      columnState.lastTouchAt = Date.now();
    },

    handleColumnDragStart(e: WechatMiniprogram.CustomEvent<NestedDragDetail>) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      cancelColumnAutoAdjust(columnState);
      columnState.isTouching = true;
      columnState.hasUserInteracted = true;
      columnState.lastTouchAt = Date.now();
      columnState.ignoreScrollEventsUntil = 0;
      const detail = resolveScrollDetail(e.detail);
      columnState.currentOffset = Math.max(0, detail.scrollTop);
      columnState.controlledOffset = columnState.currentOffset;
      columnState.lastScrollAt = Date.now();
    },

    handleColumnDragging(e: WechatMiniprogram.CustomEvent<NestedDragDetail>) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      cancelColumnAutoAdjust(columnState);
      columnState.hasUserInteracted = true;
      columnState.isTouching = true;
      columnState.lastTouchAt = Date.now();

      const detail = resolveScrollDetail(e.detail);
      const nextOffset = Math.max(0, detail.scrollTop);
      columnState.currentOffset = nextOffset;
      columnState.controlledOffset = nextOffset;
      columnState.lastScrollAt = Date.now();
    },

    handleColumnDragEnd(e: WechatMiniprogram.CustomEvent<NestedDragDetail>) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      const detail = resolveScrollDetail(e.detail);
      const nextOffset = Math.max(0, detail.scrollTop);
      const isPassiveOpenScroll =
        !columnState.hasUserInteracted &&
        !columnState.isAutoAdjusting &&
        !columnState.isTouching;

      if (isPassiveOpenScroll && isPassiveRollbackToStart(columnState, nextOffset)) {
        return;
      }

      columnState.currentOffset = nextOffset;
      columnState.controlledOffset = nextOffset;
      columnState.lastScrollAt = Date.now();
      columnState.isTouching = false;
    },

    handleColumnScroll(e: WechatMiniprogram.CustomEvent<NestedScrollDetail>) {
      const columnIndex = Number(e.currentTarget.dataset.columnIndex);
      if (Number.isNaN(columnIndex)) {
        return;
      }

      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      if (columnState.pendingAlignOffset !== null) {
        return;
      }

      if (Date.now() < columnState.ignoreScrollEventsUntil) {
        return;
      }

      const detail = resolveScrollDetail(e.detail);
      const nextOffset = Math.max(0, detail.scrollTop);
      const isPassiveOpenScroll =
        !columnState.hasUserInteracted &&
        !columnState.isAutoAdjusting &&
        !columnState.isTouching;

      if (isPassiveOpenScroll) {
        if (isPassiveRollbackToStart(columnState, nextOffset)) {
          return;
        }

        const passiveActivationDelta = 3;
        const deltaFromControlled = Math.abs(nextOffset - columnState.controlledOffset);
        if (deltaFromControlled >= passiveActivationDelta) {
          columnState.hasUserInteracted = true;
        } else {
          return;
        }
      }

      columnState.currentOffset = nextOffset;
      columnState.controlledOffset = columnState.currentOffset;
      columnState.lastScrollAt = Date.now();

      if (columnState.isAutoAdjusting) {
        return;
      }

      if (!columnState.isScrolling) {
        columnState.isScrolling = true;
      }

      if (columnState.scrollStopTimer) {
        clearTimeout(columnState.scrollStopTimer);
        columnState.scrollStopTimer = null;
      }

      const scrollEndDelay = Math.max(
        50,
        Number(this.data.scrollEndDelay) || 120,
      );
      this.scheduleColumnSnap(columnIndex, scrollEndDelay);
    },

    scheduleColumnSnap(columnIndex: number, delay: number) {
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      if (!columnState) {
        return;
      }

      if (columnState.scrollStopTimer) {
        clearTimeout(columnState.scrollStopTimer);
      }

      columnState.scrollStopTimer = setTimeout(() => {
        columnState.scrollStopTimer = null;

        if (columnState.isAutoAdjusting) {
          return;
        }

        if (!columnState.hasUserInteracted) {
          columnState.isScrolling = false;
          return;
        }

        if (columnState.isTouching) {
          this.scheduleColumnSnap(columnIndex, 40);
          return;
        }

        this.snapColumnToNearest(columnIndex);
      }, Math.max(32, delay));
    },

    snapColumnToNearest(columnIndex: number) {
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

      const { estimateSize, indicatorHeight } = resolvePickboxMetrics(
        this.data,
      );
      const fallbackHeight = resolveDefaultContainerHeightBySize(this.data.size);
      const containerHeight = Math.max(
        1,
        Number(this.data.containerHeight) ||
          Math.max(fallbackHeight, estimateSize, indicatorHeight),
      );
      const resolvedPadding = Math.max(
        0,
        Number(this.data.resolvedPadding) || containerHeight / 2 - indicatorHeight / 2,
      );

      const viewportCenter = columnState.currentOffset + containerHeight / 2;

      let nearestIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;

      column.items.forEach((item, itemIndex) => {
        if (item.isDisabled) {
          return;
        }

        const itemCenter =
          resolvedPadding + itemIndex * estimateSize + estimateSize / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = itemIndex;
        }
      });

      if (nearestIndex < 0) {
        return;
      }

      const nearestItem = column.items[nearestIndex];
      if (!nearestItem) {
        return;
      }

      this.selectColumnItem(columnIndex, nearestItem.id, 'smooth');
    },

    selectColumnItem(
      columnIndex: number,
      itemId: PickboxMiniItemId,
      behavior: PickboxScrollBehavior,
    ) {
      const columns = resolveColumns(this.data.columns);
      const internalState = getInternalState(this, columns.length);
      const columnState = internalState.columns[columnIndex];
      const column = columns[columnIndex];

      if (!columnState || !column) {
        return;
      }

      const itemIndex = column.items.findIndex((item) =>
        isSamePickboxItemId(item.id, itemId),
      );
      if (itemIndex < 0) {
        return;
      }

      const { estimateSize, indicatorHeight } = resolvePickboxMetrics(
        this.data,
      );
      const containerHeight = Math.max(
        1,
        Number(this.data.containerHeight) || Math.max(estimateSize, indicatorHeight),
      );
      const resolvedPadding = Math.max(
        0,
        Number(this.data.resolvedPadding) || containerHeight / 2 - indicatorHeight / 2,
      );

      if (columnState.scrollStopTimer) {
        clearTimeout(columnState.scrollStopTimer);
        columnState.scrollStopTimer = null;
      }
      if (columnState.autoAdjustTimer) {
        clearTimeout(columnState.autoAdjustTimer);
        columnState.autoAdjustTimer = null;
      }

      const nextOffset = resolveScrollTopForIndex({
        index: itemIndex,
        estimateSize,
        resolvedPadding,
        containerHeight,
      });
      columnState.currentOffset = nextOffset;
      columnState.pendingAlignOffset = nextOffset;
      columnState.pendingScrollWithAnimation = behavior === 'smooth';
      columnState.isScrolling = behavior === 'smooth';
      columnState.isAutoAdjusting = behavior === 'smooth';
      columnState.alignPhase = behavior === 'smooth' ? 'running' : 'idle';
      columnState.ignoreScrollEventsUntil =
        behavior === 'smooth' ? 0 : Date.now() + 80;
      if (behavior !== 'smooth') {
        columnState.controlledOffset = nextOffset;
        columnState.pendingAlignOffset = null;
        columnState.pendingScrollWithAnimation = false;
        columnState.alignPhase = 'idle';
      }
      columnState.hasInitialized = true;
      columnState.lastSelectedId = itemId;

      const mergedValue = ensurePickboxValue(
        columns,
        isArrayLikeValue(this.data.value)
          ? (this.data.value as PickboxMiniValue)
          : this.data.innerValue,
      );
      const nextValue = [...mergedValue];
      nextValue[columnIndex] = itemId;

      if (!isArrayLikeValue(this.data.value)) {
        this.setData(
          {
            innerValue: nextValue,
          } satisfies Partial<PickboxMiniVirtualState>,
          () => {
            this.recomputeVirtualColumns();
          },
        );
      } else {
        this.recomputeVirtualColumns();
      }

      this.triggerEvent('valuechange', {
        value: nextValue,
        columnIndex,
        itemId,
      });
    },
  },
});

export { pickbox, pickboxItemState } from '@srcube-ui/styles/components/pickbox/style';
export type {
  PickboxMiniColumn,
  PickboxMiniItem,
  PickboxMiniItemId,
  PickboxMiniProps,
  PickboxMiniValue,
} from './props';
export { pickboxMiniProps } from './props';
