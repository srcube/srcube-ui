import * as React from 'react';
import { tabbar, tabbarItemState } from '../style';
import type { TabbarReactProps, TabbarValue } from './props';

function resolveColor(value: TabbarReactProps['color']) {
  if (
    value === 'primary' ||
    value === 'secondary' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'danger'
  ) {
    return value;
  }

  return 'default' as const;
}

function resolveDefaultValue(items: TabbarReactProps['items']) {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

export const Tabbar = React.forwardRef<HTMLDivElement, TabbarReactProps>(
  (props, ref) => {
    const {
      items,
      value,
      defaultValue,
      size,
      color,
      isBordered,
      className,
      classNames,
      style,
      onValueChange,
      ...rest
    } = props;

    const isControlled = value !== null && value !== undefined;
    const [innerValue, setInnerValue] = React.useState<TabbarValue | null>(() => {
      if (isControlled) {
        return value ?? null;
      }

      if (defaultValue !== null && defaultValue !== undefined) {
        return defaultValue;
      }

      return resolveDefaultValue(items);
    });

    const activeValue = isControlled ? (value ?? null) : innerValue;
    const resolvedColor = resolveColor(color);
    const slots = React.useMemo(
      () =>
        tabbar({
          size,
          isBordered,
        }),
      [isBordered, size],
    );

    const handlePress = React.useCallback(
      (nextValue: TabbarValue, isDisabled?: boolean) => {
        if (isDisabled) {
          return;
        }

        if (!isControlled) {
          setInnerValue(nextValue);
        }
        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className] })}
        style={style}
        {...rest}
      >
        <div className={slots.list({ class: classNames?.list })}>
          {items.map((item) => {
            const isActive = activeValue === item.value;
            const stateClass = tabbarItemState({
              isActive,
              isDisabled: Boolean(item.isDisabled),
              color: resolvedColor,
            });

            return (
              <button
                key={`${typeof item.value}:${String(item.value)}`}
                type="button"
                className={slots.item({ class: [classNames?.item, stateClass] })}
                onClick={() => {
                  handlePress(item.value, item.isDisabled);
                }}
                aria-pressed={isActive}
                aria-disabled={item.isDisabled ? true : undefined}
              >
                {item.icon ? (
                  <span className={slots.icon({ class: classNames?.icon })}>{item.icon}</span>
                ) : null}
                <span className={slots.label({ class: classNames?.label })}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

Tabbar.displayName = 'Srcube.Tabbar';
