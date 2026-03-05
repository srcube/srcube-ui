import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/timeline/index.wxml?raw';
import { timelineMiniProps } from '../../src/components/timeline/props';

it('contains list loop in template', () => {
  expect(template).toContain('wx:for="{{$renderItems}}"');
});

it('uses solid line style by default', () => {
  expect(timelineMiniProps.lineStyle.value).toBe('solid');
});

it('uses default color by default', () => {
  expect(timelineMiniProps.color.value).toBe('default');
});
