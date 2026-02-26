import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Selectbox } from '../src/react/selectbox';

it('applies selected state classes with size variant', () => {
  render(
    <Selectbox
      className="h-48"
      color="primary"
      size="lg"
      selectIcon
      selectionMode="single"
      items={[
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta' },
      ]}
      defaultValue={['a']}
    />,
  );

  const option = screen.getByText('Alpha').closest('[role="option"]') as HTMLElement | null;
  expect(option).toBeTruthy();

  if (!option) {
    return;
  }

  expect(option.className).toContain('bg-primary-50');
  expect(option.className).toContain('rounded-3xl');
});

it('emits value change when pressing item', () => {
  const onValueChange = vi.fn();

  render(
    <Selectbox
      className="h-48"
      selectionMode="single"
      items={[
        { id: 'a', label: 'Alpha' },
        { id: 'b', label: 'Beta' },
      ]}
      defaultValue={['a']}
      onValueChange={onValueChange}
    />,
  );

  const option = screen.getByText('Beta').closest('[role="option"]');
  expect(option).toBeTruthy();

  if (!option) {
    return;
  }

  fireEvent.click(option);
  expect(onValueChange).toHaveBeenCalledWith(['b']);
});
