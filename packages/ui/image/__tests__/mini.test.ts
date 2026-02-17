import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { imageMiniProps } from '../src/mini/props';

it('contains preview tap handler in template', () => {
  expect(template).toContain('bindtap="handlePreviewTap"');
});

it('keeps preview disabled by default', () => {
  expect(imageMiniProps.isPreviewable.value).toBe(false);
});

it('uses md as default radius', () => {
  expect(imageMiniProps.radius.value).toBe('md');
});
