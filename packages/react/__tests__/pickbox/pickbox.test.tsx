import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const useVirtualizerMock = vi.fn();
const scrollToIndexSpies: Array<ReturnType<typeof vi.fn>> = [];

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (options: Record<string, unknown>) => useVirtualizerMock(options),
}));

import { Pickbox } from '../../src/components/pickbox';

beforeEach(() => {
  scrollToIndexSpies.length = 0;
  useVirtualizerMock.mockImplementation((options: Record<string, unknown>) => {
    const count = Number(options.count ?? 0);
    const estimateSize = options.estimateSize as (() => number) | undefined;
    const itemSize = Math.max(1, Number(estimateSize?.() ?? 44));
    const paddingStart = Number(options.paddingStart ?? 0);
    const paddingEnd = Number(options.paddingEnd ?? 0);
    const scrollToIndex = vi.fn();

    scrollToIndexSpies.push(scrollToIndex);

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
      scrollToIndex,
    };
  });
});

afterEach(() => {
  vi.useRealTimers();
});

it('applies centered paddingStart and paddingEnd for virtual columns', async () => {
  const getBoundingClientRectSpy = vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({
      x: 0,
      y: 0,
      width: 320,
      height: 220,
      top: 0,
      right: 320,
      bottom: 220,
      left: 0,
      toJSON: () => ({}),
    });

  render(
    <Pickbox
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
        },
      ]}
      indicatorHeight={44}
    />,
  );

  await waitFor(() => {
    expect(useVirtualizerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        paddingStart: 88,
        paddingEnd: 88,
      }),
    );
  });

  getBoundingClientRectSpy.mockRestore();
});

it('does not select value by clicking option node', () => {
  const onValueChange = vi.fn();

  render(
    <Pickbox
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
        },
      ]}
      onValueChange={onValueChange}
    />,
  );

  const option = screen.getByRole('option', { name: 'B' });
  expect(option.tagName).toBe('DIV');
  fireEvent.click(option);

  expect(onValueChange).not.toHaveBeenCalled();
});

it('keeps selected option state while scrolling', () => {
  const { container } = render(
    <Pickbox
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ],
        },
      ]}
      defaultValue={['b']}
    />,
  );

  const option = screen.getByRole('option', { name: 'B' });
  expect(option.getAttribute('aria-selected')).toBe('true');

  const scrollElement = container.querySelector('.overflow-y-auto') as HTMLElement;
  expect(scrollElement).toBeTruthy();

  if (!scrollElement) {
    return;
  }

  fireEvent.scroll(scrollElement);
  expect(option.getAttribute('aria-selected')).toBe('true');
});

it('snaps to nearest item after manual scroll stop', () => {
  vi.useFakeTimers();

  const onValueChange = vi.fn();
  const { container } = render(
    <Pickbox
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
          ],
        },
      ]}
      defaultValue={['c']}
      onValueChange={onValueChange}
      scrollEndDelay={100}
    />,
  );

  const scrollElement = container.querySelector('.overflow-y-auto') as HTMLElement;
  expect(scrollElement).toBeTruthy();

  if (!scrollElement) {
    return;
  }

  Object.defineProperty(scrollElement, 'clientHeight', {
    value: 220,
    configurable: true,
  });

  vi.runAllTimers();
  fireEvent.scroll(scrollElement);
  vi.advanceTimersByTime(100);

  expect(onValueChange).toHaveBeenCalledWith(['c']);
});

it('resolves default item size by size variant', async () => {
  render(
    <Pickbox
      size="sm"
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
        },
      ]}
    />,
  );

  const option = await screen.findByRole('option', { name: 'A' });
  expect(option.getAttribute('style')).toContain('height: 36px;');
});

it('applies dark tone classes', () => {
  const { container } = render(
    <Pickbox
      tone="dark"
      columns={[
        {
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
          ],
        },
      ]}
      defaultValue={['b']}
    />,
  );

  expect(container.querySelector('.bg-zinc-950')).toBeTruthy();
  const option = screen.getByRole('option', { name: 'B' });
  expect(option.className).toContain('text-zinc-50');
});
