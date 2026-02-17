import * as React from 'react';
import { collapse, collapseIconState, collapseState } from '../style';
import type { CollapseReactProps } from './props';

export const Collapse = React.forwardRef<HTMLDivElement, CollapseReactProps>(
  (props, ref) => {
    const {
      title,
      content,
      value,
      defaultValue = false,
      variant,
      size,
      radius,
      isDisabled = false,
      hasIndicator = true,
      indicator,
      className,
      classNames,
      style,
      onValueChange,
      children,
      ...rest
    } = props;

    const isControlled = value !== null && value !== undefined;
    const [innerValue, setInnerValue] = React.useState<boolean>(Boolean(defaultValue));

    const isExpanded = isControlled ? Boolean(value) : innerValue;

    const slots = React.useMemo(
      () =>
        collapse({
          variant,
          size,
          radius,
        }),
      [radius, size, variant],
    );

    const stateClass = collapseState({
      isExpanded,
      isDisabled: Boolean(isDisabled),
    });
    const iconClass = collapseIconState({ isExpanded });

    const handleToggle = React.useCallback(() => {
      if (isDisabled) {
        return;
      }

      const nextValue = !isExpanded;
      if (!isControlled) {
        setInnerValue(nextValue);
      }
      onValueChange?.(nextValue);
    }, [isControlled, isDisabled, isExpanded, onValueChange]);

    return (
      <div
        ref={ref}
        className={slots.base({ class: [classNames?.base, className, stateClass] })}
        style={style}
        {...rest}
      >
        <button
          type="button"
          className={slots.trigger({ class: classNames?.trigger })}
          onClick={handleToggle}
          aria-expanded={isExpanded}
          aria-disabled={isDisabled ? true : undefined}
        >
          <span className={slots.title({ class: classNames?.title })}>{title}</span>
          {hasIndicator ? (
            <span
              className={slots.icon({ class: [classNames?.icon, iconClass] })}
              aria-hidden="true"
            >
              {indicator ?? 'v'}
            </span>
          ) : null}
        </button>

        {isExpanded ? (
          <div className={slots.panel({ class: classNames?.panel })}>
            <div className={slots.content({ class: classNames?.content })}>
              {children ?? content}
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

Collapse.displayName = 'Srcube.Collapse';
