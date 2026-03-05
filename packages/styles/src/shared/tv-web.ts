import type { VariantProps } from 'tailwind-variants';
import { createTV } from 'tailwind-variants';
import { twMergeConfig } from './tw-merge-config';

export const tv = createTV({
  twMerge: true,
  twMergeConfig,
});
export type { VariantProps };
