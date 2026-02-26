import { beforeAll, expect, it, vi } from 'vitest';

let definition: Record<string, unknown> | undefined;

vi.doMock('@srcube-ui/runtime/mini', () => ({
  UIComponent: (def: Record<string, unknown>) => {
    definition = def;
    return def;
  },
}));

beforeAll(async () => {
  await import('../src/mini/index');
});

it('resolves estimate size from size when estimateSize is empty', () => {
  const computed = (
    definition as {
      computed?: Record<string, (data: Record<string, unknown>) => unknown>;
    }
  ).computed?.$resolvedEstimateSize;

  expect(computed).toBeTypeOf('function');

  if (!computed) {
    return;
  }

  const result = computed({
    size: 'sm',
    estimateSize: null,
  });
  expect(result).toBe(36);
});

it('adds check icon class for selected item when selectIcon is enabled', () => {
  const computed = (
    definition as {
      computed?: Record<string, (data: Record<string, unknown>) => unknown>;
    }
  ).computed?.$resolvedItems;

  expect(computed).toBeTypeOf('function');

  if (!computed) {
    return;
  }

  const result = computed({
    items: [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ],
    value: ['a'],
    _innerValue: [],
    orientation: 'y',
    size: 'md',
    color: 'primary',
    classNames: {},
    selectIcon: true,
  }) as Array<{
    id: string | number;
    endIconClassName?: string;
  }>;

  const alpha = result.find((item) => item.id === 'a');
  expect(alpha?.endIconClassName ?? '').toContain('icon-check');
});
