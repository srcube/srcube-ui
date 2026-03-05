import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/menu/index.wxml?raw';
import { menuMiniProps } from '../../src/components/menu/props';

it('contains trigger and item handlers', () => {
  expect(template).toContain('bindtap="handleTriggerTap"');
  expect(template).toContain('bindtap="handleItemTap"');
});

it('accepts items in mini render data', () => {
  const id = simulate.load({
    template,
    properties: menuMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    items: [{ value: 'delivery', label: '配送设置' }],
  });

  const data = comp.data as { items?: unknown[] };
  expect(Array.isArray(data.items)).toBe(true);
  expect(data.items?.[0]).toEqual({ value: 'delivery', label: '配送设置' });
});

it('uses y as default orientation', () => {
  expect(menuMiniProps.orientation.value).toBe('y');
});
