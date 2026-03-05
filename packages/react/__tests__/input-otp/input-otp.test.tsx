import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { InputOtp } from '../../src/components/input-otp';

it('truncates input by length and triggers onComplete', () => {
  const onValueChange = vi.fn();
  const onComplete = vi.fn();

  const { container } = render(
    <InputOtp
      length={4}
      onValueChange={onValueChange}
      onComplete={onComplete}
    />,
  );

  const input = container.querySelector('input') as HTMLInputElement | null;
  expect(input).toBeTruthy();

  if (!input) {
    return;
  }

  fireEvent.change(input, { target: { value: '12345' } });

  expect(onValueChange).toHaveBeenCalledWith('1234');
  expect(onComplete).toHaveBeenCalledWith('1234');
  expect(input.value).toBe('1234');
});

it('focuses hidden input when wrapper is clicked', () => {
  const { container } = render(<InputOtp />);

  const root = container.firstElementChild as HTMLElement | null;
  const input = container.querySelector('input') as HTMLInputElement | null;

  expect(root).toBeTruthy();
  expect(input).toBeTruthy();

  if (!root || !input) {
    return;
  }

  fireEvent.click(root);

  expect(document.activeElement).toBe(input);
});

it('supports controlled value updates', () => {
  const onValueChange = vi.fn();
  const onComplete = vi.fn();

  const { container, rerender } = render(
    <InputOtp
      value="12"
      length={4}
      onValueChange={onValueChange}
      onComplete={onComplete}
    />,
  );

  const input = container.querySelector('input') as HTMLInputElement | null;
  expect(input).toBeTruthy();

  if (!input) {
    return;
  }

  fireEvent.change(input, { target: { value: '12345' } });

  expect(onValueChange).toHaveBeenCalledWith('1234');
  expect(onComplete).toHaveBeenCalledWith('1234');

  rerender(
    <InputOtp
      value="1234"
      length={4}
      onValueChange={onValueChange}
      onComplete={onComplete}
    />,
  );

  expect(input.value).toBe('1234');
});
