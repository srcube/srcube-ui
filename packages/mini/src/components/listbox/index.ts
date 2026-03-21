import { UIComponent } from '../../shared/ui-component';
import {
  defaultRangeExtractor,
  type Range,
  Virtualizer,
} from '@tanstack/virtual-core';
import {
  DEFAULT_LISTBOX_LOCALE,
  LISTBOX_EMPTY_TEXT,
  type ListboxLocale,
} from './locale';
import { listbox, listboxItemState } from '@srcube-ui/styles/components/listbox/style';
import type { ListboxMiniItem, ListboxMiniProps } from './props';
import { listboxMiniProps } from './props';

type ListboxOrientation = 'x' | 'y';

type ScrollEventDetail = {
  scrollTop?: number;
  scrollLeft?: number;
};

type NestedScrollDetail = {
  detail?: ScrollEventDetail;
} & ScrollEventDetail;

type RenderItem = {
  id: string | number;
  label: string;
  index: number;
  virtualKey: string;
  className: string;
  labelClassName: string;
  endIconClassName: string;
  style: string;
  isActiveSticky: boolean;
};

function resolveOrientation(value?: string | null): ListboxOrientation {
  return value === 'x' ? 'x' : 'y';
}

function resolveSize(value?: string | null) {
  if (value === 'sm' || value === 'lg') {
    return value;
  }

  return 'md';
}

function resolveEmptyText(locale?: string): string {
  if (
    locale &&
    Object.prototype.hasOwnProperty.call(LISTBOX_EMPTY_TEXT, locale)
  ) {
    return LISTBOX_EMPTY_TEXT[locale as ListboxLocale];
  }

  return LISTBOX_EMPTY_TEXT[DEFAULT_LISTBOX_LOCALE];
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

type ListboxMiniVirtualState = {
  viewportMainSize: number;
  viewportCrossSize: number;
  currentOffset: number;
  totalSize: number;
  contentStyle: string;
  renderItems: RenderItem[];
};

type ListboxMiniData = ListboxMiniProps & ListboxMiniVirtualState;

function createVirtualizer(params: {
  count: number;
  estimateSize: number;
  overscan: number;
  isHorizontal: boolean;
  viewportMainSize: number;
  offset: number;
  stickyIndexes: number[];
}) {
  const {
    count,
    estimateSize,
    overscan,
    isHorizontal,
    viewportMainSize,
    offset,
    stickyIndexes,
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
    rangeExtractor: (range: Range) => {
      const defaultIndexes = defaultRangeExtractor(range);

      if (stickyIndexes.length === 0) {
        return defaultIndexes;
      }

      const activeStickyIndex = resolveActiveStickyIndex(
        stickyIndexes,
        range.startIndex,
      );

      if (activeStickyIndex == null) {
        return defaultIndexes;
      }

      return Array.from(new Set([...defaultIndexes, activeStickyIndex])).sort(
        (a, b) => a - b,
      );
    },
  });
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    listboxMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    viewportMainSize: 0,
    viewportCrossSize: 0,
    currentOffset: 0,
    totalSize: 0,
    contentStyle: '',
    renderItems: [] as RenderItem[],
  } satisfies ListboxMiniVirtualState,

  observers: {
    items() {
      this.recomputeVirtualItems();
    },
    estimateSize() {
      this.recomputeVirtualItems();
    },
    overscan() {
      this.recomputeVirtualItems();
    },
    orientation() {
      this.remeasureAndRecompute();
    },
    size() {
      this.recomputeVirtualItems();
    },
    hasDivider() {
      this.recomputeVirtualItems();
    },
    hideEmptyContent() {
      this.recomputeVirtualItems();
    },
  },

  lifetimes: {
    ready() {
      this.remeasureAndRecompute();
    },
  },

  computed: {
    $isHorizontal(data: ListboxMiniData) {
      return resolveOrientation(data.orientation) === 'x';
    },
    $isVertical(data: ListboxMiniData) {
      return resolveOrientation(data.orientation) === 'y';
    },
    $isEmpty(data: ListboxMiniData) {
      return !Array.isArray(data.items) || data.items.length === 0;
    },
    $emptyText(data: ListboxMiniData) {
      return resolveEmptyText(data.locale);
    },
    $classNames(data: ListboxMiniData) {
      const orientation = resolveOrientation(data.orientation);
      const size = resolveSize(data.size);
      const slots = listbox({
        orientation,
        tone: data.tone,
        size,
        hasDivider: data.hasDivider,
      });
      const classNames = data.classNames ?? {};

      return {
        base: slots.base({ class: classNames.base }),
        $scrollbox: slots.$scrollbox({ class: classNames.$scrollbox }),
        scrollbox: slots.scrollbox({ class: classNames.scrollbox }),
        scrollboxContent: slots.scrollboxContent({
          class: classNames.scrollboxContent,
        }),
        stickyItem: slots.stickyItem({ class: classNames.stickyItem }),
        content: slots.content({ class: classNames.content }),
        item: slots.item({ class: classNames.item }),
        itemInner: slots.itemInner({ class: classNames.itemInner }),
        itemLabel: slots.itemLabel({ class: classNames.itemLabel }),
        itemIcon: slots.itemIcon({ class: classNames.itemIcon }),
        emptyContent: slots.emptyContent({ class: classNames.emptyContent }),
        iEmpty: slots._iEmpty(),
      };
    },
    $scrollboxClassNames(data: ListboxMiniData) {
      const orientation = resolveOrientation(data.orientation);
      const size = resolveSize(data.size);
      const slots = listbox({
        orientation,
        tone: data.tone,
        size,
        hasDivider: data.hasDivider,
      });
      const classNames = data.classNames ?? {};

      const scrollboxContentClassName =
        orientation === 'x'
          ? (classNames.scrollboxContent ?? '')
          : slots.scrollboxContent({
              class: classNames.scrollboxContent,
            });

      return {
        content: scrollboxContentClassName,
      };
    },
  },

  methods: {
    remeasureAndRecompute() {
      const query = this.createSelectorQuery();
      query.select('.sr-listbox__scroll-host').boundingClientRect();
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
              this.recomputeVirtualItems();
            },
          );
        },
      );
    },

    recomputeVirtualItems() {
      const items = Array.isArray(this.data.items)
        ? (this.data.items as ListboxMiniItem[])
        : [];

      if (items.length === 0) {
        this.setData({
          totalSize: 0,
          contentStyle: '',
          renderItems: [],
        } satisfies Partial<ListboxMiniVirtualState>);
        return;
      }

      const orientation = resolveOrientation(this.data.orientation);
      const isHorizontal = orientation === 'x';
      const viewportMainSize = Math.max(
        0,
        Number(this.data.viewportMainSize) || 0,
      );
      const viewportCrossSize = Math.max(
        0,
        Number(this.data.viewportCrossSize) || 0,
      );
      const estimateSize = Math.max(1, Number(this.data.estimateSize) || 40);
      const overscan = Math.max(1, Number(this.data.overscan) || 5);
      const offset = Math.max(0, Number(this.data.currentOffset) || 0);

      const stickyIndexes: number[] = [];
      items.forEach((item, index) => {
        if (item.isSticky) {
          stickyIndexes.push(index);
        }
      });

      const virtualizer = createVirtualizer({
        count: items.length,
        estimateSize,
        overscan,
        isHorizontal,
        viewportMainSize,
        offset,
        stickyIndexes,
      });

      const virtualItems = virtualizer.getVirtualItems();
      const totalSize = virtualizer.getTotalSize();
      const hasVirtualItems = virtualItems.length > 0;

      const fallbackCount = Math.min(
        items.length,
        Math.max(1, overscan * 2 + 1),
      );
      const fallbackVirtualItems = hasVirtualItems
        ? []
        : Array.from({ length: fallbackCount }, (_, index) => {
            const size = estimateSize;
            return {
              key: items[index]?.id ?? index,
              index,
              start: index * size,
              size,
            };
          });

      const renderSource = hasVirtualItems
        ? virtualItems
        : fallbackVirtualItems;

      const activeVirtualItemByOffset =
        virtualizer.getVirtualItemForOffset(offset);
      const stickyStartIndex =
        activeVirtualItemByOffset?.index ??
        virtualizer.range?.startIndex ??
        Math.max(0, Math.floor(offset / estimateSize));

      const activeStickyIndex = resolveActiveStickyIndex(
        stickyIndexes,
        stickyStartIndex,
      );

      const renderItems: RenderItem[] = renderSource
        .map((virtualItem) => {
          const item = items[virtualItem.index];
          if (!item) {
            return null;
          }

          const isActiveSticky =
            item.isSticky === true && virtualItem.index === activeStickyIndex;

          const stateClassName = listboxItemState({
            orientation,
            tone: this.data.tone,
            isDisabled: !!item.isDisabled,
          });

          const style = isActiveSticky
            ? isHorizontal
              ? `position:sticky;left:0;top:0;z-index:1;width:${virtualItem.size}px;height:100%;`
              : `position:sticky;left:0;top:0;z-index:1;width:100%;height:${virtualItem.size}px;`
            : isHorizontal
              ? `position:absolute;left:${virtualItem.start}px;top:0;width:${virtualItem.size}px;height:100%;`
              : `position:absolute;left:0;top:${virtualItem.start}px;width:100%;height:${virtualItem.size}px;`;

          return {
            id: item.id,
            label: item.label,
            index: virtualItem.index,
            virtualKey: String(virtualItem.key),
            className: `${stateClassName} ${item.className ?? ''}`.trim(),
            labelClassName: item.labelClassName ?? '',
            endIconClassName: item.endIconClassName ?? '',
            style,
            isActiveSticky,
          };
        })
        .filter((item): item is RenderItem => !!item);

      const horizontalContentHeight = Math.max(1, viewportCrossSize);

      const contentStyle = isHorizontal
        ? `position:relative;width:${totalSize}px;height:${horizontalContentHeight}px;`
        : `position:relative;width:100%;height:${totalSize}px;`;

      this.setData({
        totalSize,
        contentStyle,
        renderItems,
      } satisfies Partial<ListboxMiniVirtualState>);
    },

    handleScroll(e: WechatMiniprogram.CustomEvent<NestedScrollDetail>) {
      const orientation = resolveOrientation(this.data.orientation);
      const detail = resolveScrollDetail(e.detail);
      const nextOffset =
        orientation === 'x' ? detail.scrollLeft : detail.scrollTop;

      this.setData({ currentOffset: nextOffset }, () => {
        this.recomputeVirtualItems();
      });

      this.triggerEvent('scroll', detail);
    },

    handleScrollToUpper(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltoupper', e.detail ?? e);
    },

    handleScrollToLower(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltolower', e.detail ?? e);
    },

    handleRefresherPulling(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherpulling', e.detail ?? e);
    },

    handleRefresherRefresh(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherrefresh', e.detail ?? e);
    },

    handleRefresherRestore(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherrestore', e.detail ?? e);
    },

    handleRefresherAbort(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherabort', e.detail ?? e);
    },

    handleItemTap(e: WechatMiniprogram.BaseEvent) {
      const index = Number(e.currentTarget.dataset.index);
      if (Number.isNaN(index)) {
        return;
      }

      const items = Array.isArray(this.data.items)
        ? (this.data.items as ListboxMiniItem[])
        : [];
      const item = items[index];
      if (!item || item.isDisabled) {
        return;
      }
      this.triggerEvent('itemtap', {
        item,
        index,
      });
    },
  },
});

export { listbox } from '@srcube-ui/styles/components/listbox/style';
export type { ListboxMiniItem, ListboxMiniProps } from './props';
export { listboxMiniProps } from './props';
