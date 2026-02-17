import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Tabbar } from '../src/react';

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
