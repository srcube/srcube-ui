import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Textarea } from '../../src/components/textarea';

void React;

it('renders label and current value', () => {
  render(<Textarea label="Bio" value="hello" />);

  expect(screen.getByText('Bio')).toBeTruthy();
  expect(screen.getByDisplayValue('hello')).toBeTruthy();
});

it('triggers onValueChange when typing', () => {
  const onValueChange = vi.fn();

  render(<Textarea value="" onValueChange={onValueChange} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: {
      value: 'next line',
    },
  });

  expect(onValueChange).toHaveBeenCalledWith('next line');
});

it('clear button appears with value and clears to empty string', () => {
  const onValueChange = vi.fn();

  render(<Textarea value="abc" isClearable onValueChange={onValueChange} />);

  fireEvent.click(screen.getByRole('button', { name: 'clear' }));

  expect(onValueChange).toHaveBeenCalledWith('');
});

it('uses multiline textarea classes without single-line truncate', () => {
  render(<Textarea value="hello" onValueChange={() => {}} />);

  const textarea = screen.getByRole('textbox');
  const className = textarea.getAttribute('class') ?? '';

  expect(className).toContain('whitespace-pre-wrap');
  expect(className.includes('truncate')).toBe(false);
});

it('renders count with infinity when maxLength is not provided', () => {
  const { rerender } = render(
    <Textarea value="hello" showCount onValueChange={() => {}} />,
  );

  expect(screen.getByText('5/♾️')).toBeTruthy();

  rerender(
    <Textarea
      value="hello world"
      showCount
      maxLength={20}
      onValueChange={() => {}}
    />,
  );

  expect(screen.getByText('11/20')).toBeTruthy();
});
