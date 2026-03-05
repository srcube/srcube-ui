import { expect, it } from 'vitest';
import { radio, radioGroup } from '../../src/components/radio';

it('builds radio slots for selected state', () => {
  const slots = radio({
    color: 'primary',
    size: 'md',
    isSelected: true,
  });

  const control = slots.radio();
  expect(control).toContain('size-5');
  expect(control).toContain('before:border-primary-200');

  const iconWrapper = slots.iconWrapper();
  expect(iconWrapper).toContain('opacity-100');
});

it('applies disabled state styles', () => {
  const slots = radio({ isDisabled: true });
  expect(slots.base()).toContain('opacity-60');
});

it('builds radio group orientation classes', () => {
  const className = radioGroup({ orientation: 'x' });
  expect(className).toContain('flex-row');
  expect(className).toContain('gap-4');
});
