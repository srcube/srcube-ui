import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { cardMiniProps } from '../src/mini/props';

it('contains footer and header slots in mini template', () => {
  expect(template).toContain('name="footer"');
  expect(template).toContain('name="header"');
});

it('uses md as default radius', () => {
  expect(cardMiniProps.radius.value).toBe('md');
});

it('uses true as default bordered state', () => {
  expect(cardMiniProps.isBordered.value).toBe(true);
});
