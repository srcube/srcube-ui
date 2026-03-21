import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/steps/index.wxml?raw';
import { stepsMiniProps } from '../../src/components/steps/props';

it('contains list render loop in template', () => {
  expect(template).toContain('wx:for="{{$renderItems}}"');
  expect(template).toContain('item.isStatusIcon');
  expect(template).toContain('item.iconText');
  expect(template).toContain('item.classes.indicatorIcon');
});

it('uses x as default orientation', () => {
  expect(stepsMiniProps.orientation.value).toBe('x');
});

it('uses false as default isDot', () => {
  expect(stepsMiniProps.isDot.value).toBe(false);
});

it('uses primary as default color', () => {
  expect(stepsMiniProps.color.value).toBe('primary');
});

it('uses default as default tone', () => {
  expect(stepsMiniProps.tone.value).toBe('default');
});

it('uses solid as default variant', () => {
  expect(stepsMiniProps.variant.value).toBe('solid');
});
