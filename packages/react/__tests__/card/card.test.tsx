import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Card } from '../../src/components/card';

void React;

it('renders header body and footer', () => {
  render(
    <Card
      header={<span>Card Header</span>}
      body={<span>Card Body</span>}
      footer={<span>Card Footer</span>}
    />,
  );

  expect(screen.getByText('Card Header')).toBeTruthy();
  expect(screen.getByText('Card Body')).toBeTruthy();
  expect(screen.getByText('Card Footer')).toBeTruthy();
});

it('renders children inside body when body prop is missing', () => {
  render(<Card>Body From Children</Card>);

  expect(screen.getByText('Body From Children')).toBeTruthy();
});

it('keeps default card without border classes', () => {
  const { container } = render(<Card>Content</Card>);
  const root = container.firstElementChild as HTMLElement | null;
  expect(root?.className.includes('border')).toBe(false);
});

it('applies color classes without variant', () => {
  const { container } = render(
    <Card color="primary">
      Content
    </Card>,
  );

  expect(container.innerHTML).toContain('bg-primary/10');
  expect(container.innerHTML).toContain('text-primary');
});
