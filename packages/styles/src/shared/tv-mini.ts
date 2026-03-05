import { create } from '@weapp-tailwindcss/variants';
import  { tv as TvFn, type VariantProps } from 'tailwind-variants';
import { twMergeConfig } from './tw-merge-config';

export const tv = create(
  { escape: true, unescape: true },
  { twMerge: true, twMergeConfig },
).tv as typeof TvFn;
export type { VariantProps };
