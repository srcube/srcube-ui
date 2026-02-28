import { expect, it } from 'vitest';
import { tv } from '@srcube-ui/theme/tv';

it('tv merges conflicting active background classes', () => {
  const style = tv({
    base: 'active:bg-slate-200 text-slate-900',
    variants: {
      tone: {
        danger: 'active:bg-danger-50 text-danger-500',
      },
    },
  });

  const classes = style({ tone: 'danger' });

  expect(classes).toContain('active:bg-danger-50');
  expect(classes).toContain('text-danger-500');
  expect(classes).not.toContain('active:bg-slate-200');
  expect(classes).not.toContain('text-slate-900');
});
