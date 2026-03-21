import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/collapse/index.wxml?raw';
import { collapseMiniProps } from '../../src/components/collapse/props';

it('contains trigger handler and panel style binding', () => {
  expect(template).toContain('bindtap="handleTriggerTap"');
  expect(template).toContain('style="{{$panelStyle}}"');
  expect(template).toContain('$classNames.iIndicator');
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

it('uses default as default tone', () => {
  expect(collapseMiniProps.tone.value).toBe('default');
});
