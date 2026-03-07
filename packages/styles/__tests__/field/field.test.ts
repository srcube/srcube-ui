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

it('aligns outside-left multiline label with first line', () => {
  const slots = fieldStyle({
    labelPlacement: 'outside-left',
    isMultiline: true,
  });

  expect(slots.label()).toContain('pt-2');
});

it('keeps inside multiline label baseline offset', () => {
  const slots = fieldStyle({
    labelPlacement: 'inside',
    isMultiline: true,
  });

  expect(slots.label()).toContain('pt-[0.625rem]');
});
