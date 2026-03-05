import { expect, it } from 'vitest';
import { checkbox, checkboxGroup } from '../../src/components/checkbox';

it('builds checkbox base slots', () => {
  const slots = checkbox({
    color: 'primary',
    size: 'md',
    radius: 'md',
    isSelected: true,
  });

  const box = slots.checkbox();
  expect(box).toContain('size-5');
  expect(box).toContain('after:bg-primary');

  const iconWrapper = slots.iconWrapper();
  expect(iconWrapper).toContain('opacity-100');
});

it('applies line-through content when selected', () => {
  const slots = checkbox({
    isSelected: true,
    isLineThrough: true,
  });

  const content = slots.content();
  expect(content).toContain('text-black/75');
});

it('builds checkbox group orientation classes', () => {
  const className = checkboxGroup({ orientation: 'x' });
  expect(className).toContain('flex-row');
  expect(className).toContain('gap-4');
});
