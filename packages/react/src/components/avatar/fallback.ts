export const AVATAR_GRADIENT_ORB_THEMES = {
  blue: {
    orbBackground:
      'radial-gradient(122% 122% at 14% 12%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.2) 34%, rgba(255,255,255,0) 60%), radial-gradient(82% 78% at 86% 18%, rgba(45,212,191,0.84) 0%, rgba(56,189,248,0.78) 36%, rgba(59,130,246,0.72) 58%, rgba(147,51,234,0.38) 82%, rgba(15,23,42,0) 100%), radial-gradient(124% 124% at 48% 88%, rgba(14,165,233,0.88) 0%, rgba(37,99,235,0.92) 52%, rgba(49,46,129,0.94) 100%)',
    glowBackground:
      'radial-gradient(80% 80% at 74% 24%, rgba(186,230,253,0.78) 0%, rgba(56,189,248,0.34) 52%, rgba(147,51,234,0.24) 74%, rgba(15,23,42,0) 100%)',
  },
  purple: {
    orbBackground:
      'radial-gradient(124% 124% at 16% 10%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.18) 34%, rgba(255,255,255,0) 62%), radial-gradient(84% 80% at 88% 18%, rgba(244,114,182,0.84) 0%, rgba(217,70,239,0.74) 34%, rgba(147,51,234,0.72) 58%, rgba(79,70,229,0.46) 82%, rgba(15,23,42,0) 100%), radial-gradient(126% 126% at 44% 88%, rgba(196,181,253,0.82) 0%, rgba(139,92,246,0.88) 44%, rgba(91,33,182,0.94) 100%)',
    glowBackground:
      'radial-gradient(80% 80% at 72% 24%, rgba(251,207,232,0.78) 0%, rgba(192,132,252,0.34) 54%, rgba(79,70,229,0.2) 78%, rgba(15,23,42,0) 100%)',
  },
  coral: {
    orbBackground:
      'radial-gradient(124% 124% at 14% 10%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.22) 34%, rgba(255,255,255,0) 62%), radial-gradient(84% 80% at 86% 20%, rgba(254,202,21,0.78) 0%, rgba(251,146,60,0.74) 34%, rgba(239,68,68,0.7) 58%, rgba(244,63,94,0.44) 84%, rgba(15,23,42,0) 100%), radial-gradient(126% 126% at 46% 88%, rgba(254,215,170,0.8) 0%, rgba(249,115,22,0.86) 42%, rgba(190,24,93,0.92) 100%)',
    glowBackground:
      'radial-gradient(80% 80% at 72% 22%, rgba(254,240,138,0.76) 0%, rgba(251,146,60,0.34) 52%, rgba(244,63,94,0.24) 76%, rgba(15,23,42,0) 100%)',
  },
  mixed: {
    orbBackground:
      'radial-gradient(124% 124% at 14% 10%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.2) 34%, rgba(255,255,255,0) 62%), radial-gradient(86% 82% at 88% 20%, rgba(34,211,238,0.82) 0%, rgba(59,130,246,0.72) 30%, rgba(168,85,247,0.66) 54%, rgba(236,72,153,0.46) 78%, rgba(15,23,42,0) 100%), radial-gradient(128% 126% at 44% 90%, rgba(253,224,71,0.68) 0%, rgba(244,114,182,0.72) 28%, rgba(56,189,248,0.72) 52%, rgba(126,34,206,0.9) 74%, rgba(30,41,59,0.96) 100%)',
    glowBackground:
      'radial-gradient(82% 82% at 72% 24%, rgba(253,186,116,0.72) 0%, rgba(196,181,253,0.36) 48%, rgba(125,211,252,0.28) 70%, rgba(15,23,42,0) 100%)',
  },
  emerald: {
    orbBackground:
      'radial-gradient(124% 124% at 16% 12%, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.2) 34%, rgba(255,255,255,0) 62%), radial-gradient(82% 80% at 86% 20%, rgba(134,239,172,0.82) 0%, rgba(52,211,153,0.76) 30%, rgba(16,185,129,0.7) 52%, rgba(45,212,191,0.42) 78%, rgba(15,23,42,0) 100%), radial-gradient(126% 124% at 48% 90%, rgba(253,230,138,0.66) 0%, rgba(110,231,183,0.7) 28%, rgba(20,184,166,0.78) 56%, rgba(5,120,87,0.92) 100%)',
    glowBackground:
      'radial-gradient(82% 82% at 72% 24%, rgba(187,247,208,0.74) 0%, rgba(52,211,153,0.34) 50%, rgba(45,212,191,0.24) 74%, rgba(15,23,42,0) 100%)',
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
  textShadow: 'none',
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
