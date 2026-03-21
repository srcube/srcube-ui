import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Button, ButtonGroup } from '../../src/components/button';

it('calls onTap when enabled', () => {
  const onTap = vi.fn();
  render(<Button onTap={onTap}>Tap me</Button>);

  fireEvent.click(screen.getByRole('button'));
  expect(onTap).toHaveBeenCalledTimes(1);
});

it('does not call onTap when disabled', () => {
  const onTap = vi.fn();
  render(
    <Button isDisabled onTap={onTap}>
      Disabled
    </Button>,
  );

  fireEvent.click(screen.getByRole('button'));
  expect(onTap).not.toHaveBeenCalled();
});

it('applies group position styles', () => {
  render(
    <ButtonGroup>
      <Button>First</Button>
      <Button>Last</Button>
    </ButtonGroup>,
  );

  const [first, last] = screen.getAllByRole('button');
  expect(first.className).toContain('rounded-r-none');
  expect(last.className).toContain('rounded-l-none');
});

it('supports vertical group orientation', () => {
  render(
    <ButtonGroup orientation="y">
      <Button>Top</Button>
      <Button>Bottom</Button>
    </ButtonGroup>,
  );

  const [top, bottom] = screen.getAllByRole('button');
  expect(top.className).toContain('rounded-b-none');
  expect(bottom.className).toContain('rounded-t-none');
});

it('uses default color with light tone by default', () => {
  render(<Button>Default</Button>);

  expect(screen.getByRole('button').className).toContain('bg-slate-200');
});

it('supports dark tone for default color', () => {
  render(<Button tone="dark">Dark</Button>);

  expect(screen.getByRole('button').className).toContain('bg-zinc-950');
});
