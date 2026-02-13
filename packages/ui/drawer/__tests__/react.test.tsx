import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Drawer, DrawerContent, DrawerHeader } from '../src/react';

it('renders title as default header inside DrawerContent', () => {
  render(
    <Drawer defaultOpen title="Drawer Title">
      <DrawerContent aria-label="Drawer Demo">Drawer body content</DrawerContent>
    </Drawer>,
  );

  expect(screen.getByText('Drawer Title')).toBeTruthy();
  expect(screen.getByText('Drawer body content')).toBeTruthy();
});

it('calls onOpenChange when backdrop clicked', () => {
  const onOpenChange = vi.fn();
  render(
    <Drawer
      isOpen
      onOpenChange={onOpenChange}
      classNames={{ backdrop: 'test-drawer-backdrop' }}
    >
      <DrawerContent aria-label="Drawer Backdrop Test">
        <DrawerHeader>Header</DrawerHeader>
      </DrawerContent>
    </Drawer>,
  );

  const backdrop = document.querySelector('[class*="test-drawer-backdrop"]');
  expect(backdrop).toBeTruthy();

  if (!backdrop) {
    return;
  }

  fireEvent.click(backdrop);

  expect(onOpenChange).toHaveBeenCalledWith(false);
});
