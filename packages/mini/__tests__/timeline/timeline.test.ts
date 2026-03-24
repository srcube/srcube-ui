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

it('supports icon class payload in template', () => {
  expect(template).toContain('item.iconClass || item.iconText');
  expect(template).toContain('{{item.iconClass}}');
});

it('renders a content spacer in template', () => {
  expect(template).toContain('sr-timeline__content-spacer');
  expect(template).toContain('item.classes.contentSpacer');
  expect(template).toContain('item.spacerStyle');
});
