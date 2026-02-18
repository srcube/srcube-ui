import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { calendarMiniProps } from '../src/mini/props';

it('contains day tap handler in template', () => {
  expect(template).toContain('bindtap="handleDayTap"');
});

it('uses single mode by default', () => {
  expect(calendarMiniProps.mode.value).toBe('single');
});

it('uses weekStartsOn zero by default', () => {
  expect(calendarMiniProps.weekStartsOn.value).toBe(0);
});
