import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expect, it, vi } from 'vitest';
import { Popup, PopupBackdrop, PopupContent } from '../src/react';

void React;

it('calls onOpenChange when backdrop clicked', () => {
  const onOpenChange = vi.fn();
  render(
    <Popup isOpen onOpenChange={onOpenChange}>
      <PopupBackdrop data-testid="backdrop" />
      <PopupContent aria-label="Popup">Content</PopupContent>
    </Popup>,
  );

  fireEvent.click(screen.getByTestId('backdrop'));

  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it('renders when defaultOpen is true', () => {
  render(
    <Popup defaultOpen>
      <PopupContent aria-label="Popup">Default popup</PopupContent>
    </Popup>,
  );

  expect(screen.getByText('Default popup')).toBeTruthy();
});
