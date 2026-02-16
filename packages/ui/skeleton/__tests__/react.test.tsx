import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Skeleton } from '../src/react';

void React;

it('shows placeholder by default and keeps children in dom', () => {
  const { container } = render(
    <Skeleton
      classNames={{
        content: 'test-content',
        placeholder: 'test-placeholder',
      }}
    >
      <span>Skeleton Content</span>
    </Skeleton>,
  );

  expect(screen.getByText('Skeleton Content')).toBeTruthy();

  const content = container.querySelector('.test-content') as HTMLElement;
  const placeholder = container.querySelector(
    '.test-placeholder',
  ) as HTMLElement;

  expect(content.className).toContain('opacity-0');
  expect(placeholder.className).toContain('opacity-100');
});

it('shows content when loaded', () => {
  const { container } = render(
    <Skeleton
      isLoaded
      classNames={{
        content: 'test-content',
        placeholder: 'test-placeholder',
      }}
    >
      <span>Loaded Content</span>
    </Skeleton>,
  );

  expect(screen.getByText('Loaded Content')).toBeTruthy();

  const content = container.querySelector('.test-content') as HTMLElement;
  const placeholder = container.querySelector(
    '.test-placeholder',
  ) as HTMLElement;

  expect(content.className).toContain('opacity-100');
  expect(placeholder.className).toContain('opacity-0');
});

it('applies radius classes to placeholder', () => {
  const { container } = render(
    <Skeleton radius="full" classNames={{ placeholder: 'test-placeholder' }}>
      <div className="h-8 w-8" />
    </Skeleton>,
  );

  const placeholder = container.querySelector(
    '.test-placeholder',
  ) as HTMLElement;

  expect(placeholder.className).toContain('rounded-full');
});
