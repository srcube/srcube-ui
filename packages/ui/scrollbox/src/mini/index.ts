import { UIComponent } from '@srcube-ui/mini';
import { scrollbox } from '../style';
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

const EDGE_EPSILON = 1;

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

  return {
    showMaskTop: scrollY && scrollTop > 0,
    showMaskBottom:
      scrollY && scrollTop + clientHeight < scrollHeight - EDGE_EPSILON,
    showMaskLeft: scrollX && scrollLeft > 0,
    showMaskRight:
      scrollX && scrollLeft + clientWidth < scrollWidth - EDGE_EPSILON,
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

export { scrollbox } from '../style';
export type { ScrollboxMiniProps } from './props';
export { scrollboxMiniProps } from './props';
