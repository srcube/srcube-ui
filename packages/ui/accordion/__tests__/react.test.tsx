import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Accordion } from '../src/react';

void React;

const items = [
  { value: 'a', title: 'A', content: 'Content A' },
  { value: 'b', title: 'B', content: 'Content B' },
  { value: 'c', title: 'C', content: 'Content C', isDisabled: true },
];

it('renders default expanded item in single mode', () => {
  render(<Accordion items={items} defaultValue="a" />);

  expect(screen.getByText('Content A')).toBeTruthy();
  expect(screen.queryByText('Content B')).toBeNull();
});

it('supports multiple mode toggle', () => {
  render(<Accordion items={items} selectionMode="multiple" defaultValue={["a"]} />);

  fireEvent.click(screen.getByText('B').closest('button') as HTMLButtonElement);

  expect(screen.getByText('Content A')).toBeTruthy();
  expect(screen.getByText('Content B')).toBeTruthy();
});

it('emits value change and ignores disabled item', () => {
  const onValueChange = vi.fn();
  render(<Accordion items={items} onValueChange={onValueChange} />);

  fireEvent.click(screen.getByText('A').closest('button') as HTMLButtonElement);
  fireEvent.click(screen.getByText('C').closest('button') as HTMLButtonElement);

  expect(onValueChange).toHaveBeenCalledWith('a');
  expect(onValueChange).toHaveBeenCalledTimes(1);
});
