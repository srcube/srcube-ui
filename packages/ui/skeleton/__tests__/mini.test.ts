import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { skeletonMiniProps } from '../src/mini/props';

it('contains content slot and placeholder node', () => {
  expect(template).toContain('<slot />');
  expect(template).toContain('sr-skeleton__placeholder');
});

it('accepts className prop in mini render data', () => {
  const id = simulate.load({
    template,
    properties: skeletonMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, { className: 'mini-skeleton' });
  comp.attach(document.body);

  const data = comp.data as { className?: string };
  expect(data.className).toBe('mini-skeleton');

  comp.detach();
});

it('uses false as default isLoaded value', () => {
  expect(skeletonMiniProps.isLoaded.value).toBe(false);
});
