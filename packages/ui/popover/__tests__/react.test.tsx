import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Popover } from '../src/react';

void React;

it('toggles content in uncontrolled mode', () => {
  render(
    <Popover trigger={<span>Open</span>} content="Popover content" />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open' }));

  expect(screen.getByText('Popover content')).toBeTruthy();
});

it('supports controlled mode', () => {
  render(
    <Popover isOpen trigger={<span>Open</span>} title="Title" content="Popover content" />,
  );

  expect(screen.getByText('Title')).toBeTruthy();
  expect(screen.getByText('Popover content')).toBeTruthy();
});

it('emits open change when trigger tapped', () => {
  const onOpenChange = vi.fn();
  render(
    <Popover trigger={<span>Open</span>} content="Popover content" onOpenChange={onOpenChange} />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open' }));

  expect(onOpenChange).toHaveBeenCalledWith(true);
});
