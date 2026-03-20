import { expect, it } from 'vitest';
import { button, buttonGroup } from '../../src/components/button';

it('builds primary solid button classes', () => {
  const slots = button({
    color: 'primary',
    variant: 'solid',
    size: 'md',
    radius: 'md',
    isDisabled: false,
    isLoading: false,
    groupOrientation: 'x',
  });

  const base = slots.base();
  expect(base).toContain('bg-primary');
  expect(base).toContain('text-white');
  expect(base).toContain('h-10');
  expect(base).toContain('rounded-xl');
});

it('builds default dark tone button classes', () => {
  const slots = button({
    color: 'default',
    tone: 'dark',
    variant: 'solid',
  });

  const base = slots.base();
  expect(base).toContain('bg-slate-950');
  expect(base).toContain('text-white');
});

it('marks disabled buttons as not interactive', () => {
  const slots = button({
    color: 'primary',
    variant: 'solid',
    size: 'md',
    radius: 'md',
    isDisabled: true,
  });

  const base = slots.base();
  expect(base).toContain('opacity-60');
  expect(base).toContain('cursor-not-allowed');
});

it('applies group position classes', () => {
  const slots = button({
    groupOrientation: 'x',
    groupPosition: 'first',
    size: 'md',
    radius: 'md',
  });

  const base = slots.base();
  expect(base).toContain('border-r-0');
  expect(base).toContain('rounded-l-xl');
  expect(base).toContain('rounded-r-none');
});

it('keeps internal loading slot available', () => {
  const slots = button({});
  expect(slots._iLoading()).toContain('icon-spinner');
});

it('builds button group classes by orientation', () => {
  const className = buttonGroup({ orientation: 'y' });
  expect(className).toContain('inline-flex');
  expect(className).toContain('flex-col');
  expect(className).toContain('items-stretch');
});
