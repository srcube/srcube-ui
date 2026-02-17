import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Avatar } from '../src/react';

void React;

it('renders initials as fallback', () => {
  render(<Avatar name="Srcube User" />);

  expect(screen.getByText('SU')).toBeTruthy();
});

it('renders image when src exists', () => {
  const { container } = render(<Avatar src="/avatar.png" name="Srcube" />);
  const image = container.querySelector('img');

  expect(image).toBeTruthy();
});

it('falls back after image error', () => {
  const { container } = render(<Avatar src="/avatar.png" name="Srcube User" />);
  const image = container.querySelector('img');

  fireEvent.error(image as HTMLImageElement);

  expect(screen.getByText('SU')).toBeTruthy();
});
