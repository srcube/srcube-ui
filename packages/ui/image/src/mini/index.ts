import { UIComponent } from '@srcube-ui/runtime/mini';
import { imageStyle } from '../style';
import { imageMiniProps, type ImageMiniProps } from './props';

type ImageMiniState = {
  _hasError: boolean;
  _isLoaded: boolean;
};

type ImageMiniData = ImageMiniProps & ImageMiniState;

const FIT_MODE_MAP: Record<string, WechatMiniprogram.Image.Mode> = {
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

  properties: imageMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _hasError: false,
    _isLoaded: false,
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
      const status = !data.src || data._hasError
        ? 'error'
        : (data._isLoaded ? 'normal' : 'loading');

      if (status === 'loading') {
        return data.loadingText || 'Loading...';
      }

      return data.fallback || 'Image unavailable';
    },

    $imageMode(data: ImageMiniData) {
      return FIT_MODE_MAP[String(data.fit ?? 'cover')] ?? 'aspectFill';
    },

    $classNames(data: ImageMiniData) {
      const status = !data.src || data._hasError
        ? 'error'
        : (data._isLoaded ? 'normal' : 'loading');
      const slots = imageStyle({
        size: data.size,
        radius: data.radius,
        fit: data.fit,
        ratio: data.ratio,
        isBlock: Boolean(data.isBlock),
        status,
        isPreviewable: Boolean(data.isPreviewable),
      });
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        image: slots.image({ class: custom.image }),
        placeholder: slots.placeholder({ class: custom.placeholder }),
      };
    },
  },

  methods: {
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

      const rawUrls = Array.isArray(data.previewUrls)
        ? data.previewUrls
        : [];
      const urls = rawUrls
        .filter(
          (item): item is string =>
            typeof item === 'string' && item.trim().length > 0,
        );

      wx.previewImage({
        current,
        urls: urls.length > 0 ? urls : [current],
      });
    },
  },
});

export { imageStyle } from '../style';
export type { ImageMiniProps } from './props';
export { imageMiniProps } from './props';
