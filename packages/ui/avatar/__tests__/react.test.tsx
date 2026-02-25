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
  const placeholder = container.querySelector('div[aria-hidden]');
  expect(placeholder?.className ?? '').toContain('animate-pulse');
});

it('falls back after image error', () => {
  const { container } = render(<Avatar src="/avatar.png" name="Srcube User" />);
  const image = container.querySelector('img');

  fireEvent.error(image as HTMLImageElement);

  expect(screen.getByText('SU')).toBeTruthy();
});

it('hides skeleton placeholder after image load', () => {
  const { container } = render(<Avatar src="/avatar.png" name="Srcube" />);
  const image = container.querySelector('img');
  fireEvent.load(image as HTMLImageElement);

  const placeholder = container.querySelector('div[aria-hidden]');
  expect(placeholder?.className ?? '').toContain('invisible');
});

it('prefers fallback prop over icon and initials', () => {
  render(
    <Avatar
      src="/avatar-error.png"
      name="Srcube User"
      icon="I"
      fallback="FB"
    />,
  );

  const image = document.querySelector('img');
  fireEvent.error(image as HTMLImageElement);

  expect(screen.getByText('FB')).toBeTruthy();
});

it('keeps radius classes on root and skeleton placeholder', () => {
  const { container } = render(<Avatar src="/avatar.png" radius="lg" />);

  const root = container.firstElementChild as HTMLElement | null;
  expect(root).toBeTruthy();
  expect(root?.className ?? '').toContain('rounded-2xl');

  const placeholder = container.querySelector('div[aria-hidden]');
  expect(placeholder?.className ?? '').toContain('rounded-2xl');
});
