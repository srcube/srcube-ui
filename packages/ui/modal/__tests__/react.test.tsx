import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Modal, ModalBackdrop, ModalContent } from '../src/react';

it('calls onOpenChange when backdrop clicked', () => {
  const onOpenChange = vi.fn();
  render(
    <Modal isOpen onOpenChange={onOpenChange}>
      <ModalBackdrop data-testid="backdrop" />
      <ModalContent>Content</ModalContent>
    </Modal>,
  );

  fireEvent.click(screen.getByTestId('backdrop'));

  expect(onOpenChange).toHaveBeenCalledWith(false);
});

it('renders when defaultOpen is true', () => {
  render(
    <Modal defaultOpen>
      <ModalContent>Default modal</ModalContent>
    </Modal>,
  );

  expect(screen.getByText('Default modal')).toBeInTheDocument();
});
