export const AVATAR_GRADIENT_ORB_THEMES = {
  blue: {
    orbBackground:
      'radial-gradient(130% 130% at 18% 12%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 58%), radial-gradient(88% 86% at 82% 24%, rgba(56,189,248,0.92) 0%, rgba(59,130,246,0.8) 42%, rgba(67,56,202,0.38) 74%, rgba(15,23,42,0) 100%), radial-gradient(120% 120% at 50% 86%, rgba(59,130,246,0.9) 0%, rgba(30,64,175,0.96) 72%, rgba(15,23,42,0.96) 100%)',
    glowBackground:
      'radial-gradient(76% 76% at 70% 24%, rgba(125,211,252,0.78) 0%, rgba(59,130,246,0.28) 58%, rgba(15,23,42,0) 100%)',
  },
  purple: {
    orbBackground:
      'radial-gradient(130% 130% at 20% 12%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.18) 32%, rgba(255,255,255,0) 58%), radial-gradient(86% 86% at 82% 24%, rgba(167,139,250,0.9) 0%, rgba(147,51,234,0.76) 46%, rgba(79,70,229,0.42) 76%, rgba(15,23,42,0) 100%), radial-gradient(124% 124% at 50% 86%, rgba(216,180,254,0.74) 0%, rgba(109,40,217,0.92) 70%, rgba(46,16,101,0.95) 100%)',
    glowBackground:
      'radial-gradient(76% 76% at 72% 24%, rgba(216,180,254,0.8) 0%, rgba(167,139,250,0.28) 60%, rgba(15,23,42,0) 100%)',
  },
  coral: {
    orbBackground:
      'radial-gradient(130% 130% at 18% 10%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.2) 34%, rgba(255,255,255,0) 58%), radial-gradient(88% 90% at 84% 24%, rgba(251,113,133,0.9) 0%, rgba(244,63,94,0.72) 44%, rgba(249,115,22,0.44) 76%, rgba(15,23,42,0) 100%), radial-gradient(128% 126% at 48% 86%, rgba(253,186,116,0.72) 0%, rgba(239,68,68,0.88) 66%, rgba(127,29,29,0.95) 100%)',
    glowBackground:
      'radial-gradient(76% 76% at 74% 24%, rgba(254,205,211,0.84) 0%, rgba(251,146,60,0.3) 56%, rgba(15,23,42,0) 100%)',
  },
  mixed: {
    orbBackground:
      'radial-gradient(128% 128% at 18% 12%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 58%), radial-gradient(76% 82% at 82% 20%, rgba(96,165,250,0.88) 0%, rgba(129,140,248,0.7) 40%, rgba(236,72,153,0.4) 70%, rgba(15,23,42,0) 100%), radial-gradient(108% 118% at 46% 88%, rgba(244,114,182,0.7) 0%, rgba(59,130,246,0.66) 38%, rgba(109,40,217,0.9) 68%, rgba(30,41,59,0.96) 100%)',
    glowBackground:
      'radial-gradient(76% 76% at 70% 24%, rgba(196,181,253,0.78) 0%, rgba(125,211,252,0.28) 58%, rgba(15,23,42,0) 100%)',
  },
  emerald: {
    orbBackground:
      'radial-gradient(128% 128% at 20% 10%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.2) 32%, rgba(255,255,255,0) 58%), radial-gradient(84% 86% at 82% 24%, rgba(110,231,183,0.86) 0%, rgba(16,185,129,0.72) 42%, rgba(6,95,70,0.42) 76%, rgba(15,23,42,0) 100%), radial-gradient(124% 124% at 50% 86%, rgba(167,243,208,0.66) 0%, rgba(5,150,105,0.88) 66%, rgba(6,78,59,0.95) 100%)',
    glowBackground:
      'radial-gradient(76% 76% at 72% 24%, rgba(167,243,208,0.78) 0%, rgba(16,185,129,0.28) 58%, rgba(15,23,42,0) 100%)',
  },
} as const;

const AVATAR_GRADIENT_THEME_KEYS = Object.keys(
  AVATAR_GRADIENT_ORB_THEMES,
) as Array<AvatarGradientOrbTheme>;

export type AvatarGradientOrbTheme = keyof typeof AVATAR_GRADIENT_ORB_THEMES;
export type AvatarFallbackTheme = 'auto' | AvatarGradientOrbTheme;
export type AvatarFallbackStyle = 'gradient-orb' | 'solid';

const GRADIENT_TEXT_STYLE = {
  color: 'rgba(248, 250, 252, 0.96)',
  textShadow: '0 1px 2px rgba(15, 23, 42, 0.5)',
} as const;

function normalizeSeedValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
}

export function createAvatarFallbackSeed(
  ...candidates: Array<string | number | null | undefined>
) {
  for (const candidate of candidates) {
    const normalized = normalizeSeedValue(candidate);
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function isGradientOrbTheme(value: string): value is AvatarGradientOrbTheme {
  return AVATAR_GRADIENT_THEME_KEYS.includes(value as AvatarGradientOrbTheme);
}

export function resolveAvatarFallbackStyle(
  fallbackStyle?: string | null,
): AvatarFallbackStyle {
  return fallbackStyle === 'solid' ? 'solid' : 'gradient-orb';
}

export function resolveAvatarGradientTheme(params: {
  fallbackTheme?: string | null;
  seed?: string | number | null;
}): AvatarGradientOrbTheme {
  const theme = normalizeSeedValue(params.fallbackTheme);
  if (theme && theme !== 'auto' && isGradientOrbTheme(theme)) {
    return theme;
  }

  const seed = normalizeSeedValue(params.seed);
  if (!seed) {
    return 'mixed';
  }

  const index = hashString(seed) % AVATAR_GRADIENT_THEME_KEYS.length;
  return AVATAR_GRADIENT_THEME_KEYS[index] ?? 'mixed';
}

export function getAvatarGradientLayerStyles(theme: AvatarGradientOrbTheme) {
  const resolvedTheme = AVATAR_GRADIENT_ORB_THEMES[theme];
  return {
    orb: {
      backgroundImage: resolvedTheme.orbBackground,
    },
    glow: {
      backgroundImage: resolvedTheme.glowBackground,
    },
  };
}

export function getAvatarGradientOrbInlineStyle(theme: AvatarGradientOrbTheme) {
  return `background-image: ${AVATAR_GRADIENT_ORB_THEMES[theme].orbBackground};`;
}

export function getAvatarGradientGlowInlineStyle(
  theme: AvatarGradientOrbTheme,
) {
  return `background-image: ${AVATAR_GRADIENT_ORB_THEMES[theme].glowBackground};`;
}

export function getAvatarGradientTextStyle() {
  return GRADIENT_TEXT_STYLE;
}

export function getAvatarGradientTextInlineStyle() {
  return `color: ${GRADIENT_TEXT_STYLE.color}; text-shadow: ${GRADIENT_TEXT_STYLE.textShadow};`;
}
