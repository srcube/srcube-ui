import { create } from '@weapp-tailwindcss/variants';
import type { tv as TvFn, VariantProps } from 'tailwind-variants';

export const tv = create({ escape: true, unescape: true }).tv as TvFn;
export type { VariantProps };
