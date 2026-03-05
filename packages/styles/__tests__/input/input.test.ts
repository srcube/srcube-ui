import { expect, it } from 'vitest';
import { inputStyle } from '../../src/components/input';

it('builds input classes for disabled state', () => {
  const slots = inputStyle({ isDisabled: true });
  expect(slots.input()).toContain('cursor-not-allowed');
});
