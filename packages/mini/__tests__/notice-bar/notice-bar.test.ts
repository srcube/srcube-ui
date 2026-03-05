import * as simulate from 'miniprogram-simulate';
import { expect, it } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/notice-bar/index.wxml?raw';
import { noticeBarMiniProps } from '../../src/components/notice-bar/props';

it('contains close handler in template', () => {
  expect(template).toContain('bindtap="handleCloseTap"');
  expect(template).toContain('_switchToken');
  expect(template).toContain('$classNames.closeIcon');
});

it('accepts text in mini render data', () => {
  const id = simulate.load({
    template,
    properties: noticeBarMiniProps,
    data: {},
    methods: {},
    options: { multipleSlots: true },
  });

  const comp = simulate.render(id, {
    text: 'Mini Notice',
  });

  const data = comp.data as { text?: string };
  expect(data.text).toBe('Mini Notice');
});

it('uses false as default isClosable value', () => {
  expect(noticeBarMiniProps.isClosable.value).toBe(false);
});

it('uses false as default isAutoPlay value', () => {
  expect(noticeBarMiniProps.isAutoPlay.value).toBe(false);
});
