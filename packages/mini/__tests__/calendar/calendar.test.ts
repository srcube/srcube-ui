import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/calendar/index.wxml?raw';
import { calendarMiniProps } from '../../src/components/calendar/props';

it('contains day tap handler in template', () => {
  expect(template).toContain('bindtap="handleDayTap"');
});

it('contains year month pickbox panel in template', () => {
  expect(template).toContain('<sr-pickbox');
  expect(template).toContain('bind:valuechange="handlePickerValueChange"');
});

it('uses single mode by default', () => {
  expect(calendarMiniProps.mode.value).toBe('single');
});

it('uses weekStartsOn zero by default', () => {
  expect(calendarMiniProps.weekStartsOn.value).toBe(0);
});
