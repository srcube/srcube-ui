import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Field } from '../../src/components/field';

void React;

it('renders outside label and helper text', () => {
  render(
    <Field label="Phone" description="Input your phone number" value="123" />,
  );

  expect(screen.getByText('Phone')).toBeTruthy();
  expect(screen.getByText('Input your phone number')).toBeTruthy();
  expect(screen.getByText('123')).toBeTruthy();
});

it('uses error message before description', () => {
  render(
    <Field
      label="Phone"
      description="Input your phone number"
      errorMessage="Invalid phone"
    />,
  );

  expect(screen.getByText('Invalid phone')).toBeTruthy();
  expect(screen.queryByText('Input your phone number')).toBeNull();
});

it('handles clear click without triggering root tap', () => {
  const onClear = vi.fn();
  const onValueChange = vi.fn();
  const onTap = vi.fn();

  const { container } = render(
    <Field
      isClearable
      value="123"
      onClear={onClear}
      onValueChange={onValueChange}
      onTap={onTap}
    />,
  );

  const clearButton = screen.getByRole('button', { name: 'clear' });
  fireEvent.click(clearButton);

  expect(onClear).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith('');
  expect(onTap).toHaveBeenCalledTimes(0);

  const root = container.firstElementChild as HTMLElement;
  fireEvent.click(root);

  expect(onTap).toHaveBeenCalledTimes(1);
});

it('does not show clear button when value is empty', () => {
  render(<Field isClearable value="" />);

  expect(screen.queryByRole('button', { name: 'clear' })).toBeNull();
});

it('supports function children with generated id and className', () => {
  render(
    <Field>
      {({ id, className, value, onValueChange }) => (
        <input
          data-testid="field-input"
          id={id}
          className={className}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
          }}
        />
      )}
    </Field>,
  );

  const input = screen.getByTestId('field-input');
  expect(input.getAttribute('id')).toBeTruthy();
  expect(input.getAttribute('class')).toContain('flex');
  expect(input.getAttribute('value')).toBe('');
});
