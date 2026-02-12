import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import groupTemplate from '../src/mini/checkbox-group/index.wxml?raw';
// @ts-expect-error -- raw wxml import for tests
import template from '../src/mini/index.wxml?raw';

const definitions: Array<Record<string, unknown>> = [];

type MiniInstance = {
  triggerEvent: (...args: unknown[]) => void;
  handleTap: (e: WechatMiniprogram.TouchEvent) => Promise<void> | void;
};

type MiniGroupInstance = {
  triggerEvent: (...args: unknown[]) => void;
  onChildToggle: (value: string, nextSelected: boolean) => void;
};

vi.doMock('@srcube-ui/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definitions.push(def);
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
  await import('../src/mini/checkbox-group/index');
});

function getDefinition(
  predicate: (def: Record<string, unknown>) => boolean,
  name: string,
) {
  const def = definitions.find(predicate);
  if (!def) {
    throw new Error(`${name} mini definition not captured`);
  }
  return def;
}

function renderCheckbox(props: Record<string, unknown> = {}) {
  const def = getDefinition((candidate) => {
    const relations = candidate.relations as
      | Record<string, unknown>
      | undefined;
    return Boolean(relations && './checkbox-group/index' in relations);
  }, 'Checkbox');

  const { relations: _relations, ...rest } = def;
  void _relations;

  const id = simulate.load({
    template,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

function renderGroup(props: Record<string, unknown> = {}) {
  const def = getDefinition((candidate) => {
    const relations = candidate.relations as
      | Record<string, unknown>
      | undefined;
    return Boolean(relations && '../index' in relations);
  }, 'CheckboxGroup');

  const { relations: _relations, ...rest } = def;
  void _relations;

  const id = simulate.load({
    template: groupTemplate,
    ...(rest as Record<string, unknown>),
  });

  const comp = simulate.render(id, props);
  comp.attach(document.body);
  return comp;
}

it('skips tap when disabled', async () => {
  const comp = renderCheckbox({ isDisabled: true });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(triggerSpy).not.toHaveBeenCalled();
  comp.detach();
});

it('supports auto loading wait', async () => {
  const comp = renderCheckbox({ isLoading: 'auto' });

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
  const comp = renderCheckbox({ value: 'a' });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniInstance;
  instance.triggerEvent = triggerSpy;

  await instance.handleTap({ detail: {} } as WechatMiniprogram.TouchEvent);

  expect(comp.data._innerSelected).toBe(true);
  expect(triggerSpy).toHaveBeenCalledWith(
    'change',
    expect.objectContaining({
      value: 'a',
      isSelected: true,
    }),
  );

  comp.detach();
});

it('group collects selected values', () => {
  const comp = renderGroup({ defaultValue: ['a'] });
  const triggerSpy = vi.fn();

  const instance = comp.instance as unknown as MiniGroupInstance;
  instance.triggerEvent = triggerSpy;

  instance.onChildToggle('b', true);

  expect(comp.data._innerValue).toEqual(['a', 'b']);
  expect(triggerSpy).toHaveBeenCalledWith(
    'change',
    expect.objectContaining({
      value: ['a', 'b'],
    }),
  );
});
