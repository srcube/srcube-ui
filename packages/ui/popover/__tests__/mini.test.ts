import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { popoverMiniProps } from '../src/mini/props';

it('contains trigger and backdrop handlers', () => {
  expect(template).toContain('bindtap="handleTriggerTap"');
  expect(template).toContain('bindtap="handleBackdropTap"');
});

it('accepts title in mini render data', () => {
  const id = simulate.load({
    template,
    properties: popoverMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    title: 'Popover Title',
  });

  const data = comp.data as { title?: string };
  expect(data.title).toBe('Popover Title');
});

it('uses bottom as default placement', () => {
  expect(popoverMiniProps.placement.value).toBe('bottom');
});
