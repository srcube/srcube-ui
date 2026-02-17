import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { actionSheetMiniProps } from '../src/mini/props';

it('contains overlay and action handlers', () => {
  expect(template).toContain('bindtap="handleOverlayTap"');
  expect(template).toContain('bindtap="handleActionTap"');
  expect(template).toContain('bindtap="handleCancelTap"');
});

it('accepts actions in mini render data', () => {
  const id = simulate.load({
    template,
    properties: actionSheetMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    actions: [{ value: 'edit', label: '编辑' }],
  });

  const data = comp.data as { actions?: unknown[] };
  expect(Array.isArray(data.actions)).toBe(true);
  expect(data.actions?.length).toBe(1);
});

it('uses true as default isClosable value', () => {
  expect(actionSheetMiniProps.isClosable.value).toBe(true);
});
