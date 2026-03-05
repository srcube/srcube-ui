import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { NoticeBar } from '../../src/components/notice-bar';

void React;

it('renders text and icon', () => {
  render(<NoticeBar icon="!" text="Notice" />);

  expect(screen.getByText('!')).toBeTruthy();
  expect(screen.getByText('Notice')).toBeTruthy();
});

it('closes in uncontrolled mode', () => {
  const { container, queryByText } = render(<NoticeBar text="Closable" isClosable />);

  expect(container.querySelector('.icon-close')).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(queryByText('Closable')).toBeNull();
});

it('emits close callback', () => {
  const onClose = vi.fn();
  render(<NoticeBar text="Closable" isClosable onClose={onClose} />);

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(onClose).toHaveBeenCalledTimes(1);
});

it('switches notice texts automatically', () => {
  vi.useFakeTimers();

  const { container } = render(
    <NoticeBar
      items={['第一条通知', '第二条通知']}
      isAutoPlay
      switchInterval={1000}
    />,
  );

  expect(screen.getByText('第一条通知')).toBeTruthy();
  expect(container.innerHTML).not.toContain('animate-notice-bar-marquee');

  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText('第二条通知')).toBeTruthy();

  vi.useRealTimers();
});
