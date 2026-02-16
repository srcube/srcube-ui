import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { stepperMiniProps } from '../src/mini/props';

it('contains buttons and input in mini template', () => {
  expect(template).toContain('<sr-field');
  expect(template).toContain('sr-button');
  expect(template).toContain('bindinput="handleInput"');
});

it('accepts className prop in mini render data', () => {
  const id = simulate.load({
    template,
    properties: stepperMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    className: 'mini-stepper',
    label: 'Step',
    value: 2,
  });

  const data = comp.data as { className?: string };
  expect(data.className).toBe('mini-stepper');
});

it('uses 1 as default step value', () => {
  expect(stepperMiniProps.step.value).toBe(1);
});
