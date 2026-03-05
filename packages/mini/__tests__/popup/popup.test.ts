import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/popup/index.wxml?raw';
import { popupMiniProps } from '../../src/components/popup/props';

it('contains popup root and backdrop binding in template', () => {
  expect(template).toContain('sr-popup__root');
  expect(template).toContain('catchtouchmove="handleTouchMoveCapture"');
  expect(template).toContain('bindtap="handleBackdropTap"');
});

it('uses modal as default motion strategy', () => {
  expect(popupMiniProps.motion.value).toBe('modal');
});

it('uses opaque as default backdrop strategy', () => {
  expect(popupMiniProps.backdrop.value).toBe('opaque');
});
