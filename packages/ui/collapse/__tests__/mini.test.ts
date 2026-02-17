import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { collapseMiniProps } from '../src/mini/props';

it('contains trigger handler and panel condition', () => {
  expect(template).toContain('bindtap="handleTriggerTap"');
  expect(template).toContain('wx:if="{{$isExpanded}}"');
});

it('accepts title in mini render data', () => {
  const id = simulate.load({
    template,
    properties: collapseMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    title: 'Collapse Title',
  });

  const data = comp.data as { title?: string };
  expect(data.title).toBe('Collapse Title');
});

it('uses false as defaultValue', () => {
  expect(collapseMiniProps.defaultValue.value).toBe(false);
});
