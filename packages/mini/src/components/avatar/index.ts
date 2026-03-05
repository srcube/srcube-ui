import { UIComponent } from '../../shared/ui-component';
import {
  createAvatarFallbackSeed,
  getAvatarGradientGlowInlineStyle,
  getAvatarGradientOrbInlineStyle,
  getAvatarGradientTextInlineStyle,
  resolveAvatarFallbackStyle,
  resolveAvatarGradientTheme,
} from './fallback';
import { avatar } from '@srcube-ui/styles/components/avatar/style';
import { type AvatarMiniProps, avatarMiniProps } from './props';

type AvatarMiniState = {
  _hasError: boolean;
  _isImageLoaded: boolean;
};

type AvatarMiniData = AvatarMiniProps & AvatarMiniState;

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const words = String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

function resolveFallbackTheme(data: AvatarMiniData) {
  return resolveAvatarGradientTheme({
    fallbackTheme: data.fallbackTheme,
    seed: createAvatarFallbackSeed(
      data.fallbackSeed,
      data.name,
      data.alt,
      data.src,
      data.fallback,
      data.icon,
    ),
  });
}

UIComponent({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },

  properties:
    avatarMiniProps satisfies WechatMiniprogram.Component.PropertyOption,

  data: {
    _hasError: false,
    _isImageLoaded: false,
  } as AvatarMiniState,

  observers: {
    src() {
      this.setData({
        _hasError: false,
        _isImageLoaded: false,
      } satisfies Partial<AvatarMiniState>);
    },
  },

  computed: {
    $classNames(data: AvatarMiniData) {
      const slots = avatar({
        size: data.size,
        radius: data.radius,
        color: data.color,
        isBordered: Boolean(data.isBordered),
      });
      const custom = (data.classNames ?? {}) as Record<
        string,
        string | undefined
      >;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        image: slots.image({ class: custom.image }),
        fallback: slots.fallback({ class: custom.fallback }),
        fallbackOrb: slots.fallbackOrb({ class: custom.fallbackOrb }),
        fallbackGlow: slots.fallbackGlow({ class: custom.fallbackGlow }),
        fallbackHighlight: slots.fallbackHighlight({
          class: custom.fallbackHighlight,
        }),
        fallbackText: slots.fallbackText({ class: custom.fallbackText }),
      };
    },
    $showImage(data: AvatarMiniData) {
      return Boolean(data.src) && !data._hasError;
    },
    $isLoading(data: AvatarMiniData) {
      return Boolean(data.src) && !data._hasError && !data._isImageLoaded;
    },
    $skeletonClassNames(data: AvatarMiniData) {
      void data;
      return {
        // Force slot content to fill avatar box in mini program layout.
        content:
          'absolute inset-0 h-full w-full flex items-center justify-center',
      };
    },
    $fallbackText(data: AvatarMiniData) {
      return data.fallback || data.icon || getInitials(data.name) || '?';
    },
    $isGradientOrb(data: AvatarMiniData) {
      return resolveAvatarFallbackStyle(data.fallbackStyle) === 'gradient-orb';
    },
    $orbStyle(data: AvatarMiniData) {
      if (resolveAvatarFallbackStyle(data.fallbackStyle) !== 'gradient-orb') {
        return '';
      }
      return getAvatarGradientOrbInlineStyle(resolveFallbackTheme(data));
    },
    $orbGlowStyle(data: AvatarMiniData) {
      if (resolveAvatarFallbackStyle(data.fallbackStyle) !== 'gradient-orb') {
        return '';
      }
      return getAvatarGradientGlowInlineStyle(resolveFallbackTheme(data));
    },
    $fallbackTextStyle(data: AvatarMiniData) {
      if (resolveAvatarFallbackStyle(data.fallbackStyle) !== 'gradient-orb') {
        return '';
      }
      return getAvatarGradientTextInlineStyle();
    },
  },

  methods: {
    handleImageLoad() {
      this.setData({
        _isImageLoaded: true,
      } satisfies Partial<AvatarMiniState>);
    },
    handleImageError() {
      this.setData({
        _hasError: true,
        _isImageLoaded: true,
      } satisfies Partial<AvatarMiniState>);
    },
  },
});

export { avatar } from '@srcube-ui/styles/components/avatar/style';
export type { AvatarMiniProps } from './props';
export { avatarMiniProps } from './props';
