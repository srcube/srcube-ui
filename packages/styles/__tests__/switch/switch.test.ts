import { expect, it } from 'vitest';
import { switchStyle } from '../../src/components/switch';

it('builds switch classes for selected state', () => {
  const slots = switchStyle({ color: 'primary', size: 'md', isSelected: true });

  const track = slots.track();
  expect(track).toContain('bg-primary');

  const thumb = slots.thumb();
  expect(thumb).toContain('translate-x-5');
});

it('applies disabled state classes', () => {
  const slots = switchStyle({ isDisabled: true });
  expect(slots.base()).toContain('opacity-60');
});
