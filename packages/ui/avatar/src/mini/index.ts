import { UIComponent } from '@srcube-ui/runtime/mini';
import { avatar } from '../style';
import { avatarMiniProps, type AvatarMiniProps } from './props';

type AvatarMiniState = {
  _hasError: boolean;
};

type AvatarMiniData = AvatarMiniProps & AvatarMiniState;

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const words = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
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
  } satisfies AvatarMiniState,

  observers: {
    src() {
      this.setData({
        _hasError: false,
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
      const custom = (data.classNames ?? {}) as Record<string, string | undefined>;

      return {
        base: slots.base({ class: [custom.base, data.className] }),
        image: slots.image({ class: custom.image }),
        fallback: slots.fallback({ class: custom.fallback }),
      };
    },
    $showImage(data: AvatarMiniData) {
      return Boolean(data.src) && !data._hasError;
    },
    $fallbackText(data: AvatarMiniData) {
      return data.icon || getInitials(data.name) || '?';
    },
  },

  methods: {
    handleImageError() {
      this.setData({
        _hasError: true,
      } satisfies Partial<AvatarMiniState>);
    },
  },
});

export { avatar } from '../style';
export type { AvatarMiniProps } from './props';
export { avatarMiniProps } from './props';
