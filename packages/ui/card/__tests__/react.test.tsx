import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Card } from '../src/react';

void React;

it('renders title and body content', () => {
  render(<Card title="Card Title">Card Body</Card>);

  expect(screen.getByText('Card Title')).toBeTruthy();
  expect(screen.getByText('Card Body')).toBeTruthy();
});

it('renders footer when footer prop exists', () => {
  render(<Card footer={<span>Footer Action</span>}>Content</Card>);

  expect(screen.getByText('Footer Action')).toBeTruthy();
});

it('applies divider when header divider is enabled', () => {
  const { container } = render(
    <Card title="Title" isHeaderDivider>
      Content
    </Card>,
  );

  expect(container.querySelector('.h-px')).toBeTruthy();
});
