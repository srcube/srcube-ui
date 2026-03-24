import { describe, expect, it } from 'vitest';
import {
  normalizeColorString,
  pickReadableForeground,
  resolveBackgroundFromQuery,
} from '../../../../apps/sample-weapp/src/components/contrastbox/utils';

describe('contrastbox utils', () => {
  it('normalizes hex and rgb strings', () => {
    expect(normalizeColorString('#0284c7')).toEqual({ r: 2, g: 132, b: 199 });
    expect(normalizeColorString('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(normalizeColorString('rgb(2, 132, 199)')).toEqual({ r: 2, g: 132, b: 199 });
    expect(normalizeColorString('rgba(255, 251, 235, 1)')).toEqual({ r: 255, g: 251, b: 235 });
  });

  it('resolves background from query result shape', () => {
    expect(resolveBackgroundFromQuery({ backgroundColor: 'rgb(2, 132, 199)' })).toBe('rgb(2, 132, 199)');
    expect(resolveBackgroundFromQuery({ 'background-color': 'rgb(245, 158, 11)' })).toBe('rgb(245, 158, 11)');
    expect(resolveBackgroundFromQuery({ computedStyle: { backgroundColor: 'rgb(255, 251, 235)' } })).toBe('rgb(255, 251, 235)');
    expect(resolveBackgroundFromQuery({ computedStyle: { 'background-color': 'rgb(2, 132, 199)' } })).toBe('rgb(2, 132, 199)');
    expect(resolveBackgroundFromQuery(null)).toBe('');
  });

  it('picks readable foreground for light and dark backgrounds', () => {
    expect(pickReadableForeground('rgb(255, 251, 235)')).toBe('#000000');
    expect(pickReadableForeground('#0284c7')).toBe('#000000');
    expect(pickReadableForeground('rgb(2, 132, 199)')).toBe('#000000');
    expect(pickReadableForeground('#020617')).toBe('#ffffff');
  });
});
