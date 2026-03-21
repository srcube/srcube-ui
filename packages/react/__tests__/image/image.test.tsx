import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it } from 'vitest';
import { Image } from '../../src/components/image';

void React;

it('renders fallback when src is missing', () => {
  render(<Image fallback="No image" />);

  expect(screen.getByText('No image')).toBeTruthy();
});

it('shows fallback after image error', () => {
  const { container } = render(<Image src="/demo.png" fallback="Load failed" />);
  const image = container.querySelector('img');

  fireEvent.error(image as HTMLImageElement);

  expect(screen.getByText('Load failed')).toBeTruthy();
});

it('opens preview overlay when previewable image is clicked', () => {
  const { container } = render(<Image src="/demo.png" isPreviewable />);
  const root = container.firstElementChild as HTMLElement;

  fireEvent.click(root);

  const closeButton = screen.getByRole('button', { name: 'Close preview' });
  expect(closeButton).toBeTruthy();

  fireEvent.click(closeButton);
  expect(screen.queryByRole('button', { name: 'Close preview' })).toBeNull();
});

it('supports dark tone placeholder surface', () => {
  const { container } = render(<Image tone="dark" fit="contain" fallback="No image" />);
  const root = container.firstElementChild as HTMLElement;

  expect(root.className).toContain('bg-zinc-900');
  expect(screen.getByText('No image').className).toContain('text-zinc-400');
});
