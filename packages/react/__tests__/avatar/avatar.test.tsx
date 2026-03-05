import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Avatar } from '../../src/components/avatar';

void React;

it('renders initials as fallback', () => {
  render(<Avatar name="Srcube User" />);

  expect(screen.getByText('SU')).toBeTruthy();
});

it('renders gradient orb layers in fallback by default', () => {
  const { container } = render(<Avatar name="Srcube User" />);

  expect(container.querySelector('[data-sr-avatar-orb="base"]')).toBeTruthy();
  expect(container.querySelector('[data-sr-avatar-orb="glow"]')).toBeTruthy();
  expect(
    container.querySelector('[data-sr-avatar-orb="highlight"]'),
  ).toBeTruthy();
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

it('supports solid fallback style for backward-compatible visual mode', () => {
  const { container } = render(
    <Avatar name="Srcube User" fallbackStyle="solid" />,
  );

  expect(container.querySelector('[data-sr-avatar-orb="base"]')).toBeNull();
  expect(screen.getByText('SU')).toBeTruthy();
});

it('maps fallback seed to stable gradient theme', () => {
  const { container, rerender } = render(
    <Avatar name="User A" fallbackSeed="user-1001" />,
  );
  const firstStyle = container
    .querySelector('[data-sr-avatar-orb="base"]')
    ?.getAttribute('style');

  rerender(<Avatar name="User B" fallbackSeed="user-1001" />);
  const secondStyle = container
    .querySelector('[data-sr-avatar-orb="base"]')
    ?.getAttribute('style');

  expect(firstStyle).toBeTruthy();
  expect(secondStyle).toBe(firstStyle);
});

it('keeps radius classes on root and skeleton placeholder', () => {
  const { container } = render(<Avatar src="/avatar.png" radius="lg" />);

  const root = container.firstElementChild as HTMLElement | null;
  expect(root).toBeTruthy();
  expect(root?.className ?? '').toContain('rounded-2xl');

  const placeholder = container.querySelector('div[aria-hidden]');
  expect(placeholder?.className ?? '').toContain('rounded-2xl');
});
