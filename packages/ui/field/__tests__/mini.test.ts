import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

let definition: Record<string, unknown> | undefined;

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleClearTap: () => void;
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

function renderField(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Field mini definition not captured');
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

it('resolves default control id on attach', () => {
  const comp = renderField();

  expect(comp.data._controlId).toBeTruthy();
  comp.detach();
});

it('receives helper props', () => {
  const comp = renderField({
    description: 'description',
    errorMessage: 'error',
  });

  expect(comp.data.errorMessage).toBe('error');
  expect(comp.data.description).toBe('description');
  comp.detach();
});

it('triggers clear event when clearable and enabled', () => {
  const comp = renderField({
    isClearable: true,
    value: '123',
  });
  const instance = comp.instance as unknown as MiniInstance;
  const triggerSpy = vi.fn();

  instance.triggerEvent = triggerSpy;
  instance.handleClearTap();

  expect(triggerSpy).toHaveBeenCalledTimes(2);
  expect(triggerSpy).toHaveBeenNthCalledWith(1, 'valuechange', {
    value: '',
  });
  expect(triggerSpy).toHaveBeenNthCalledWith(2, 'clear', {
    value: '',
  });
  comp.detach();
});

it('does not trigger clear event when disabled', () => {
  const comp = renderField({
    isClearable: true,
    isDisabled: true,
  });
  const instance = comp.instance as unknown as MiniInstance;
  const triggerSpy = vi.fn();

  instance.triggerEvent = triggerSpy;
  instance.handleClearTap();

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});

it('does not trigger clear event when value is empty', () => {
  const comp = renderField({
    isClearable: true,
    value: '',
  });
  const instance = comp.instance as unknown as MiniInstance;
  const triggerSpy = vi.fn();

  instance.triggerEvent = triggerSpy;
  instance.handleClearTap();

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});

it('disables fallback control when hasControl is true', () => {
  const computed = definition?.computed as Record<
    string,
    (data: Record<string, unknown>) => unknown
  >;

  const showFallback = computed.$showFallbackControl({
    hasControl: true,
    value: 'abc',
    placeholder: 'phone',
  });

  expect(showFallback).toBe(false);
});
