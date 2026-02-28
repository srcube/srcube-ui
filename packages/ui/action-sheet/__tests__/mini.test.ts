import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';
import { actionSheetMiniProps } from '../src/mini/props';
import {
  ACTION_SHEET_CANCEL_TEXT,
  DEFAULT_ACTION_SHEET_LOCALE,
} from '../src/locale';

it('contains popup and button-group action handlers', () => {
  expect(template).toContain('<sr-popup');
  expect(template).toContain('<sr-button-group');
  expect(template).toContain('variant="text"');
  expect(template).toContain('variant="{{item.variant}}"');
  expect(template).not.toContain('variant="flat"');
  expect(template).toContain('isDismissable="{{false}}"');
  expect(template).toContain('bind:tap="handleActionTap"');
  expect(template).toContain('bind:tap="handleCancelTap"');
  expect(template).toContain('wx:if="{{hasFooter}}"');
  expect(template).toContain('<slot name="footer" />');
  expect(template).toContain('color="{{$cancelButtonProps.color}}"');
  expect(template).not.toContain('wx:if="{{$isVisible}}"');
});

it('accepts actions in mini props', () => {
  expect(actionSheetMiniProps.actions.type).toBe(Array);
  expect(Array.isArray(actionSheetMiniProps.actions.value)).toBe(true);
});

it('uses true as default isClosable value', () => {
  expect(actionSheetMiniProps.isClosable.value).toBe(true);
});

it('supports custom footer and cancel button props in mini props', () => {
  expect(actionSheetMiniProps.hasFooter.value).toBe(false);
  expect(actionSheetMiniProps.cancelButtonProps.type).toBe(Object);
});

it('uses locale defaults for cancel text', () => {
  expect(actionSheetMiniProps.locale.value).toBe(DEFAULT_ACTION_SHEET_LOCALE);
  expect(actionSheetMiniProps.cancelText.value).toBe('');
  expect(ACTION_SHEET_CANCEL_TEXT.en).toBe('Cancel');
});
