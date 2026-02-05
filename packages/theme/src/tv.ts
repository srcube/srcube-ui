export { tv } from "./tv-web";

import type { ClassValue, VariantProps } from "tailwind-variants";

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

type BaseSlotKey<B> = B extends undefined ? never : "base";

type SlotKeys<S> = S extends Record<string, ClassValue> ? keyof S : never;

type TVSlotsFromReturn<T> = T extends { slots: infer S; base: infer B }
  ? SlotKeys<S> | BaseSlotKey<B>
  : never;

/**
 * Get slot keys from either a tv function or a tv return value.
 */
export type VariantSlots<T> = T extends (...args: unknown[]) => unknown
  ? TVSlotsFromReturn<T> extends never
    ? keyof ReturnType<T>
    : TVSlotsFromReturn<T>
  : TVSlotsFromReturn<T> extends never
    ? keyof T
    : TVSlotsFromReturn<T>;

/**
 * Get class keys from either a tv function or a tv return value.
 */
export type VariantClasses<T> = SlotsToClasses<
  ExcludePrivateSlotKeys<VariantSlots<T> & string>
>;

export type { VariantProps };
