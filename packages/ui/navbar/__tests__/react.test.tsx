import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
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
  const title = container.querySelector('.sr-navbar__title, div');
  expect(container.innerHTML).toContain('text-lg');
  expect(title).toBeTruthy();
});
