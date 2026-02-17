import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { ActionSheet } from '../src/react';

void React;

const actions = [
  { value: 'edit', label: '编辑' },
  { value: 'delete', label: '删除', color: 'danger' as const },
];

it('does not render when closed', () => {
  const { container } = render(<ActionSheet actions={actions} />);
  expect(container.innerHTML).toBe('');
});

it('renders title and actions when open', () => {
  render(<ActionSheet isOpen title="更多操作" actions={actions} />);

  expect(screen.getByText('更多操作')).toBeTruthy();
  expect(screen.getByText('编辑')).toBeTruthy();
  expect(screen.getByText('删除')).toBeTruthy();
});

it('emits action and closes in uncontrolled mode', () => {
  const onAction = vi.fn();
  const { queryByText } = render(
    <ActionSheet defaultOpen actions={actions} onAction={onAction} />,
  );

  fireEvent.click(screen.getByText('编辑'));

  expect(onAction).toHaveBeenCalledWith('edit', 0, actions[0]);
  expect(queryByText('编辑')).toBeNull();
});
