export type ForegroundHex = '#000000' | '#ffffff';

export function normalizeColorString(input?: string): { r: number; g: number; b: number } | null {
  if (!input) return null;
  const value = input.trim().toLowerCase();

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      const parsed = Number.parseInt(hex, 16);
      return {
        r: (parsed >> 16) & 255,
        g: (parsed >> 8) & 255,
        b: parsed & 255,
      };
    }
  }

  const rgbMatch = value.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const parts = rgbMatch[1]
      .split(',')
      .map((part) => Number.parseFloat(part.trim()))
      .filter((part) => Number.isFinite(part));
    if (parts.length >= 3) {
      return { r: parts[0], g: parts[1], b: parts[2] };
    }
  }

  return null;
}

export function resolveBackgroundFromQuery(node?: Record<string, any> | null): string {
  if (!node) return '';
  const computed = node.computedStyle || {};
  return (
    node.backgroundColor ||
    node['background-color'] ||
    computed.backgroundColor ||
    computed['background-color'] ||
    ''
  );
}

function srgbToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function getRelativeLuminance(rgb: { r: number; g: number; b: number }) {
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

export function pickReadableForeground(color?: string): ForegroundHex {
  const rgb = normalizeColorString(color);
  if (!rgb) return '#ffffff';
  const luminance = getRelativeLuminance(rgb);
  const contrastBlack = getContrastRatio(luminance, 0);
  const contrastWhite = getContrastRatio(luminance, 1);
  return contrastBlack >= contrastWhite ? '#000000' : '#ffffff';
}
