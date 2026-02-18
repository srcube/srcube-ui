import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Navbar } from '../src/react';

void React;

it('renders title and side content', () => {
  render(
    <Navbar
      title="Navbar"
      startContent={<button type="button">Back</button>}
      endContent={<button type="button">More</button>}
    />,
  );

  expect(screen.getByText('Navbar')).toBeTruthy();
  expect(screen.getByText('Back')).toBeTruthy();
  expect(screen.getByText('More')).toBeTruthy();
});

it('applies lg size class to title', () => {
  const { container } = render(<Navbar size="lg" title="Large" />);
  expect(container.innerHTML).toContain('text-lg');
});

it('renders default back button when withBack is true', () => {
  render(<Navbar withBack title="Back Navbar" />);

  expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
});

it('calls onBack when clicking default back button', () => {
  const onBack = vi.fn();
  render(<Navbar withBack title="Back Navbar" onBack={onBack} />);

  screen.getByRole('button', { name: 'Back' }).click();
  expect(onBack).toHaveBeenCalledTimes(1);
});

it('applies start title alignment class', () => {
  const { container } = render(<Navbar title="Aligned" titleAlign="start" />);
  expect(container.innerHTML).toContain('text-left');
});
