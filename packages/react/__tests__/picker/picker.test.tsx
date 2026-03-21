import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { Picker } from '../../src/components/picker';

void React;

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (options: Record<string, unknown>) => {
    const count = Number(options.count ?? 0);
    const estimateSize = options.estimateSize as (() => number) | undefined;
    const itemSize = Math.max(1, Number(estimateSize?.() ?? 44));
    const paddingStart = Number(options.paddingStart ?? 0);
    const paddingEnd = Number(options.paddingEnd ?? 0);

    return {
      scrollOffset: 0,
      getVirtualItems: () =>
        Array.from({ length: count }, (_, index) => ({
          key: `${index}`,
          index,
          start: paddingStart + index * itemSize,
          size: itemSize,
          end: paddingStart + (index + 1) * itemSize,
        })),
      getTotalSize: () => paddingStart + paddingEnd + count * itemSize,
      scrollToIndex: vi.fn(),
    };
  },
}));

it('keeps Field placeholder when value and defaultValue are absent while pickbox defaults to first enabled item', () => {
  render(
    <Picker
      label="城市"
      items={[
        { id: 'cq', label: '重庆', isDisabled: true },
        { id: 'cd', label: '成都' },
        { id: 'sh', label: '上海' },
      ]}
    />,
  );

  expect(screen.getByText('请选择')).toBeTruthy();
  expect(screen.queryByText('重庆')).toBeNull();
  expect(screen.queryByText('成都')).toBeNull();

  fireEvent.click(screen.getByText('请选择'));

  const option = screen.getByRole('option', { name: '成都' });
  expect(option.getAttribute('aria-selected')).toBe('true');
});

it('shows clear button when defaultValue exists and clears committed value', () => {
  const onValueChange = vi.fn();
  const onClear = vi.fn();

  render(
    <Picker
      label="城市"
      isClearable
      defaultValue={['cd']}
      items={[
        { id: 'cq', label: '重庆' },
        { id: 'cd', label: '成都' },
      ]}
      onValueChange={onValueChange}
      onClear={onClear}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'clear' }));

  expect(onValueChange).toHaveBeenCalledWith([]);
  expect(onClear).toHaveBeenCalledTimes(1);
  expect(screen.getByText('请选择')).toBeTruthy();
});
