import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Calendar, CalendarRange } from '../../src/components/calendar';

void React;

it('renders current month key and month navigation actions', () => {
  render(<Calendar month="2026-02" minDate="2026-02-01" maxDate="2026-02-28" />);

  expect(screen.getByText('2026-02')).toBeTruthy();
  expect(screen.getByLabelText('Previous month')).toBeTruthy();
  expect(screen.getByLabelText('Next month')).toBeTruthy();
});

it('renders today quick action', () => {
  render(<Calendar month="2026-02" minDate="2026-01-01" maxDate="2026-12-31" />);

  expect(screen.getByText('Today')).toBeTruthy();
});

it('calls onValueChange when selecting a day', () => {
  const onValueChange = vi.fn();
  render(
    <Calendar
      month="2026-02"
      minDate="2026-02-01"
      maxDate="2026-02-28"
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(screen.getAllByText('14')[0] as HTMLElement);

  expect(onValueChange).toHaveBeenCalledTimes(1);
});

it('updates helper text for range selection', () => {
  render(
    <CalendarRange
      month="2026-02"
      minDate="2026-02-01"
      maxDate="2026-02-28"
    />,
  );

  fireEvent.click(screen.getAllByText('10')[0] as HTMLElement);
  fireEvent.click(screen.getAllByText('12')[0] as HTMLElement);

  expect(screen.getByText('2026-02-10 ~ 2026-02-12')).toBeTruthy();
});

it('applies dark tone classes', () => {
  const { container } = render(<Calendar tone="dark" month="2026-02" />);
  expect(container.querySelector('.bg-zinc-950')).toBeTruthy();
});
