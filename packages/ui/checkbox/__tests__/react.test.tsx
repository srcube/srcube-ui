import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Checkbox, CheckboxGroup } from '../src/react';

it('calls onTap when enabled', () => {
  const onTap = vi.fn();
  render(<Checkbox onTap={onTap}>Option A</Checkbox>);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Option A' }));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it('does not call onTap when disabled', () => {
  const onTap = vi.fn();
  render(
    <Checkbox isDisabled onTap={onTap}>
      Disabled
    </Checkbox>,
  );

  fireEvent.click(screen.getByRole('checkbox', { name: 'Disabled' }));
  expect(onTap).not.toHaveBeenCalled();
});

it('calls onValueChange for standalone', () => {
  const onValueChange = vi.fn();
  render(<Checkbox onValueChange={onValueChange}>Standalone</Checkbox>);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Standalone' }));
  expect(onValueChange).toHaveBeenCalledWith(true);
});

it('calls onValueChange for group', () => {
  const onValueChange = vi.fn();
  render(
    <CheckboxGroup
      aria-label="options"
      defaultValue={[]}
      onValueChange={onValueChange}
    >
      <Checkbox value="a">Option A</Checkbox>
      <Checkbox value="b">Option B</Checkbox>
    </CheckboxGroup>,
  );

  fireEvent.click(screen.getByRole('checkbox', { name: 'Option A' }));
  expect(onValueChange).toHaveBeenCalledWith(['a']);
});
