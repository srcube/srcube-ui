import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { stepsMiniProps } from '../src/mini/props';

it('contains list render loop in template', () => {
  expect(template).toContain('wx:for="{{$renderItems}}"');
});

it('uses horizontal as default direction', () => {
  expect(stepsMiniProps.direction.value).toBe('horizontal');
});

it('uses false as default isDot', () => {
  expect(stepsMiniProps.isDot.value).toBe(false);
});
