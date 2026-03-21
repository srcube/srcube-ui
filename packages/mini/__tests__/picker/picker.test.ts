import * as simulate from 'miniprogram-simulate';
import { beforeAll, expect, it, vi } from 'vitest';
// @ts-expect-error -- raw wxml import for tests
import template from '../../src/components/picker/index.wxml?raw';

const testTemplate = template
  .replaceAll('sr-field', 'view')
  .replaceAll('sr-drawer', 'view')
  .replaceAll('sr-pickbox', 'view')
  .replaceAll('sr-button', 'view');

let definition: Record<string, unknown> | undefined;

vi.doMock('miniprogram-computed', () => ({
  ComponentWithComputed: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../../src/components/picker/index');
});

function renderPicker(props: Record<string, unknown> = {}) {
  if (!definition) {
    throw new Error('Picker mini definition not captured');
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

it('initializes uncontrolled value with first enabled item when value and defaultValue are absent', async () => {
  const comp = renderPicker({
    items: [
      { id: 'cq', label: '重庆', isDisabled: true },
      { id: 'cd', label: '成都' },
      { id: 'sh', label: '上海' },
    ],
  });

  await Promise.resolve();

  const computed = definition?.computed as Record<
    string,
    (data: Record<string, unknown>) => unknown
  >;
  const data = comp.data as {
    _innerCommittedValue: Array<string | number | null>;
    _draftValue: Array<string | number | null>;
    items: Array<{
      id: string | number;
      label: string;
      isDisabled?: boolean;
    }>;
    columns: unknown[];
    options: unknown[];
    separator: string;
  };

  expect(data._innerCommittedValue).toEqual([]);
  expect(computed.$displayValue(data)).toBe('');
  expect(computed.$resolvedDraftValue(data)).toEqual(['cd']);

  comp.detach();
});

it('clears uncontrolled committed value when field clear is triggered', async () => {
  const comp = renderPicker({
    isClearable: true,
    defaultValue: ['cd'],
    items: [
      { id: 'cq', label: '重庆' },
      { id: 'cd', label: '成都' },
    ],
  });

  await Promise.resolve();

  const instance = comp.instance as {
    triggerEvent: (...args: unknown[]) => void;
    handleFieldClear: () => void;
  };
  const triggerSpy = vi.fn();
  instance.triggerEvent = triggerSpy;

  instance.handleFieldClear();
  await Promise.resolve();

  const data = comp.data as {
    _innerCommittedValue: Array<string | number | null>;
  };

  expect(data._innerCommittedValue).toEqual([]);
  expect(triggerSpy).toHaveBeenNthCalledWith(1, 'valuechange', {
    value: [],
    values: [],
  });
  expect(triggerSpy).toHaveBeenNthCalledWith(2, 'clear', {
    value: [],
    values: [],
  });

  comp.detach();
});
