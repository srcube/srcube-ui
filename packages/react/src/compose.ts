import { composeRenderProps } from 'react-aria-components';
import { cx } from 'tailwind-variants';

export function composeTwRenderProps<T>(
  className: string | ((values: T) => string) | undefined,
  tailwind?: string | ((values: T) => string | undefined),
): string | ((values: T) => string) {
  return composeRenderProps(className, (cls, renderProps): string => {
    const tw = typeof tailwind === 'function'
      ? tailwind(renderProps) ?? ''
      : tailwind ?? '';
    const base = cls ?? '';

    return cx(tw, base) ?? '';
  });
}

export function composeSlotClassName(
  slotFn: ((args?: { className?: string; [key: string]: any }) => string) | undefined,
  className?: string,
  variants?: Record<string, any>,
): string | undefined {
  return typeof slotFn === 'function'
    ? slotFn({ ...(variants ?? {}), className })
    : className;
}
