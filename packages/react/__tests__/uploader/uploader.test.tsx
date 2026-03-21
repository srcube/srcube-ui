import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { expect, it, vi } from 'vitest';
import { Uploader } from '../../src/components/uploader';

void React;

it('renders default files', () => {
  const { container } = render(
    <Uploader
      defaultValue={[
        {
          id: '1',
          url: 'https://example.com/demo.png',
          name: 'demo.png',
        },
      ]}
    />,
  );

  const image = container.querySelector('img');
  expect(image).toBeTruthy();
});

it('emits value change when selecting files', () => {
  const onValueChange = vi.fn();
  const { container } = render(<Uploader onValueChange={onValueChange} />);
  const input = container.querySelector('input[type="file"]');
  expect(input).toBeTruthy();

  const file = new File(['demo'], 'demo.png', { type: 'image/png' });
  fireEvent.change(input as HTMLInputElement, {
    target: {
      files: [file],
    },
  });

  expect(onValueChange).toHaveBeenCalled();
});

it('removes file when remove button is tapped', () => {
  const onValueChange = vi.fn();
  const { getByLabelText } = render(
    <Uploader
      defaultValue={[
        {
          id: '1',
          url: 'https://example.com/demo.png',
          name: 'demo.png',
        },
      ]}
      onValueChange={onValueChange}
    />,
  );

  fireEvent.click(getByLabelText('remove file'));
  expect(onValueChange).toHaveBeenCalledWith([]);
});

it('applies dark tone add button classes', () => {
  const { getByText } = render(<Uploader tone="dark" />);
  const addButton = getByText('Upload').closest('button');
  expect((addButton as HTMLButtonElement).className).toContain('bg-zinc-900');
});
