import * as React from 'react';
import { menu, menuItemState } from '@srcube-ui/styles/components/menu';
import type { MenuItem, MenuReactProps, MenuValue } from './props';

function resolveItems(raw: MenuReactProps['items']): MenuItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item) => item && (typeof item.value === 'string' || typeof item.value === 'number'))
    .map((item) => ({
      value: item.value,
      label: item.label ?? String(item.value),
      isDisabled: item.isDisabled === true,
    }));
}

function resolveDefaultValue(items: MenuItem[]) {
  const firstEnabled = items.find((item) => !item.isDisabled);
  return firstEnabled?.value ?? items[0]?.value ?? null;
}

function hasValue(items: MenuItem[], value: MenuValue | null | undefined) {
  if (value === null || value === undefined) {
    return false;
  }

  return items.some((item) => item.value === value);
}

export const Menu = React.forwardRef<HTMLDivElement, MenuReactProps>((props, ref) => {
  const {
    trigger,
    items,
    value,
    defaultValue,
    isOpen,
    defaultOpen = false,
    isDisabled = false,
    shouldCloseOnOutsidePress = true,
    shouldCloseOnSelect = true,
    placement,
    orientation,
    size,
    radius,
    variant,
    color,
    tone,
    hasArrow,
    className,
    classNames,
    style,
    onOpenChange,
    onValueChange,
    ...rest
  } = props;

  const normalizedItems = React.useMemo(() => resolveItems(items), [items]);

  const isOpenControlled = isOpen !== null && isOpen !== undefined;
  const [innerOpen, setInnerOpen] = React.useState(Boolean(defaultOpen));
  const open = isOpenControlled ? Boolean(isOpen) : innerOpen;

  const isValueControlled = value !== null && value !== undefined;
  const [innerValue, setInnerValue] = React.useState<MenuValue | null>(() => {
    if (defaultValue !== null && defaultValue !== undefined && hasValue(normalizedItems, defaultValue)) {
      return defaultValue;
    }

    return resolveDefaultValue(normalizedItems);
  });

  const selectedValue = isValueControlled ? value : innerValue;
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const slots = React.useMemo(
    () =>
      menu({
        placement,
        orientation,
        size,
        radius,
        variant,
        color,
        tone,
        hasArrow,
      }),
    [color, hasArrow, orientation, placement, radius, size, tone, variant],
  );

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInnerOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (isValueControlled) {
      return;
    }

    setInnerValue((prev) => {
      if (prev !== null && prev !== undefined && hasValue(normalizedItems, prev)) {
        return prev;
      }

      return resolveDefaultValue(normalizedItems);
    });
  }, [isValueControlled, normalizedItems]);

  React.useEffect(() => {
    if (!open || !shouldCloseOnOutsidePress) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open, setOpen, shouldCloseOnOutsidePress]);

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={slots.base({ class: [classNames?.base, className] })}
      style={style}
      {...rest}
    >
      <span
        className={slots.trigger({ class: classNames?.trigger })}
        onClick={() => {
          if (isDisabled) {
            return;
          }
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (isDisabled) {
            return;
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(!open);
          }
        }}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-expanded={open}
        aria-disabled={isDisabled ? true : undefined}
      >
        {trigger}
      </span>

      {open ? (
        <>
          <div className={slots.layer({ class: classNames?.layer })}>
            <div className={slots.content({ class: classNames?.content })}>
              <div className={slots.list({ class: classNames?.list })} role="menu">
                {normalizedItems.map((item, index) => {
                  const isSelected = selectedValue === item.value;

                  return (
                    <button
                      key={`${typeof item.value}:${String(item.value)}`}
                      className={slots.item({
                        class: [
                          classNames?.item,
                          menuItemState({
                            isSelected,
                            isDisabled: Boolean(item.isDisabled),
                            color,
                            variant,
                            tone,
                          }),
                        ],
                      })}
                      type="button"
                      role="menuitem"
                      aria-selected={isSelected}
                      disabled={item.isDisabled}
                      onClick={() => {
                        if (item.isDisabled) {
                          return;
                        }

                        if (!isValueControlled) {
                          setInnerValue(item.value);
                        }

                        onValueChange?.(item.value, { item, index });

                        if (shouldCloseOnSelect) {
                          setOpen(false);
                        }
                      }}
                    >
                      <span className={slots.itemLabel({ class: classNames?.itemLabel })}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {hasArrow !== false ? (
              <span className={slots.arrow({ class: classNames?.arrow })} aria-hidden="true" />
            ) : null}
          </div>
          {shouldCloseOnOutsidePress ? (
            <div className={slots.backdrop({ class: classNames?.backdrop })} />
          ) : null}
        </>
      ) : null}
    </div>
  );
});

Menu.displayName = 'Srcube.Menu';
