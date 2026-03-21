import * as React from 'react';
import {
  collapse,
  collapseIconState,
  collapsePanelState,
  collapseState,
} from '@srcube-ui/styles/components/collapse';
import type { CollapseReactProps } from './props';

export const Collapse = React.forwardRef<HTMLDivElement, CollapseReactProps>(
  (props, ref) => {
    const {
      title,
      content,
      value,
      defaultValue = false,
      tone,
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
    const panelContentRef = React.useRef<HTMLDivElement | null>(null);
    const [panelHeight, setPanelHeight] = React.useState(0);

    const isExpanded = isControlled ? Boolean(value) : innerValue;

    const slots = React.useMemo(
      () =>
        collapse({
          tone,
          variant,
          size,
          radius,
        }),
      [radius, size, tone, variant],
    );

    const stateClass = collapseState({
      isExpanded,
      isDisabled: Boolean(isDisabled),
    });
    const iconClass = collapseIconState({ isExpanded });
    const panelClass = collapsePanelState({ isExpanded });

    const syncPanelHeight = React.useCallback(() => {
      const nextHeight = panelContentRef.current?.scrollHeight ?? 0;
      setPanelHeight(nextHeight);
    }, []);

    React.useEffect(() => {
      syncPanelHeight();
    }, [children, content, isExpanded, size, syncPanelHeight]);

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
              {indicator ?? <span aria-hidden="true" className={slots._iIndicator()} />}
            </span>
          ) : null}
        </button>

        <div
          className={slots.panel({ class: [classNames?.panel, panelClass] })}
          style={{
            maxHeight: isExpanded ? `${Math.max(panelHeight, 0)}px` : '0px',
            transition: 'max-height 300ms ease',
          }}
          aria-hidden={isExpanded ? undefined : true}
        >
          <div
            ref={panelContentRef}
            className={slots.content({ class: classNames?.content })}
          >
            {children ?? content}
          </div>
        </div>
      </div>
    );
  },
);

Collapse.displayName = 'Srcube.Collapse';
