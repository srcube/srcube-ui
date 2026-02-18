import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { navbarMiniProps } from '../src/mini/props';

it('contains start and end slots', () => {
  expect(template).toContain('slot name="start"');
  expect(template).toContain('slot name="end"');
});

it('contains default back icon fallback in start slot', () => {
  expect(template).toContain('wx:if="{{withBack}}"');
  expect(template).toContain('$classNames.backIcon');
  expect(template).toContain('handleBackTap');
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

it('uses center as default titleAlign value', () => {
  expect(navbarMiniProps.titleAlign.value).toBe('center');
});

it('uses false as default withBack value', () => {
  expect(navbarMiniProps.withBack.value).toBe(false);
});
