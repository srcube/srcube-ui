import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { cascaderMiniProps } from '../src/mini/props';

it('contains picker composition in mini template', () => {
  expect(template).toContain('<sr-picker');
  expect(template).toContain(
    'bind:draftvaluechange="handlePickerDraftValueChange"',
  );
});

it('accepts options property definition', () => {
  expect(cascaderMiniProps.options.type).toBe(Array);
  expect(Array.isArray(cascaderMiniProps.options.value)).toBe(true);
});

it('uses outside as default label placement', () => {
  expect(cascaderMiniProps.labelPlacement.value).toBe('outside');
});
