import { composeTwRenderProps } from '@srcube-ui/runtime/react';
import * as React from 'react';
import {
  Switch as AriaSwitch,
  type SwitchRenderProps,
} from 'react-aria-components';
import { switchStyle } from '../style';
import type { SwitchReactProps } from './props';

export const Switch: React.ForwardRefExoticComponent<
  SwitchReactProps & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef<HTMLLabelElement, SwitchReactProps>((props, ref) => {
  const {
    value,
    defaultSelected,
    isSelected,
    isLoading,
    isDisabled,
    isReadOnly,
    color,
    size,
    className,
    classNames,
    icon,
    onValueChange,
    onTap,
    children,
    ...rest
  } = props;

  const resolvedColor = color ?? 'default';
  const resolvedSize = size ?? 'md';

  const isAutoLoading = isLoading === 'auto';
  const [autoLoading, setAutoLoading] = React.useState(false);
  const resolvedIsLoading = isAutoLoading ? autoLoading : Boolean(isLoading);

  const interactionDisabled = Boolean(isDisabled) || resolvedIsLoading;

  const buildSlots = React.useCallback(
    (state: SwitchRenderProps) =>
      switchStyle({
        color: resolvedColor,
        size: resolvedSize,
        isSelected: state.isSelected,
        isDisabled: state.isDisabled,
        isReadOnly: Boolean(isReadOnly),
        isLoading: resolvedIsLoading,
      }),
    [resolvedColor, resolvedSize, isReadOnly, resolvedIsLoading],
  );

  const baseClassName = composeTwRenderProps(className, (state) => {
    const slots = buildSlots(state);
    return slots.base({ class: classNames?.base });
  });

  const handleChange = React.useCallback(
    (next: boolean) => {
      if (!interactionDisabled && !isReadOnly && onTap) {
        if (isAutoLoading) {
          const result = onTap();

          if (result instanceof Promise) {
            setAutoLoading(true);
            result
              .catch((error) => {
                console.error('Switch async error:', error);
              })
              .finally(() => {
                setAutoLoading(false);
              });
          }
        } else {
          onTap();
        }
      }

      onValueChange?.(next);
    },
    [interactionDisabled, isReadOnly, onTap, isAutoLoading, onValueChange],
  );

  const renderThumb = (
    state: SwitchRenderProps,
    classes: {
      thumb: string;
      _iThumb: string;
      _iLoading: string;
    },
  ) => {
    if (resolvedIsLoading) {
      return (
        <span className={classes.thumb}>
          <span className={classes._iLoading} />
        </span>
      );
    }

    if (icon == null) {
      return <span className={classes.thumb} />;
    }

    if (typeof icon === 'function') {
      return (
        <span className={classes.thumb}>
          {icon({
            isSelected: state.isSelected,
            isLoading: resolvedIsLoading,
            isDisabled: state.isDisabled,
            className: classes._iThumb,
          })}
        </span>
      );
    }

    return <span className={classes.thumb}>{icon}</span>;
  };

  return (
    <AriaSwitch
      ref={ref}
      value={value}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      isDisabled={interactionDisabled}
      isReadOnly={isReadOnly}
      className={baseClassName}
      onChange={handleChange}
      aria-readonly={isReadOnly}
      {...rest}
    >
      {(state) => {
        const slots = buildSlots(state);
        const classes = {
          track: slots.track({ class: classNames?.track }),
          thumb: slots.thumb({ class: classNames?.thumb }),
          _iThumb: slots._iThumb(),
          _iLoading: slots._iLoading(),
          content: slots.content({ class: classNames?.content }),
        };

        const contentNode =
          typeof children === 'function' ? children(state) : children;

        return (
          <>
            <span className={classes.track}>{renderThumb(state, classes)}</span>
            {contentNode && (
              <span className={classes.content}>{contentNode}</span>
            )}
          </>
        );
      }}
    </AriaSwitch>
  );
});

Switch.displayName = 'Srcube.Switch';
