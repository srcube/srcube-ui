import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

let definition: Record<string, unknown> | undefined;

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleWrapperTap: () => void;
  handleInput: (e: WechatMiniprogram.CustomEvent<{ value?: string }>) => void;
};

vi.doMock('@srcube-ui/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

function renderInputOtp(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('InputOtp mini definition not captured');
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

it('initializes uncontrolled value from defaultValue', () => {
  const comp = renderInputOtp({ defaultValue: '123456', length: 4 });

  expect(comp.data.inputValue).toBe('1234');
  comp.detach();
});

it('does not focus when disabled', () => {
  const comp = renderInputOtp({ isDisabled: true });
  const instance = comp.instance as unknown as MiniInstance;

  instance.handleWrapperTap();

  expect(comp.data.focus).toBe(false);
  comp.detach();
});

it('truncates input and emits valuechange/complete', () => {
  const comp = renderInputOtp({ length: 4 });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  instance.handleInput({
    detail: {
      value: '12345',
    },
  } as WechatMiniprogram.CustomEvent<{ value?: string }>);

  expect(comp.data.inputValue).toBe('1234');
  expect(triggerSpy).toHaveBeenCalledWith('valuechange', { value: '1234' });
  expect(triggerSpy).toHaveBeenCalledWith('complete', { value: '1234' });
  comp.detach();
});
