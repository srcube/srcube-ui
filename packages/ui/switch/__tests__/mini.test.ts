import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

let definition: Record<string, unknown> | undefined;

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleTap: (e: WechatMiniprogram.TouchEvent) => Promise<void> | void;
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

function renderSwitch(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Switch mini definition not captured');
  }

  const { relations: _relations, ...rest } = definition;
  void _relations;

  const id = simulate.load({
    template,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('skips tap when disabled', async () => {
  const comp = renderSwitch({ isDisabled: true });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});

it('supports auto loading wait', async () => {
  const comp = renderSwitch({ isLoading: 'auto' });

  let resolvePromise: (() => void) | undefined;
  const waitPromise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  const triggerSpy = vi.fn((name, detail) => {
    if (name === 'tap') {
      detail.wait(waitPromise);
    }
  });

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  const handlePromise = instance.handleTap({
    detail: {},
  } as WechatMiniprogram.TouchEvent);

  await Promise.resolve();
  const data = comp.data as { _autoLoading?: boolean };
  expect(data._autoLoading).toBe(true);

  resolvePromise?.();
  await handlePromise;

  expect(data._autoLoading).toBe(false);
  comp.detach();
});

it('toggles when uncontrolled', async () => {
  const comp = renderSwitch({ value: 'wifi' });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(comp.data._innerSelected).toBe(true);
  expect(triggerSpy).toHaveBeenCalledWith(
    'change',
    expect.objectContaining({
      value: 'wifi',
      isSelected: true,
    }),
  );

  comp.detach();
});
