import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { SwipeAction } from '../../src/components/swipe-action';

void React;

it('renders content and actions', () => {
  render(
    <SwipeAction rightActions={[{ key: 'delete', label: 'Delete' }]}>
      <div>Order #1001</div>
    </SwipeAction>,
  );

  expect(screen.getByText('Order #1001')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy();
});

it('uses size-based default action width when actionWidth is missing', () => {
  const { container, rerender } = render(
    <SwipeAction
      size="sm"
      rightActions={[{ key: 'delete', label: 'Delete' }]}
    >
      <div>Order #1001</div>
    </SwipeAction>,
  );

  expect(container.innerHTML).toContain('width: 56px');

  rerender(
    <SwipeAction
      size="lg"
      rightActions={[{ key: 'delete', label: 'Delete' }]}
    >
      <div>Order #1001</div>
    </SwipeAction>,
  );

  expect(container.innerHTML).toContain('width: 72px');
});

it('emits open direction after swipe', () => {
  const onOpenDirectionChange = vi.fn();

  const { container } = render(
    <SwipeAction
      rightActions={[{ key: 'delete', label: 'Delete' }]}
      classNames={{ content: 'test-content' }}
      onOpenDirectionChange={onOpenDirectionChange}
    >
      <div>Order #1002</div>
    </SwipeAction>,
  );

  const content = container.querySelector('.test-content') as HTMLElement;

  fireEvent.pointerDown(content, {
    pointerId: 1,
    clientX: 200,
    clientY: 20,
  });
  fireEvent.pointerMove(content, {
    pointerId: 1,
    clientX: 120,
    clientY: 20,
  });
  fireEvent.pointerUp(content, {
    pointerId: 1,
    clientX: 120,
    clientY: 20,
  });

  expect(onOpenDirectionChange).toHaveBeenCalledWith('right');
});

it('triggers action event and closes after click', () => {
  const onAction = vi.fn();
  const onOpenDirectionChange = vi.fn();

  render(
    <SwipeAction
      defaultOpenDirection="right"
      rightActions={[{ key: 'delete', label: 'Delete', color: 'danger' }]}
      onAction={onAction}
      onOpenDirectionChange={onOpenDirectionChange}
    >
      <div>Order #1003</div>
    </SwipeAction>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  expect(onAction).toHaveBeenCalledTimes(1);
  expect(onAction.mock.calls[0]?.[0]).toMatchObject({
    key: 'delete',
    direction: 'right',
  });
  expect(onOpenDirectionChange).toHaveBeenCalledWith('none');
});

it('applies dark tone content classes', () => {
  const { container } = render(
    <SwipeAction tone="dark" rightActions={[{ key: 'delete', label: 'Delete' }]}>
      <div>Order #1004</div>
    </SwipeAction>,
  );

  expect(container.querySelector('.bg-zinc-950')).toBeTruthy();
});
