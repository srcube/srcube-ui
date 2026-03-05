import { expect, it } from 'vitest';
import { fieldStyle } from '../../src/components/field';

it('builds field classes for default variant', () => {
  const slots = fieldStyle({ size: 'md', variant: 'default' });
  expect(slots.controlWrapper()).toContain('bg-slate-50');
});

it('applies invalid underline styles', () => {
  const slots = fieldStyle({ variant: 'underline', isInvalid: true });
  expect(slots.controlWrapper()).toContain('border-b-2');
});
