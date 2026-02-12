import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Listbox } from '../src/react/listbox';

it('renders empty content by locale', () => {
  render(
    <Listbox
      className="h-40"
      items={[]}
      estimateSize={40}
      locale="zh-CN"
    />,
  );

  expect(screen.getByText('暂无内容')).toBeTruthy();
});

it('triggers selection change on item click', () => {
  const onSelectionChange = vi.fn();

  const { container } = render(
    <Listbox
      className="h-40"
      items={[
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta' },
      ]}
      estimateSize={40}
      onSelectionChange={onSelectionChange}
    />,
  );

  const option = screen.getByText('Alpha').closest('[role="option"]');
  expect(option).toBeTruthy();

  if (!option) {
    return;
  }

  fireEvent.click(option);

  expect(onSelectionChange).toHaveBeenCalledTimes(1);
  expect(onSelectionChange).toHaveBeenCalledWith(['a']);

  const scrollView = container.querySelector('.overflow-y-auto') as HTMLElement;
  expect(scrollView).toBeTruthy();
});

it('renders horizontal listbox orientation', () => {
  const { container } = render(
    <Listbox
      className="h-20"
      orientation="x"
      items={[
        { id: 1, label: 'One' },
        { id: 2, label: 'Two' },
      ]}
      estimateSize={120}
    />,
  );

  const scrollView = container.querySelector('.overflow-x-auto');
  expect(scrollView).toBeTruthy();
});

it('keeps external size classes on root in vertical mode', () => {
  const { container } = render(
    <Listbox
      className="h-80 w-72"
      items={[
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta' },
      ]}
      estimateSize={40}
    />,
  );

  const root = container.firstElementChild as HTMLElement | null;
  expect(root).toBeTruthy();

  if (!root) {
    return;
  }

  expect(root.className).toContain('h-80');
  expect(root.className).toContain('w-72');
  expect(root.className).not.toContain('h-full');
  expect(root.className).not.toContain('w-full');
});

it('applies h-full to scrollbox content in horizontal mode', () => {
  const { container } = render(
    <Listbox
      className="h-20"
      orientation="x"
      items={Array.from({ length: 20 }, (_, index) => ({
        id: index,
        label: `Option ${index + 1}`,
      }))}
      estimateSize={120}
    />,
  );

  const scrollboxContent = Array.from(container.querySelectorAll('div')).find(
    (node) =>
      node.className.includes('w-max whitespace-nowrap') &&
      !node.className.includes('relative'),
  ) as HTMLElement | undefined;

  expect(scrollboxContent).toBeTruthy();

  if (!scrollboxContent) {
    return;
  }

  expect(scrollboxContent.className).toContain('h-full');
});

it('renders sticky overlay item in vertical mode', () => {
  const { container } = render(
    <Listbox
      className="h-40"
      items={[
        { id: 'header', label: 'Header', isSticky: true },
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta' },
      ]}
      estimateSize={40}
      classNames={{
        sticky: 'test-sticky',
        stickyItem: 'test-sticky-item',
      }}
    />,
  );

  const stickyItem = container.querySelector('.test-sticky-item') as
    | HTMLElement
    | null;

  expect(stickyItem).toBeTruthy();

  if (!stickyItem) {
    return;
  }

  expect(stickyItem.textContent).toContain('Header');
  expect(stickyItem.style.height).toBe('40px');
});

it('renders sticky overlay item in horizontal mode', () => {
  const { container } = render(
    <Listbox
      className="h-20"
      orientation="x"
      items={[
        { id: 'header', label: 'Header', isSticky: true },
        { id: 'a', label: 'Alpha' },
      ]}
      estimateSize={120}
      classNames={{
        sticky: 'test-sticky-x',
        stickyItem: 'test-sticky-item-x',
      }}
    />,
  );

  const stickyItem = container.querySelector('.test-sticky-item-x') as
    | HTMLElement
    | null;

  expect(stickyItem).toBeTruthy();

  if (!stickyItem) {
    return;
  }

  expect(stickyItem.textContent).toContain('Header');
  expect(stickyItem.style.width).toBe('120px');
});
