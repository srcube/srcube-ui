import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Collapse } from '../../src/components/collapse';

void React;

it('renders expanded content with defaultValue', () => {
  render(<Collapse title="Order" content="Order content" defaultValue />);

  expect(screen.getByText('Order content')).toBeTruthy();
});

it('toggles content in uncontrolled mode', () => {
  render(<Collapse title="Shipping" content="Shipping content" />);

  fireEvent.click(screen.getByText('Shipping').closest('button') as HTMLButtonElement);

  expect(screen.getByText('Shipping content')).toBeTruthy();
});

it('emits value change when toggled', () => {
  const onValueChange = vi.fn();
  render(<Collapse title="Invoice" content="Invoice content" onValueChange={onValueChange} />);

  fireEvent.click(screen.getByText('Invoice').closest('button') as HTMLButtonElement);

  expect(onValueChange).toHaveBeenCalledWith(true);
});

it('renders built-in chevron indicator by default', () => {
  const { container } = render(<Collapse title="Chevron" content="Chevron content" />);

  expect(container.innerHTML).toContain('icon-chevron-down');
});
