import type { TWMergeConfig } from 'tailwind-variants';

function isNonEmptyValue(value: string) {
  return value.length > 0;
}

export const twMergeConfig = {
  extend: {
    classGroups: {
      'pb-safe-area': [{ pb: ['safe', { safe: [isNonEmptyValue] }] }],
      'pt-safe-area': [{ pt: ['safe', { safe: [isNonEmptyValue] }] }],
    },
  },
} satisfies TWMergeConfig;
