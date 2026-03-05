import type { AvatarFallbackStyle, AvatarFallbackTheme } from './fallback';
import type { AvatarMiniClassNames, AvatarVariants } from '@srcube-ui/styles/components/avatar/style';

export type AvatarMiniProps = AvatarVariants & {
  src?: string;
  alt?: string;
  name?: string;
  icon?: string;
  fallback?: string;
  fallbackStyle?: AvatarFallbackStyle;
  fallbackTheme?: AvatarFallbackTheme;
  fallbackSeed?: string | number;
  className?: string;
  classNames?: Partial<AvatarMiniClassNames>;
  style?: string;
};

export const avatarMiniProps = {
  src: { type: String, value: '' },
  alt: { type: String, value: '' },
  name: { type: String, value: '' },
  icon: { type: String, value: '' },
  fallback: { type: String, value: '' },
  fallbackStyle: { type: String, value: 'gradient-orb' },
  fallbackTheme: { type: String, value: 'auto' },
  fallbackSeed: { type: null, value: '' },
  size: { type: null, value: 'md' },
  radius: { type: null, value: 'full' },
  color: { type: null, value: 'default' },
  isBordered: { type: Boolean, value: false },
  className: { type: String, value: '' },
  classNames: { type: Object, value: {} },
  style: { type: String, value: '' },
} as const;
