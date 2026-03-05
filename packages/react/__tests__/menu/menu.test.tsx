import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Menu } from '../../src/components/menu';

void React;

const items = [
  { value: 'delivery', label: '配送设置' },
  { value: 'delete', label: '删除', isDisabled: true },
];

it('toggles menu in uncontrolled mode', () => {
  render(<Menu trigger={<span>Open</span>} items={items} />);

  fireEvent.click(screen.getByRole('button', { name: 'Open' }));

  expect(screen.getByRole('menuitem', { name: '配送设置' })).toBeTruthy();
});

it('supports controlled open and selected value', () => {
  render(
    <Menu
      isOpen
      value="delivery"
      trigger={<span>Open</span>}
      items={items}
      shouldCloseOnOutsidePress={false}
    />,
  );

  expect(
    screen.getByRole('menuitem', { name: '配送设置' }).getAttribute(
      'aria-selected',
    ),
  ).toBe('true');
});

it('emits open and value change when selecting item', () => {
  const onOpenChange = vi.fn();
  const onValueChange = vi.fn();

  render(
    <Menu
      trigger={<span>Open</span>}
      items={items}
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open' }));
  fireEvent.click(screen.getByRole('menuitem', { name: '配送设置' }));

  expect(onOpenChange).toHaveBeenCalledWith(true);
  expect(onValueChange).toHaveBeenCalledWith(
    'delivery',
    expect.objectContaining({ index: 0 }),
  );
});
