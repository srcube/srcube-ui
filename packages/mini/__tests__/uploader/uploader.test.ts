import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for template assertions
import template from '../../src/components/uploader/index.wxml?raw';
import { uploaderMiniProps } from '../../src/components/uploader/props';

it('contains uploader item loop in template', () => {
  expect(template).toContain('wx:for="{{$resolvedValue}}"');
});

it('contains add tap handler in template', () => {
  expect(template).toContain('bindtap="handleAddTap"');
});

it('uses default maxCount as 9', () => {
  expect(uploaderMiniProps.maxCount.value).toBe(9);
});

it('uses default tone as default', () => {
  expect(uploaderMiniProps.tone.value).toBe('default');
});
