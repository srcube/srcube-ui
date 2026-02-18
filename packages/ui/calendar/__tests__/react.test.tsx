import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Calendar, CalendarRange } from '../src/react';

void React;

it('renders current month title', () => {
  render(<Calendar month="2026-02" />);

  expect(screen.getByText('2026-02')).toBeTruthy();
});

it('calls onValueChange when selecting a day', () => {
  const onValueChange = vi.fn();
  render(<Calendar month="2026-02" onValueChange={onValueChange} />);

  fireEvent.click(screen.getAllByText('14')[0] as HTMLElement);

  expect(onValueChange).toHaveBeenCalledTimes(1);
});

it('updates helper text for range selection', () => {
  render(<CalendarRange month="2026-02" />);

  fireEvent.click(screen.getAllByText('10')[0] as HTMLElement);
  fireEvent.click(screen.getAllByText('12')[0] as HTMLElement);

  expect(screen.getByText('2026-02-10 ~ 2026-02-12')).toBeTruthy();
});
