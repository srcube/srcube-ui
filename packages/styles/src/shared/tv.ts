export { tv, type VariantProps } from './tv-web';
import type { ClassValue } from 'tailwind-variants';

export type SlotsToClasses<S extends string> = {
  [key in S]?: ClassValue;
};

export type ExcludePrivateSlotKeys<T extends string> = T extends `_${string}`
  ? never
  : T;

type BaseSlotKey<B> = B extends undefined ? never : 'base';
type SlotKeys<S> = S extends Record<string, ClassValue> ? keyof S : never;
type TVSlotsFromReturn<T> = T extends { slots: infer S; base: infer B }
  ? SlotKeys<S> | BaseSlotKey<B>
  : never;

export type VariantSlots<T> = T extends (...args: unknown[]) => unknown
  ? TVSlotsFromReturn<T> extends never
    ? keyof ReturnType<T>
    : TVSlotsFromReturn<T>
  : TVSlotsFromReturn<T> extends never
    ? keyof T
    : TVSlotsFromReturn<T>;

export type VariantClasses<T> = SlotsToClasses<
  ExcludePrivateSlotKeys<VariantSlots<T> & string>
>;
