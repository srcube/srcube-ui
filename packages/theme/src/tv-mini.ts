import { create } from '@weapp-tailwindcss/variants';
import type { tv as TvFn, VariantProps } from 'tailwind-variants';
import { twMergeConfig } from './tw-merge-config';

export const tv = create(
  { escape: true, unescape: true },
  { twMerge: true, twMergeConfig },
).tv as TvFn;
export type { VariantProps };
