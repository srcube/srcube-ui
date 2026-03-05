import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Stepper } from '../../src/components/stepper';

void React;

it('renders default value in uncontrolled mode', () => {
  render(<Stepper defaultValue={2} />);

  const input = screen.getByRole('textbox') as HTMLInputElement;
  expect(input.value).toBe('2');
});

it('increments and decrements by step', () => {
  const onValueChange = vi.fn();
  render(<Stepper defaultValue={1} step={0.5} onValueChange={onValueChange} />);

  const increaseButton = screen.getByLabelText('Increase');
  const decreaseButton = screen.getByLabelText('Decrease');

  fireEvent.click(increaseButton);
  fireEvent.click(decreaseButton);

  expect(onValueChange).toHaveBeenCalledWith(1.5);
  expect(onValueChange).toHaveBeenCalledWith(1);
});

it('clamps input value by min and max', () => {
  render(<Stepper defaultValue={3} min={1} max={5} />);

  const input = screen.getByRole('textbox') as HTMLInputElement;
  fireEvent.change(input, {
    target: { value: '20' },
  });
  fireEvent.blur(input);

  expect(input.value).toBe('5');
});
