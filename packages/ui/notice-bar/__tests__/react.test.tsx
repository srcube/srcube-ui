import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { NoticeBar } from '../src/react';

void React;

it('renders text and icon', () => {
  render(<NoticeBar icon="!" text="Notice" />);

  expect(screen.getByText('!')).toBeTruthy();
  expect(screen.getByText('Notice')).toBeTruthy();
});

it('closes in uncontrolled mode', () => {
  const { queryByText } = render(<NoticeBar text="Closable" isClosable />);

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(queryByText('Closable')).toBeNull();
});

it('emits close callback', () => {
  const onClose = vi.fn();
  render(<NoticeBar text="Closable" isClosable onClose={onClose} />);

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});
