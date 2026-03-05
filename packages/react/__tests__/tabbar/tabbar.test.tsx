import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Tabbar } from '../../src/components/tabbar';

void React;

it('selects default enabled item in uncontrolled mode', () => {
  render(
    <Tabbar
      items={[
        { value: 'home', label: 'Home' },
        { value: 'msg', label: 'Message' },
      ]}
    />,
  );

  const homeButton = screen.getByRole('button', { name: 'Home' });
  expect(homeButton.getAttribute('aria-pressed')).toBe('true');
});

it('emits value change on item click', () => {
  const onValueChange = vi.fn();
  render(
    <Tabbar
      items={[
        { value: 'home', label: 'Home' },
        { value: 'msg', label: 'Message' },
      ]}
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Message' }));
  expect(onValueChange).toHaveBeenCalledWith('msg');
});

it('renders dot and text badges', () => {
  const { container } = render(
    <Tabbar
      classNames={{
        badgeDot: 'test-badge-dot',
        badgeContent: 'test-badge-content',
      }}
      items={[
        { value: 'home', label: 'Home', badge: true },
        { value: 'msg', label: 'Message', badge: '99+' },
      ]}
    />,
  );

  expect(container.querySelector('.test-badge-dot')).toBeTruthy();
  expect(container.querySelector('.test-badge-content')?.textContent).toBe('99+');
});
