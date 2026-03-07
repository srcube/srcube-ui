import { imageStyle } from '@srcube-ui/styles/components/image/style';
import { UIComponent } from '../../shared/ui-component';
import { type ImageMiniProps, imageMiniProps } from './props';

type ImageMiniState = {
  _hasError: boolean;
  _isLoaded: boolean;
  _previewVisible: boolean;
  _previewScale: number;
  _previewCanMove: boolean;
  _previewX: number;
  _previewY: number;
};

type ImageMiniData = ImageMiniProps & ImageMiniState;
type ImageMiniInstance = WechatMiniprogram.Component.TrivialInstance & {
  _previewLastTapAt?: number;
};

const FIT_MODE_MAP: Record<string, WechatMiniprogram.Image['mode']> = {
  cover: 'aspectFill',
  contain: 'aspectFit',
  fill: 'scaleToFill',
  none: 'center',
};

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
    _previewCanMove: false as boolean,
    _previewX: 0,
    _previewY: 0,
  } satisfies ImageMiniState,

  observers: {
    src() {
      this.setData({
        _hasError: false,
        _isLoaded: false,
      } satisfies Partial<ImageMiniState>);
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

    $classNames(data: ImageMiniData) {
      const status =
        !data.src || data._hasError
          ? 'error'
          : data._isLoaded
            ? 'normal'
            : 'loading';
      const slots = imageStyle({
        size: data.size,
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
        previewClose: slots.previewClose({ class: custom.previewClose }),
      };
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

    handlePreviewTap() {
      const data = this.data as ImageMiniData;
      if (!data.isPreviewable) {
        return;
      }

      const current = data.previewSrc || data.src;
      if (!current) {
        return;
      }

      this.setData({
        _previewVisible: true,
        _previewScale: 1,
        _previewCanMove: false,
        _previewX: 0,
        _previewY: 0,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewClose() {
      this.setData({
        _previewVisible: false,
        _previewScale: 1,
        _previewCanMove: false,
        _previewX: 0,
        _previewY: 0,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewScaleChange(
      event: WechatMiniprogram.CustomEvent<{ scale?: number }>,
    ) {
      const rawScale = Number(event.detail?.scale ?? 1);
      const scale = Math.max(1, Math.min(4, rawScale));
      const canMove = scale > 1.02;
      this.setData({
        _previewScale: scale,
        _previewCanMove: canMove,
        _previewX: canMove ? this.data._previewX : 0,
        _previewY: canMove ? this.data._previewY : 0,
      } satisfies Partial<ImageMiniState>);
    },

    handlePreviewImageTap() {
      const data = this.data as ImageMiniData;
      if (!data._previewVisible) {
        return;
      }

      const instance = this as ImageMiniInstance;
      const now = Date.now();
      const lastTapAt = instance._previewLastTapAt ?? 0;
      instance._previewLastTapAt = now;
      if (now - lastTapAt > 300) {
        return;
      }

      const shouldZoomIn = data._previewScale < 1.5;
      const nextScale = shouldZoomIn ? 2 : 1;
      this.setData({
        _previewScale: nextScale,
        _previewCanMove: nextScale > 1.02,
        _previewX: 0,
        _previewY: 0,
      } satisfies Partial<ImageMiniState>);
    },
  },
});

export { imageStyle } from '@srcube-ui/styles/components/image/style';
export type { ImageMiniProps } from './props';
export { imageMiniProps } from './props';
