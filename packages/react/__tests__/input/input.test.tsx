import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Input } from '../../src/components/input';

void React;

it('renders label and current value', () => {
  render(<Input label="Phone" value="123" />);

  expect(screen.getByText('Phone')).toBeTruthy();
  expect(screen.getByDisplayValue('123')).toBeTruthy();
});

it('triggers onValueChange when typing', () => {
  const onValueChange = vi.fn();

  render(<Input value="" onValueChange={onValueChange} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: {
      value: '456',
    },
  });

  expect(onValueChange).toHaveBeenCalledWith('456');
});

it('clear button appears with value and clears to empty string', () => {
  const onValueChange = vi.fn();

  render(<Input value="123" isClearable onValueChange={onValueChange} />);

  fireEvent.click(screen.getByRole('button', { name: 'clear' }));

  expect(onValueChange).toHaveBeenCalledWith('');
});
