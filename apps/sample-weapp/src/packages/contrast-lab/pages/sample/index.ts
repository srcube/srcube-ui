import { attachSampleTone, detachSampleTone } from '../../../../shared/sample-theme-page';
import type { SampleTone } from '../../../../shared/sample-theme';

type ContrastText = '#000000' | '#ffffff';

type SwatchItem = {
  id: string;
  family: string;
  step: string;
  label: string;
  value: string;
  textColor: ContrastText;
  luminance: string;
  contrastBlack: string;
  contrastWhite: string;
};

const TAILWIND_SWATCHES = {
  slate: {
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#020617',
  },
  zinc: {
    '50': '#fafafa',
    '100': '#f4f4f5',
    '200': '#e4e4e7',
    '300': '#d4d4d8',
    '400': '#a1a1aa',
    '500': '#71717a',
    '600': '#52525b',
    '700': '#3f3f46',
    '800': '#27272a',
    '900': '#18181b',
    '950': '#09090b',
  },
  sky: {
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
    '950': '#082f49',
  },
  cyan: {
    '50': '#ecfeff',
    '100': '#cffafe',
    '200': '#a5f3fc',
    '300': '#67e8f9',
    '400': '#22d3ee',
    '500': '#06b6d4',
    '600': '#0891b2',
    '700': '#0e7490',
    '800': '#155e75',
    '900': '#164e63',
    '950': '#083344',
  },
  green: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
  },
  amber: {
    '50': '#fffbeb',
    '100': '#fef3c7',
    '200': '#fde68a',
    '300': '#fcd34d',
    '400': '#fbbf24',
    '500': '#f59e0b',
    '600': '#d97706',
    '700': '#b45309',
    '800': '#92400e',
    '900': '#78350f',
    '950': '#451a03',
  },
  red: {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
  },
} as const;

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function srgbToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickReadableText(hex: string): ContrastText {
  const luminance = getRelativeLuminance(hex);
  if (luminance == null) return '#ffffff';

  const contrastBlack = getContrastRatio(luminance, 0);
  const contrastWhite = getContrastRatio(luminance, 1);

  return contrastBlack >= contrastWhite ? '#000000' : '#ffffff';
}

function formatFixed(value: number | null, digits = 3) {
  return value == null ? '--' : value.toFixed(digits);
}

function buildSwatch(family: string, step: string, value: string): SwatchItem {
  const luminance = getRelativeLuminance(value);
  const contrastBlack = luminance == null ? null : getContrastRatio(luminance, 0);
  const contrastWhite = luminance == null ? null : getContrastRatio(luminance, 1);
  const textColor = pickReadableText(value);

  return {
    id: `${family}-${step}`,
    family,
    step,
    label: `${family}-${step}`,
    value,
    textColor,
    luminance: formatFixed(luminance),
    contrastBlack: formatFixed(contrastBlack, 2),
    contrastWhite: formatFixed(contrastWhite, 2),
  };
}

const SWATCH_GROUPS = Object.entries(TAILWIND_SWATCHES).map(([family, shades]) => ({
  family,
  title: family,
  items: Object.entries(shades).map(([step, value]) => buildSwatch(family, step, value)),
}));

const DEFAULT_SELECTED = buildSwatch('sky', '600', TAILWIND_SWATCHES.sky['600']);

Page({
  data: {
    tone: 'default' as SampleTone,
    cardClassName: 'rounded-2xl bg-white p-4 text-slate-900 shadow-sm',
    hintClassName: 'mt-1 text-xs text-slate-500',
    selectedId: DEFAULT_SELECTED.id,
    selectedLabel: DEFAULT_SELECTED.label,
    selectedColor: DEFAULT_SELECTED.value,
    selectedTextColor: DEFAULT_SELECTED.textColor,
    selectedLuminance: DEFAULT_SELECTED.luminance,
    selectedContrastBlack: DEFAULT_SELECTED.contrastBlack,
    selectedContrastWhite: DEFAULT_SELECTED.contrastWhite,
    swatchGroups: SWATCH_GROUPS,
  },

  _unsubscribeTone: null as null | (() => void),

  applyTone(tone: SampleTone) {
    this.setData({
      tone,
      cardClassName:
        tone === 'dark'
          ? 'rounded-2xl border border-zinc-700 bg-black p-4 text-zinc-50 shadow-sm shadow-black/30'
          : 'rounded-2xl bg-white p-4 text-slate-900 shadow-sm',
      hintClassName:
        tone === 'dark' ? 'mt-1 text-xs text-zinc-400' : 'mt-1 text-xs text-slate-500',
    });
  },

  onLoad() {
    attachSampleTone(this);
  },

  onUnload() {
    detachSampleTone(this);
  },

  handleSelectSwatch(e: WechatMiniprogram.TouchEvent) {
    const { family, step } = e.currentTarget.dataset as { family?: string; step?: string };
    if (!family || !step) return;

    const group = TAILWIND_SWATCHES[family as keyof typeof TAILWIND_SWATCHES];
    const value = group?.[step as keyof typeof group];
    if (!value) return;

    const swatch = buildSwatch(family, step, value);
    this.setData({
      selectedId: swatch.id,
      selectedLabel: swatch.label,
      selectedColor: swatch.value,
      selectedTextColor: swatch.textColor,
      selectedLuminance: swatch.luminance,
      selectedContrastBlack: swatch.contrastBlack,
      selectedContrastWhite: swatch.contrastWhite,
    });
  },
});
