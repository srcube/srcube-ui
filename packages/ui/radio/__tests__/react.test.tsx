import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from '../src/react';

it('calls onTap when enabled', () => {
  const onTap = vi.fn();
  render(
    <Radio value="a" onTap={onTap}>
      Option A
    </Radio>,
  );

  fireEvent.click(screen.getByText('Option A'));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it('does not call onTap when disabled', () => {
  const onTap = vi.fn();
  render(
    <Radio value="a" isDisabled onTap={onTap}>
      Disabled
    </Radio>,
  );

  fireEvent.click(screen.getByText('Disabled'));
  expect(onTap).not.toHaveBeenCalled();
});

it('triggers onValueChange in group', () => {
  const onValueChange = vi.fn();
  render(
    <RadioGroup aria-label="options" value="left" onValueChange={onValueChange}>
      <Radio value="left">Left</Radio>
      <Radio value="right">Right</Radio>
    </RadioGroup>,
  );

  fireEvent.click(screen.getByRole('radio', { name: 'Right' }));
  expect(onValueChange).toHaveBeenCalledWith('right');
});
