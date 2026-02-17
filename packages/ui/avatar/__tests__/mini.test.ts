import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { avatarMiniProps } from '../src/mini/props';

it('contains image error handler in template', () => {
  expect(template).toContain('binderror="handleImageError"');
});

it('accepts name in mini render data', () => {
  const id = simulate.load({
    template,
    properties: avatarMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    name: 'Mini User',
  });

  const data = comp.data as { name?: string };
  expect(data.name).toBe('Mini User');
});

it('uses full as default radius', () => {
  expect(avatarMiniProps.radius.value).toBe('full');
});
