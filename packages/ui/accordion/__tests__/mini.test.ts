import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { accordionMiniProps } from '../src/mini/props';

it('contains item loop and toggle binding', () => {
  expect(template).toContain('wx:for="{{$renderItems}}"');
  expect(template).toContain('bindtap="handleItemTap"');
});

it('accepts items in mini render data', () => {
  const id = simulate.load({
    template,
    properties: accordionMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    items: [{ value: 'a', title: 'A', content: 'Content A' }],
  });

  const data = comp.data as { items?: unknown[] };
  expect(Array.isArray(data.items)).toBe(true);
  expect(data.items?.length).toBe(1);
});

it('uses single as default selection mode', () => {
  expect(accordionMiniProps.selectionMode.value).toBe('single');
});
