import { expect, it } from 'vitest';
import * as styles from '../../src/components/scrollbox';

it('exports style helpers', () => {
  const entries = Object.entries(styles);
  expect(entries.length).toBeGreaterThan(0);

  let asserted = false;
  for (const [, value] of entries) {
    if (typeof value === 'function') {
      const result = value({});
      asserted = true;
      if (typeof result === 'string') {
        expect(typeof result).toBe('string');
      } else if (result && typeof result === 'object') {
        const slotKeys = Object.keys(result);
        expect(slotKeys.length).toBeGreaterThan(0);
        const first = result[slotKeys[0]];
        if (typeof first === 'function') {
          expect(() => first()).not.toThrow();
        }
      }
    }
  }

  expect(asserted).toBe(true);
});
