export { tv } from "./tv-web";
import type { VariantProps, ClassValue } from "tailwind-variants";

/**
 * Transform a list of slots into a { slot: classes } map.
 */
export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

/**
 * Exclude private slots from the slots list.
 */
export type ExcludePrivateSlotKeys<T extends string> = T extends `_${string}`
  ? never
  : T;

/**
 * Get slot keys from either a tv function or a tv return value.
 */
export type VariantSlots<T> = T extends (...args: any) => any
  ? keyof ReturnType<T>
  : keyof T;

/**
 * Get class keys from either a tv function or a tv return value.
 */
export type VariantClasses<T> = SlotsToClasses<
  ExcludePrivateSlotKeys<VariantSlots<T> & string>
>;

export type { VariantProps };
