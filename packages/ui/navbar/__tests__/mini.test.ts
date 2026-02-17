import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { navbarMiniProps } from '../src/mini/props';

it('contains start and end slots', () => {
  expect(template).toContain('slot name="start"');
  expect(template).toContain('slot name="end"');
});

it('accepts title in mini render data', () => {
  const id = simulate.load({
    template,
    properties: navbarMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    title: 'Mini Navbar',
  });

  const data = comp.data as { title?: string };
  expect(data.title).toBe('Mini Navbar');
});

it('uses true as default isBordered value', () => {
  expect(navbarMiniProps.isBordered.value).toBe(true);
});
