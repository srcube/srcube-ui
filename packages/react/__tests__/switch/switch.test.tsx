import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Switch } from '../../src/components/switch';

it('does not render default selected icon', () => {
  const { container } = render(<Switch defaultSelected>Airplane Mode</Switch>);

  expect(container.querySelector('.icon-check')).toBeNull();
});

it('calls onTap when enabled', () => {
  const onTap = vi.fn();
  render(<Switch onTap={onTap}>Airplane Mode</Switch>);

  fireEvent.click(screen.getByRole('switch', { name: 'Airplane Mode' }));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it('does not call onTap when disabled', () => {
  const onTap = vi.fn();
  render(
    <Switch isDisabled onTap={onTap}>
      Disabled
    </Switch>,
  );

  fireEvent.click(screen.getByRole('switch', { name: 'Disabled' }));
  expect(onTap).not.toHaveBeenCalled();
});

it('calls onValueChange when clicked', () => {
  const onValueChange = vi.fn();
  render(<Switch onValueChange={onValueChange}>Wifi</Switch>);

  fireEvent.click(screen.getByRole('switch', { name: 'Wifi' }));
  expect(onValueChange).toHaveBeenCalledWith(true);
});

it('supports controlled value', () => {
  const onValueChange = vi.fn();
  render(
    <Switch isSelected={false} onValueChange={onValueChange}>
      Bluetooth
    </Switch>,
  );

  fireEvent.click(screen.getByRole('switch', { name: 'Bluetooth' }));
  expect(onValueChange).toHaveBeenCalledWith(true);
});
