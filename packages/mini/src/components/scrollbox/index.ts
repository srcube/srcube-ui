import { UIComponent } from '../../shared/ui-component';
import { scrollbox } from '@srcube-ui/styles/components/scrollbox/style';
import { scrollboxMiniProps } from './props';

type ScrollboxOrientation = 'x' | 'y' | 'xy';

type ScrollboxMaskState = {
  showMaskTop: boolean;
  showMaskBottom: boolean;
  showMaskLeft: boolean;
  showMaskRight: boolean;
};

type ScrollboxMetrics = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
};

type ScrollEventDetail = {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
};

type ScrollEndDetail = ScrollEventDetail & {
  clientHeight: number;
  clientWidth: number;
};

const EDGE_EPSILON = 4;
const DEFAULT_SCROLL_END_DELAY = 120;

function resolveScrollboxOrientation(
  value?: ScrollboxOrientation | null,
): ScrollboxOrientation {
  return value ?? 'y';
}

function getScrollboxAxes(orientation: ScrollboxOrientation) {
  return {
    scrollX: orientation === 'x' || orientation === 'xy',
    scrollY: orientation === 'y' || orientation === 'xy',
  };
}

function getScrollboxMaskState({
  orientation,
  hideMasks,
  metrics,
}: {
  orientation: ScrollboxOrientation;
  hideMasks?: boolean;
  metrics: ScrollboxMetrics;
}): ScrollboxMaskState {
  if (hideMasks) {
    return {
      showMaskTop: false,
      showMaskBottom: false,
      showMaskLeft: false,
      showMaskRight: false,
    };
  }

  const { scrollX, scrollY } = getScrollboxAxes(orientation);
  const {
    scrollTop,
    scrollLeft,
    scrollHeight,
    scrollWidth,
    clientHeight,
    clientWidth,
  } = metrics;
  const remainedBottom = scrollHeight - (scrollTop + clientHeight);
  const remainedRight = scrollWidth - (scrollLeft + clientWidth);
  const horizontalEndEpsilon = Math.max(
    EDGE_EPSILON,
    Math.min(24, clientWidth * 0.08),
  );

  return {
    showMaskTop: scrollY && scrollTop > EDGE_EPSILON,
    showMaskBottom: scrollY && remainedBottom > EDGE_EPSILON,
    showMaskLeft: scrollX && scrollLeft > EDGE_EPSILON,
    showMaskRight: scrollX && remainedRight > horizontalEndEpsilon,
  };
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    scrollboxMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    showMaskTop: false,
    showMaskBottom: false,
    showMaskLeft: false,
    showMaskRight: false,
    clientWidth: 0,
    clientHeight: 0,
    contentWidth: 0,
    contentHeight: 0,
  },

  observers: {
    orientation() {
      this.updateMasksFromData();
    },
    hideMasks() {
      this.updateMasksFromData();
    },
    scrollTop() {
      this.updateMasksFromData();
    },
    scrollLeft() {
      this.updateMasksFromData();
    },
  },

  lifetimes: {
    ready() {
      this.measure();
    },
    detached() {
      const instance = this as typeof this & {
        _scrollEndTimer?: ReturnType<typeof setTimeout>;
        _latestScrollEndDetail?: ScrollEndDetail;
      };

      if (instance._scrollEndTimer) {
        clearTimeout(instance._scrollEndTimer);
        instance._scrollEndTimer = undefined;
      }
      instance._latestScrollEndDetail = undefined;
    },
  },

  computed: {
    $scrollX(data) {
      const orientation = resolveScrollboxOrientation(data.orientation);
      const axes = getScrollboxAxes(orientation);
      return data.scrollX ?? axes.scrollX;
    },
    $scrollY(data) {
      const orientation = resolveScrollboxOrientation(data.orientation);
      const axes = getScrollboxAxes(orientation);
      return data.scrollY ?? axes.scrollY;
    },
    $classNames(data) {
      const orientation = resolveScrollboxOrientation(data.orientation);
      const slots = scrollbox({
        orientation,
        tone: data.tone,
        hideMasks: data.hideMasks,
        showMaskTop: data.showMaskTop,
        showMaskBottom: data.showMaskBottom,
        showMaskLeft: data.showMaskLeft,
        showMaskRight: data.showMaskRight,
      });

      const classNames = data.classNames ?? {};

      return {
        wrapper: slots.wrapper({ class: classNames.wrapper }),
        scrollview: slots.scrollview({ class: classNames.scrollview }),
        content: slots.content({ class: classNames.content }),
        maskTop: slots.maskTop({ class: classNames.maskTop }),
        maskBottom: slots.maskBottom({ class: classNames.maskBottom }),
        maskLeft: slots.maskLeft({ class: classNames.maskLeft }),
        maskRight: slots.maskRight({ class: classNames.maskRight }),
      };
    },
  },

  methods: {
    scheduleScrollEnd(detail: ScrollEndDetail) {
      const instance = this as typeof this & {
        _scrollEndTimer?: ReturnType<typeof setTimeout>;
        _latestScrollEndDetail?: ScrollEndDetail;
      };

      instance._latestScrollEndDetail = detail;

      if (instance._scrollEndTimer) {
        clearTimeout(instance._scrollEndTimer);
      }

      const delay = Math.max(
        0,
        Number(this.data.scrollEndDelay ?? DEFAULT_SCROLL_END_DELAY) || 0,
      );

      instance._scrollEndTimer = setTimeout(() => {
        instance._scrollEndTimer = undefined;
        const latestDetail = instance._latestScrollEndDetail ?? detail;
        const query = this.createSelectorQuery();
        query.select('.sr-scrollbox__scrollview').scrollOffset();
        query.exec((result) => {
          const offset = result?.[0] as
            | WechatMiniprogram.ScrollOffset
            | null
            | undefined;

          const finalizedDetail: ScrollEndDetail = {
            scrollTop: Number(offset?.scrollTop ?? latestDetail.scrollTop ?? 0),
            scrollLeft: Number(offset?.scrollLeft ?? latestDetail.scrollLeft ?? 0),
            scrollHeight: Math.max(
              Number(latestDetail.scrollHeight ?? 0),
              Number(this.data.contentHeight ?? 0),
            ),
            scrollWidth: Math.max(
              Number(latestDetail.scrollWidth ?? 0),
              Number(this.data.contentWidth ?? 0),
            ),
            clientHeight: Math.max(
              Number(latestDetail.clientHeight ?? 0),
              Number(this.data.clientHeight ?? 0),
            ),
            clientWidth: Math.max(
              Number(latestDetail.clientWidth ?? 0),
              Number(this.data.clientWidth ?? 0),
            ),
          };

          this.updateMasks(finalizedDetail);
          this.triggerEvent('scrollend', finalizedDetail);
        });
      }, delay);
    },

    measure() {
      const query = this.createSelectorQuery();
      query.select('.sr-scrollbox__scrollview').boundingClientRect();
      query.select('.sr-scrollbox__content').boundingClientRect();
      query.exec(
        (
          rects: Array<WechatMiniprogram.BoundingClientRectCallbackResult | null>,
        ) => {
          const [scrollviewRect, contentRect] = rects;
          if (!scrollviewRect || !contentRect) return;

          const clientWidth = scrollviewRect.width ?? 0;
          const clientHeight = scrollviewRect.height ?? 0;
          const contentWidth = contentRect.width ?? 0;
          const contentHeight = contentRect.height ?? 0;

          this.setData({
            clientWidth,
            clientHeight,
            contentWidth,
            contentHeight,
          });

          this.updateMasks({
            scrollTop: this.data.scrollTop ?? 0,
            scrollLeft: this.data.scrollLeft ?? 0,
            scrollHeight: contentHeight,
            scrollWidth: contentWidth,
            clientHeight,
            clientWidth,
          });
        },
      );
    },

    updateMasksFromData() {
      const {
        clientWidth,
        clientHeight,
        contentWidth,
        contentHeight,
        scrollTop,
        scrollLeft,
      } = this.data;

      if (!clientWidth && !clientHeight) return;

      this.updateMasks({
        scrollTop: scrollTop ?? 0,
        scrollLeft: scrollLeft ?? 0,
        scrollHeight: contentHeight,
        scrollWidth: contentWidth,
        clientHeight,
        clientWidth,
      });
    },

    updateMasks(metrics: ScrollboxMetrics) {
      const orientation = resolveScrollboxOrientation(this.data.orientation);
      const maskState = getScrollboxMaskState({
        orientation,
        hideMasks: this.data.hideMasks,
        metrics,
      });

      const nextData: Record<string, number | boolean> = {};
      let changed = false;

      if (maskState.showMaskTop !== this.data.showMaskTop) {
        nextData.showMaskTop = maskState.showMaskTop;
        changed = true;
      }
      if (maskState.showMaskBottom !== this.data.showMaskBottom) {
        nextData.showMaskBottom = maskState.showMaskBottom;
        changed = true;
      }
      if (maskState.showMaskLeft !== this.data.showMaskLeft) {
        nextData.showMaskLeft = maskState.showMaskLeft;
        changed = true;
      }
      if (maskState.showMaskRight !== this.data.showMaskRight) {
        nextData.showMaskRight = maskState.showMaskRight;
        changed = true;
      }
      if (metrics.scrollWidth !== this.data.contentWidth) {
        nextData.contentWidth = metrics.scrollWidth;
        changed = true;
      }
      if (metrics.scrollHeight !== this.data.contentHeight) {
        nextData.contentHeight = metrics.scrollHeight;
        changed = true;
      }
      if (metrics.clientWidth !== this.data.clientWidth) {
        nextData.clientWidth = metrics.clientWidth;
        changed = true;
      }
      if (metrics.clientHeight !== this.data.clientHeight) {
        nextData.clientHeight = metrics.clientHeight;
        changed = true;
      }

      if (changed) {
        this.setData(nextData);
      }
    },

    handleScroll(e: WechatMiniprogram.CustomEvent<ScrollEventDetail>) {
      const metrics = {
        scrollTop: e.detail.scrollTop ?? 0,
        scrollLeft: e.detail.scrollLeft ?? 0,
        scrollHeight: e.detail.scrollHeight ?? this.data.contentHeight,
        scrollWidth: e.detail.scrollWidth ?? this.data.contentWidth,
        clientHeight: this.data.clientHeight,
        clientWidth: this.data.clientWidth,
      };

      this.updateMasks(metrics);
      this.triggerEvent('scroll', {
        scrollTop: metrics.scrollTop,
        scrollLeft: metrics.scrollLeft,
        scrollHeight: metrics.scrollHeight,
        scrollWidth: metrics.scrollWidth,
      });
      this.scheduleScrollEnd(metrics);
    },

    handleScrollToUpper(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltoupper', e);
    },

    handleScrollToLower(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('scrolltolower', e);
    },

    onRefresherPulling(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherpulling', e);
    },

    onRefresherRefresh(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherrefresh', e);
    },

    onRefresherRestore(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherrestore', e);
    },

    onRefresherAbort(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('refresherabort', e);
    },
  },
});

export { scrollbox } from '@srcube-ui/styles/components/scrollbox/style';
export type { ScrollboxMiniProps } from './props';
export { scrollboxMiniProps } from './props';
