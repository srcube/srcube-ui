import { imageStyle } from '@srcube-ui/styles/components/image/style';
import { UIComponent } from '../../shared/ui-component';
import { type ImageMiniProps, imageMiniProps } from './props';

type ImageMiniState = {
  _hasError: boolean;
  _isLoaded: boolean;
  _previewVisible: boolean;
  _previewScale: number;
  _previewTranslateX: number;
  _previewTranslateY: number;
  _previewTransitionMs: number;
};

type ImageMiniData = ImageMiniProps & ImageMiniState;
type ImageMiniInstance = WechatMiniprogram.Component.TrivialInstance & {
  _previewLastTapAt?: number;
  _previewCloseTimer?: ReturnType<typeof setTimeout>;
  _previewPinchStartDistance?: number;
  _previewPinchStartScale?: number;
  _previewIgnoreTapUntil?: number;
  _previewPanStartX?: number;
  _previewPanStartY?: number;
  _previewPanStartTranslateX?: number;
  _previewPanStartTranslateY?: number;
  _previewPanMoved?: boolean;
  _previewViewportWidth?: number;
  _previewViewportHeight?: number;
  _previewImageWidth?: number;
  _previewImageHeight?: number;
};

const FIT_MODE_MAP: Record<string, WechatMiniprogram.Image['mode']> = {
  cover: 'aspectFill',
  contain: 'aspectFit',
  fill: 'scaleToFill',
  none: 'center',
};
const PREVIEW_DOUBLE_TAP_MS = 260;
const PREVIEW_DOUBLE_TAP_ZOOM_MS = 500;
const PREVIEW_MIN_SCALE = 1;
const PREVIEW_PAN_THRESHOLD = 4;
const PREVIEW_SCALE_EPSILON = 0.01;
const PREVIEW_PINCH_OVERSHOOT_CAP = 0.9;
const PREVIEW_PINCH_BOUNCE_MS = 280;

function clampScaleMin(value: number) {
  return Math.max(PREVIEW_MIN_SCALE, value);
}

function getTouchDistance(touches: WechatMiniprogram.Touch[]): number {
  if (touches.length < 2) {
    return 0;
  }

  const [first, second] = touches;
  const firstX = Number(first.pageX ?? first.clientX ?? 0);
  const firstY = Number(first.pageY ?? first.clientY ?? 0);
  const secondX = Number(second.pageX ?? second.clientX ?? 0);
  const secondY = Number(second.pageY ?? second.clientY ?? 0);
  const deltaX = secondX - firstX;
  const deltaY = secondY - firstY;
  return Math.hypot(deltaX, deltaY);
}

function getTouchPoint(touch: WechatMiniprogram.Touch) {
  return {
    x: Number(touch.pageX ?? touch.clientX ?? 0),
    y: Number(touch.pageY ?? touch.clientY ?? 0),
  };
}

function ensurePreviewViewport(instance: ImageMiniInstance) {
  const viewportWidth = Number(instance._previewViewportWidth ?? 0);
  const viewportHeight = Number(instance._previewViewportHeight ?? 0);
  if (viewportWidth > 0 && viewportHeight > 0) {
    return;
  }

  try {
    const info = wx.getSystemInfoSync();
    instance._previewViewportWidth = Number(info.windowWidth ?? 0);
    instance._previewViewportHeight = Number(info.windowHeight ?? 0);
  } catch {
    instance._previewViewportWidth = 375;
    instance._previewViewportHeight = 667;
  }
}

function resolvePreviewBaseSize(instance: ImageMiniInstance) {
  ensurePreviewViewport(instance);

  const viewportWidth = Math.max(
    1,
    Number(instance._previewViewportWidth ?? 0),
  );
  const viewportHeight = Math.max(
    1,
    Number(instance._previewViewportHeight ?? 0),
  );
  const imageWidth = Number(instance._previewImageWidth ?? 0);
  const imageHeight = Number(instance._previewImageHeight ?? 0);

  if (imageWidth <= 0 || imageHeight <= 0) {
    return {
      viewportWidth,
      viewportHeight,
      baseWidth: viewportWidth,
      baseHeight: viewportHeight,
    };
  }

  const imageRatio = imageWidth / imageHeight;
  const viewportRatio = viewportWidth / viewportHeight;
  if (imageRatio > viewportRatio) {
    return {
      viewportWidth,
      viewportHeight,
      baseWidth: viewportWidth,
      baseHeight: viewportWidth / imageRatio,
    };
  }

  return {
    viewportWidth,
    viewportHeight,
    baseWidth: viewportHeight * imageRatio,
    baseHeight: viewportHeight,
  };
}

function clampPreviewTranslate(
  instance: ImageMiniInstance,
  translateX: number,
  translateY: number,
  scale: number,
) {
  if (scale <= PREVIEW_MIN_SCALE) {
    return {
      x: 0,
      y: 0,
    };
  }

  const { viewportWidth, viewportHeight, baseWidth, baseHeight } =
    resolvePreviewBaseSize(instance);
  const maxX = Math.max(0, (baseWidth * scale - viewportWidth) / 2);
  const maxY = Math.max(0, (baseHeight * scale - viewportHeight) / 2);

  return {
    x: Math.max(-maxX, Math.min(maxX, translateX)),
    y: Math.max(-maxY, Math.min(maxY, translateY)),
  };
}

function resolvePreviewMaxScale(instance: ImageMiniInstance) {
  const { viewportWidth, viewportHeight, baseWidth, baseHeight } =
    resolvePreviewBaseSize(instance);
  const scaleToFullWidth = viewportWidth / Math.max(1, baseWidth);
  const scaleToFullHeight = viewportHeight / Math.max(1, baseHeight);
  return Math.max(2, Math.max(scaleToFullWidth, scaleToFullHeight) * 2);
}

function clampPreviewScale(instance: ImageMiniInstance, value: number) {
  const maxScale = resolvePreviewMaxScale(instance);
  return Math.max(PREVIEW_MIN_SCALE, Math.min(maxScale, value));
}

function applyScaleResistance(value: number, min: number, max: number): number {
  if (value > max) {
    const over = value - max;
    return max + over / (1 + over / PREVIEW_PINCH_OVERSHOOT_CAP);
  }

  if (value < min) {
    const below = min - value;
    return min - below / (1 + below / PREVIEW_PINCH_OVERSHOOT_CAP);
  }

  return value;
}

function normalizeStyleText(style: unknown): string {
  const normalized = String(style ?? '').trim();
  if (!normalized) {
    return '';
  }
  return normalized.endsWith(';') ? normalized : `${normalized};`;
}

function toCssLength(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value}px`;
  }

  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim();
  if (!normalized) {
    return '';
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return `${normalized}px`;
  }

  return normalized;
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    imageMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _hasError: false as boolean,
    _isLoaded: false as boolean,
    _previewVisible: false as boolean,
    _previewScale: 1,
    _previewTranslateX: 0,
    _previewTranslateY: 0,
    _previewTransitionMs: 0,
  } satisfies ImageMiniState,

  observers: {
    src() {
      this.setData({
        _hasError: false,
        _isLoaded: false,
      } satisfies Partial<ImageMiniState>);
    },
  },

  lifetimes: {
    detached() {
      const instance = this as ImageMiniInstance;
      if (instance._previewCloseTimer) {
        clearTimeout(instance._previewCloseTimer);
        instance._previewCloseTimer = undefined;
      }
    },
  },

  computed: {
    $status(data: ImageMiniData) {
      if (!data.src || data._hasError) {
        return 'error' as const;
      }

      if (!data._isLoaded) {
        return 'loading' as const;
      }

      return 'normal' as const;
    },

    $placeholderText(data: ImageMiniData) {
      const status =
        !data.src || data._hasError
          ? 'error'
          : data._isLoaded
            ? 'normal'
            : 'loading';

      if (status === 'loading') {
        return data.loadingText || 'Loading...';
      }

      return data.fallback || 'Image unavailable';
    },

    $imageMode(data: ImageMiniData) {
      return FIT_MODE_MAP[String(data.fit ?? 'cover')] ?? 'aspectFill';
    },

    $previewCurrent(data: ImageMiniData) {
      return data.previewSrc || data.src || '';
    },

    $previewImageStyle(data: ImageMiniData) {
      const scale = clampScaleMin(Number(data._previewScale) || 1);
      const translateX = Number(data._previewTranslateX) || 0;
      const translateY = Number(data._previewTranslateY) || 0;
      const transitionMs = Math.max(0, Number(data._previewTransitionMs) || 0);
      const transition =
        transitionMs > 0 ? `transform ${transitionMs}ms ease` : 'none';
      return `width:100vw;height:100vh;transform:translate3d(${translateX}px,${translateY}px,0) scale(${scale});transform-origin:center center;transition:${transition};`;
    },

    $classNames(data: ImageMiniData) {
      const status =
        !data.src || data._hasError
          ? 'error'
          : data._isLoaded
            ? 'normal'
            : 'loading';
      const slots = imageStyle({
        tone: data.tone,
        radius: data.radius,
        fit: data.fit,
        ratio: data.ratio,
        isBlock: Boolean(data.isBlock),
        status,
        isPreviewable: Boolean(data.isPreviewable),
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        image: slots.image({ class: custom.image }),
        placeholder: slots.placeholder({ class: custom.placeholder }),
        previewMask: slots.previewMask({ class: custom.previewMask }),
        previewBody: slots.previewBody({ class: custom.previewBody }),
        previewImage: slots.previewImage({ class: custom.previewImage }),
      };
    },

    $rootStyle(data: ImageMiniData) {
      const baseStyle = normalizeStyleText(data.style);
      const width = toCssLength(data.width);
      const height = toCssLength(data.height);

      return `${baseStyle}${width ? `width:${width};` : ''}${height ? `height:${height};` : ''}`;
    },
  },

  methods: {
    noop() {
      return;
    },

    handleImageLoad() {
      this.setData({
        _isLoaded: true,
      } satisfies Partial<ImageMiniState>);
    },

    handleImageError() {
      this.setData({
        _hasError: true,
      } satisfies Partial<ImageMiniState>);
    },

    ensurePreviewMeta(src?: string) {
      const instance = this as ImageMiniInstance;
      ensurePreviewViewport(instance);

      const targetSrc = (
        typeof src === 'string' && src
          ? src
          : ((this.data.previewSrc || this.data.src) as string)
      ).trim();
      if (!targetSrc) {
        return;
      }

      wx.getImageInfo({
        src: targetSrc,
        success: (result) => {
          instance._previewImageWidth = Number(result.width ?? 0);
          instance._previewImageHeight = Number(result.height ?? 0);

          if (!this.data._previewVisible) {
            return;
          }

          const scale = clampPreviewScale(
            instance,
            Number(this.data._previewScale) || 1,
          );
          const currentX = Number(this.data._previewTranslateX) || 0;
          const currentY = Number(this.data._previewTranslateY) || 0;
          const nextOffset = clampPreviewTranslate(
            instance,
            currentX,
            currentY,
            scale,
          );

          this.setData({
            _previewTranslateX: nextOffset.x,
            _previewTranslateY: nextOffset.y,
          } satisfies Partial<ImageMiniState>);
        },
        fail: () => {
          return;
        },
      });
    },

    handlePreviewImageLoad(
      event: WechatMiniprogram.CustomEvent<{ width?: number; height?: number }>,
    ) {
      const instance = this as ImageMiniInstance;
      ensurePreviewViewport(instance);

      const width = Number(event.detail?.width ?? 0);
      const height = Number(event.detail?.height ?? 0);
      if (width > 0 && height > 0) {
        instance._previewImageWidth = width;
        instance._previewImageHeight = height;
      }

      const scale = clampPreviewScale(
        instance,
        Number(this.data._previewScale) || 1,
      );
      const currentX = Number(this.data._previewTranslateX) || 0;
      const currentY = Number(this.data._previewTranslateY) || 0;
      const nextOffset = clampPreviewTranslate(
        instance,
        currentX,
        currentY,
        scale,
      );

      this.setData({
        _previewTranslateX: nextOffset.x,
        _previewTranslateY: nextOffset.y,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewTap() {
      const data = this.data as ImageMiniData;
      if (!data.isPreviewable) {
        return;
      }

      const current = data.previewSrc || data.src;
      if (!current) {
        return;
      }

      this.setData(
        {
          _previewVisible: true,
          _previewScale: 1,
          _previewTranslateX: 0,
          _previewTranslateY: 0,
          _previewTransitionMs: 0,
        } satisfies Partial<ImageMiniState>,
        () => {
          this.ensurePreviewMeta(current);
        },
      );
    },

    handlePreviewClose() {
      const instance = this as ImageMiniInstance;
      if (instance._previewCloseTimer) {
        clearTimeout(instance._previewCloseTimer);
        instance._previewCloseTimer = undefined;
      }
      instance._previewLastTapAt = 0;
      instance._previewPinchStartDistance = 0;
      instance._previewPinchStartScale = 1;
      instance._previewIgnoreTapUntil = 0;
      instance._previewPanStartX = undefined;
      instance._previewPanStartY = undefined;
      instance._previewPanStartTranslateX = undefined;
      instance._previewPanStartTranslateY = undefined;
      instance._previewPanMoved = false;

      this.setData({
        _previewVisible: false,
        _previewScale: 1,
        _previewTranslateX: 0,
        _previewTranslateY: 0,
        _previewTransitionMs: 0,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewTouchStart(event: WechatMiniprogram.TouchEvent) {
      const data = this.data as ImageMiniData;
      if (!data._previewVisible) {
        return;
      }

      const instance = this as ImageMiniInstance;
      if (event.touches.length < 1) {
        return;
      }

      if (data._previewTransitionMs > 0) {
        this.setData({
          _previewTransitionMs: 0,
        } satisfies Partial<ImageMiniState>);
      }

      if (instance._previewCloseTimer) {
        clearTimeout(instance._previewCloseTimer);
        instance._previewCloseTimer = undefined;
      }

      if (event.touches.length >= 2) {
        instance._previewPinchStartDistance = getTouchDistance(event.touches);
        instance._previewPinchStartScale = data._previewScale;
        instance._previewPanStartX = undefined;
        instance._previewPanStartY = undefined;
        instance._previewPanMoved = false;
        instance._previewIgnoreTapUntil = Date.now() + PREVIEW_DOUBLE_TAP_MS;
        return;
      }

      if (data._previewScale <= PREVIEW_MIN_SCALE) {
        return;
      }

      const touchPoint = getTouchPoint(event.touches[0]);
      instance._previewPanStartX = touchPoint.x;
      instance._previewPanStartY = touchPoint.y;
      instance._previewPanStartTranslateX =
        Number(data._previewTranslateX) || 0;
      instance._previewPanStartTranslateY =
        Number(data._previewTranslateY) || 0;
      instance._previewPanMoved = false;
    },

    handlePreviewTouchMove(event: WechatMiniprogram.TouchEvent) {
      const instance = this as ImageMiniInstance;
      if (event.touches.length >= 2) {
        const startDistance = Number(instance._previewPinchStartDistance ?? 0);
        if (startDistance <= 0) {
          return;
        }

        const currentDistance = getTouchDistance(event.touches);
        const startScale = Number(instance._previewPinchStartScale ?? 1);
        const rawScale = (currentDistance / startDistance) * startScale;
        const maxScale = resolvePreviewMaxScale(instance);
        const nextScale = applyScaleResistance(
          rawScale,
          PREVIEW_MIN_SCALE,
          maxScale,
        );
        const currentX = Number(this.data._previewTranslateX) || 0;
        const currentY = Number(this.data._previewTranslateY) || 0;
        const nextOffset = clampPreviewTranslate(
          instance,
          currentX,
          currentY,
          nextScale,
        );

        this.setData({
          _previewScale: nextScale,
          _previewTranslateX: nextOffset.x,
          _previewTranslateY: nextOffset.y,
        } satisfies Partial<ImageMiniState>);
        return;
      }

      if (event.touches.length < 1) {
        return;
      }

      const scale = clampScaleMin(Number(this.data._previewScale) || 1);
      if (scale <= PREVIEW_MIN_SCALE) {
        return;
      }

      if (
        typeof instance._previewPanStartX !== 'number' ||
        typeof instance._previewPanStartY !== 'number'
      ) {
        return;
      }
      const startX = instance._previewPanStartX;
      const startY = instance._previewPanStartY;

      const touchPoint = getTouchPoint(event.touches[0]);
      const deltaX = touchPoint.x - startX;
      const deltaY = touchPoint.y - startY;
      if (
        Math.abs(deltaX) > PREVIEW_PAN_THRESHOLD ||
        Math.abs(deltaY) > PREVIEW_PAN_THRESHOLD
      ) {
        instance._previewPanMoved = true;
      }

      const startTranslateX = Number(instance._previewPanStartTranslateX ?? 0);
      const startTranslateY = Number(instance._previewPanStartTranslateY ?? 0);
      const nextOffset = clampPreviewTranslate(
        instance,
        startTranslateX + deltaX,
        startTranslateY + deltaY,
        scale,
      );
      this.setData({
        _previewTranslateX: nextOffset.x,
        _previewTranslateY: nextOffset.y,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewTouchEnd(event: WechatMiniprogram.TouchEvent) {
      if (event.touches.length >= 1) {
        return;
      }

      const instance = this as ImageMiniInstance;
      if (instance._previewPanMoved) {
        instance._previewIgnoreTapUntil = Date.now() + PREVIEW_DOUBLE_TAP_MS;
      }
      instance._previewPanStartX = undefined;
      instance._previewPanStartY = undefined;
      instance._previewPanStartTranslateX = undefined;
      instance._previewPanStartTranslateY = undefined;
      instance._previewPanMoved = false;
      instance._previewPinchStartDistance = 0;
      instance._previewPinchStartScale = this.data._previewScale;

      const currentScale = Number(this.data._previewScale) || 1;
      const maxScale = resolvePreviewMaxScale(instance);
      if (
        currentScale > maxScale + PREVIEW_SCALE_EPSILON ||
        currentScale < PREVIEW_MIN_SCALE - PREVIEW_SCALE_EPSILON
      ) {
        const targetScale = clampPreviewScale(instance, currentScale);
        const currentX = Number(this.data._previewTranslateX) || 0;
        const currentY = Number(this.data._previewTranslateY) || 0;
        const targetOffset = clampPreviewTranslate(
          instance,
          currentX,
          currentY,
          targetScale,
        );
        this.setData({
          _previewScale: targetScale,
          _previewTranslateX: targetOffset.x,
          _previewTranslateY: targetOffset.y,
          _previewTransitionMs: PREVIEW_PINCH_BOUNCE_MS,
        } satisfies Partial<ImageMiniState>);
      }
    },

    handlePreviewSurfaceTap(
      event: WechatMiniprogram.TouchEvent & {
        detail?: {
          x?: number;
          y?: number;
        };
      },
    ) {
      const data = this.data as ImageMiniData;
      if (!data._previewVisible) {
        return;
      }

      const instance = this as ImageMiniInstance;
      ensurePreviewViewport(instance);
      const now = Date.now();
      const ignoreUntil = Number(instance._previewIgnoreTapUntil ?? 0);
      if (ignoreUntil > now) {
        return;
      }

      if (instance._previewCloseTimer) {
        clearTimeout(instance._previewCloseTimer);
        instance._previewCloseTimer = undefined;
      }

      const lastTapAt = instance._previewLastTapAt ?? 0;
      instance._previewLastTapAt = now;
      if (now - lastTapAt > PREVIEW_DOUBLE_TAP_MS) {
        instance._previewCloseTimer = setTimeout(() => {
          instance._previewCloseTimer = undefined;
          this.handlePreviewClose();
        }, PREVIEW_DOUBLE_TAP_MS);
        return;
      }

      const currentScale = clampScaleMin(Number(data._previewScale) || 1);
      const currentTranslateX = Number(data._previewTranslateX) || 0;
      const currentTranslateY = Number(data._previewTranslateY) || 0;
      const viewportWidth = Number(instance._previewViewportWidth ?? 0);
      const viewportHeight = Number(instance._previewViewportHeight ?? 0);
      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;
      const tapX = Number(
        event.detail?.x ??
          event.changedTouches?.[0]?.pageX ??
          event.touches?.[0]?.pageX ??
          centerX,
      );
      const tapY = Number(
        event.detail?.y ??
          event.changedTouches?.[0]?.pageY ??
          event.touches?.[0]?.pageY ??
          centerY,
      );
      const resolvedTapX = Number.isFinite(tapX) ? tapX : centerX;
      const resolvedTapY = Number.isFinite(tapY) ? tapY : centerY;

      let nextScale = PREVIEW_MIN_SCALE;
      let nextTranslateX = 0;
      let nextTranslateY = 0;

      if (currentScale <= PREVIEW_MIN_SCALE + PREVIEW_SCALE_EPSILON) {
        const { baseHeight } = resolvePreviewBaseSize(instance);
        const targetScale =
          baseHeight < viewportHeight - 0.5
            ? viewportHeight / Math.max(1, baseHeight)
            : currentScale * 2;
        nextScale = clampPreviewScale(instance, targetScale);

        if (nextScale > PREVIEW_MIN_SCALE) {
          const ratio = nextScale / currentScale;
          const rawTranslateX =
            currentTranslateX * ratio + (resolvedTapX - centerX) * (1 - ratio);
          const rawTranslateY =
            currentTranslateY * ratio + (resolvedTapY - centerY) * (1 - ratio);
          const nextOffset = clampPreviewTranslate(
            instance,
            rawTranslateX,
            rawTranslateY,
            nextScale,
          );
          nextTranslateX = nextOffset.x;
          nextTranslateY = nextOffset.y;
        }
      }

      this.setData({
        _previewScale: nextScale,
        _previewTranslateX: nextTranslateX,
        _previewTranslateY: nextTranslateY,
        _previewTransitionMs: PREVIEW_DOUBLE_TAP_ZOOM_MS,
      } satisfies Partial<ImageMiniState>);

      instance._previewLastTapAt = 0;
      instance._previewIgnoreTapUntil = Date.now() + PREVIEW_DOUBLE_TAP_MS;
    },
  },
});

export { imageStyle } from '@srcube-ui/styles/components/image/style';
export type { ImageMiniProps } from './props';
export { imageMiniProps } from './props';
