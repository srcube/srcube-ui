import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

const testTemplate = template.replaceAll('sr-button', 'view');

let definition: Record<string, unknown> | undefined;

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleActionTap: (event: WechatMiniprogram.TouchEvent) => void;
};

vi.doMock('@srcube-ui/runtime/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function renderSwipeAction(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('SwipeAction mini definition not captured');
  }

  const { relations: _relations, ...rest } = definition;
  void _relations;

  const id = simulate.load({
    template: testTemplate,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('resolves initial offset from default open direction', () => {
  const comp = renderSwipeAction({
    defaultOpenDirection: 'right',
    rightActions: [{ key: 'delete', label: 'Delete' }],
    actionWidth: 80,
  });

  expect(comp.data._offset).toBe(-80);
  comp.detach();
});

it('triggers action and close events when action tapped', async () => {
  const comp = renderSwipeAction({
    openDirection: 'right',
    rightActions: [{ key: 'delete', label: 'Delete' }],
  });
  const instance = comp.instance as unknown as MiniInstance;
  const triggerSpy = vi.fn();

  instance.triggerEvent = triggerSpy;
  instance.handleActionTap({
    currentTarget: {
      dataset: {
        direction: 'right',
        index: 0,
      },
    },
  } as unknown as WechatMiniprogram.TouchEvent);

  await Promise.resolve();

  expect(triggerSpy).toHaveBeenCalledWith(
    'action',
    expect.objectContaining({
      key: 'delete',
      direction: 'right',
      index: 0,
    }),
  );
  expect(triggerSpy).toHaveBeenCalledWith('openchange', {
    openDirection: 'none',
  });

  comp.detach();
});

it('ignores action tap when component is disabled', () => {
  const comp = renderSwipeAction({
    isDisabled: true,
    rightActions: [{ key: 'delete', label: 'Delete' }],
  });
  const instance = comp.instance as unknown as MiniInstance;
  const triggerSpy = vi.fn();

  instance.triggerEvent = triggerSpy;
  instance.handleActionTap({
    currentTarget: {
      dataset: {
        direction: 'right',
        index: 0,
      },
    },
  } as unknown as WechatMiniprogram.TouchEvent);

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});
