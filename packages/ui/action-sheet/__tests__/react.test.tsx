import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { ActionSheet } from '../src/react';
import { ACTION_SHEET_CANCEL_TEXT } from '../src/locale';

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
  expect(document.querySelector('.animate-action-sheet-in')).toBeTruthy();
  expect(document.querySelector('.pb-safe-4')).toBeTruthy();
});

it('emits action and closes in uncontrolled mode', () => {
  vi.useFakeTimers();
  const onAction = vi.fn();
  const { queryByText } = render(
    <ActionSheet defaultOpen actions={actions} onAction={onAction} />,
  );

  fireEvent.click(screen.getByText('编辑'));

  expect(onAction).toHaveBeenCalledWith('edit', 0, actions[0]);
  act(() => {
    vi.advanceTimersByTime(550);
  });
  expect(queryByText('编辑')).toBeNull();
  vi.useRealTimers();
});

it('does not close when overlay is pressed', () => {
  render(<ActionSheet defaultOpen actions={actions} />);

  const overlay = document.querySelector('.bg-zinc-900\\/25');
  expect(overlay).toBeTruthy();

  fireEvent.click(overlay as HTMLElement);

  expect(screen.getByText('编辑')).toBeTruthy();
});

it('uses locale text for cancel button by default', () => {
  render(<ActionSheet isOpen actions={actions} locale="zh-CN" />);
  expect(screen.getByText(ACTION_SHEET_CANCEL_TEXT['zh-CN'])).toBeTruthy();
});

it('prefers custom cancelText over locale text', () => {
  render(
    <ActionSheet
      isOpen
      actions={actions}
      locale="zh-CN"
      cancelText="Close Now"
    />,
  );
  expect(screen.getByText('Close Now')).toBeTruthy();
});

it('uses active bg 50 for danger action without flat 200 conflict', () => {
  render(<ActionSheet isOpen actions={actions} />);

  const deleteLabel = screen.getByText('删除');
  const button = deleteLabel.closest('button');

  expect(button).toBeTruthy();

  const classes = (button as HTMLButtonElement).className;
  expect(classes).toContain('active:bg-danger-50');
  expect(classes).not.toContain('active:bg-danger-200');
  expect(classes).not.toContain('active:bg-primary-200');
  expect(classes).not.toContain('active:bg-slate-200');
});

it('renders custom footer and skips default cancel button', () => {
  render(
    <ActionSheet
      isOpen
      actions={actions}
      hasFooter
      footer={<div>Custom Footer</div>}
    />,
  );

  expect(screen.getByText('Custom Footer')).toBeTruthy();
  expect(screen.queryByText(ACTION_SHEET_CANCEL_TEXT.en)).toBeNull();
});

it('applies cancel button props and keeps default cancel behavior', () => {
  const onCancel = vi.fn();
  const onCancelTap = vi.fn();

  render(
    <ActionSheet
      isOpen
      actions={actions}
      onCancel={onCancel}
      cancelButtonProps={{
        className: 'custom-cancel-btn',
        color: 'danger',
        onTap: onCancelTap,
      }}
    />,
  );

  const cancelButton = screen.getByText('Cancel').closest('button');
  expect(cancelButton).toBeTruthy();
  expect((cancelButton as HTMLButtonElement).className).toContain(
    'custom-cancel-btn',
  );

  fireEvent.click(cancelButton as HTMLButtonElement);

  expect(onCancelTap).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});
