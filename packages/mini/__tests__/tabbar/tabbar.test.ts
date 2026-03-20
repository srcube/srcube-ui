import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/tabbar/index.wxml?raw';
import { tabbarMiniProps } from '../../src/components/tabbar/props';

it('contains list render and tap binding', () => {
  expect(template).toContain('wx:for="{{$renderItems}}"');
  expect(template).toContain('bindtap="handleItemTap"');
  expect(template).toContain('item.hasBadge');
  expect(template).toContain('item.badgeIsDot');
  expect(template).toContain('item.badgeText');
});

it('uses true as default isBordered value', () => {
  expect(tabbarMiniProps.isBordered.value).toBe(true);
});

it('uses default as default tone value', () => {
  expect(tabbarMiniProps.tone.value).toBe('default');
});
