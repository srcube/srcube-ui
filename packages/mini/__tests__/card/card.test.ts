import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/card/index.wxml?raw';
import { cardMiniProps } from '../../src/components/card/props';

it('contains footer and header slots in mini template', () => {
  expect(template).toContain('name="footer"');
  expect(template).toContain('name="header"');
  expect(template).toContain('name="body"');
});

it('uses md as default radius', () => {
  expect(cardMiniProps.radius.value).toBe('md');
});

it('uses default as default color', () => {
  expect(cardMiniProps.color.value).toBe('default');
});

it('uses default as default tone', () => {
  expect(cardMiniProps.tone.value).toBe('default');
});
