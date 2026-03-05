import * as React from 'react';
import {
  Checkbox as AriaCheckbox,
  type CheckboxRenderProps,
} from 'react-aria-components';
import { checkbox } from '@srcube-ui/styles/components/checkbox';
import { composeTwRenderProps } from '../../shared/compose';
import { useCheckboxGroupContext } from './checkbox-group';
import type { CheckboxReactProps } from './props';

export const Checkbox: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<CheckboxReactProps> &
    React.RefAttributes<HTMLLabelElement>
> = React.forwardRef<HTMLLabelElement, CheckboxReactProps>((props, ref) => {
  const group = useCheckboxGroupContext();

  const {
    value,
    defaultSelected,
    isSelected,
    isIndeterminate,
    isLoading,
    isDisabled,
    isReadOnly,
    isLineThrough,
    color,
    size,
    radius,
    className,
    classNames,
    icon,
    onValueChange,
    onTap,
    children,
    ...rest
  } = props;

  const resolvedValue = value ?? '';
  const resolvedColor = color ?? group?.color ?? 'default';
  const resolvedSize = size ?? group?.size ?? 'md';
  const resolvedRadius = radius ?? group?.radius ?? 'md';
  const resolvedIsDisabled = isDisabled ?? group?.isDisabled ?? false;
  const resolvedIsReadOnly = isReadOnly ?? group?.isReadOnly ?? false;
  const resolvedIsLineThrough = isLineThrough ?? group?.isLineThrough ?? false;

  const isAutoLoading = isLoading === 'auto';
  const [autoLoading, setAutoLoading] = React.useState(false);
  const resolvedIsLoading = isAutoLoading ? autoLoading : Boolean(isLoading);

  const interactionDisabled = resolvedIsDisabled || resolvedIsLoading;

  const buildSlots = React.useCallback(
    (state: CheckboxRenderProps) =>
      checkbox({
        color: resolvedColor,
        size: resolvedSize,
        radius: resolvedRadius,
        isSelected: state.isSelected,
        isIndeterminate: state.isIndeterminate,
        isDisabled: state.isDisabled,
        isReadOnly: resolvedIsReadOnly,
        isLoading: resolvedIsLoading,
        isLineThrough: resolvedIsLineThrough,
      }),
    [
      resolvedColor,
      resolvedSize,
      resolvedRadius,
      resolvedIsReadOnly,
      resolvedIsLoading,
      resolvedIsLineThrough,
    ],
  );

  const baseClassName = composeTwRenderProps(className, (state) => {
    const slots = buildSlots(state);
    return slots.base({ class: classNames?.base });
  });

  const handlePress = React.useCallback(
    async (event: Parameters<NonNullable<CheckboxReactProps['onTap']>>[0]) => {
      if (interactionDisabled || resolvedIsReadOnly) return;
      if (!onTap) return;

      if (isAutoLoading) {
        const result = onTap(event);

        if (result instanceof Promise) {
          setAutoLoading(true);
          try {
            await result;
          } catch (error) {
            console.error('Checkbox async error:', error);
          } finally {
            setAutoLoading(false);
          }
        }

        return;
      }

      onTap(event);
    },
    [interactionDisabled, resolvedIsReadOnly, onTap, isAutoLoading],
  );

  const handleChange = React.useCallback(
    (next: boolean) => {
      if (group) return;
      onValueChange?.(next);
    },
    [group, onValueChange],
  );

  const renderIcon = (
    state: CheckboxRenderProps,
    classes: {
      spinner: string;
      iconWrapper: string;
      iDefault: string;
      iIndeterminate: string;
    },
  ) => {
    if (resolvedIsLoading) {
      return <span className={classes.spinner} />;
    }

    if (typeof icon === 'function') {
      return icon({
        isIndeterminate: state.isIndeterminate,
        isLoading: resolvedIsLoading,
        isDisabled: state.isDisabled,
        className: classes.iconWrapper,
      });
    }

    if (state.isIndeterminate) {
      return (
        <span className={classes.iconWrapper}>
          <span className={classes.iIndeterminate} />
        </span>
      );
    }

    return (
      <span className={classes.iconWrapper}>
        {icon ?? <span className={classes.iDefault} />}
      </span>
    );
  };

  const inGroup = Boolean(group);

  return (
    <AriaCheckbox
      ref={ref}
      value={resolvedValue}
      isSelected={inGroup ? undefined : isSelected}
      defaultSelected={inGroup ? undefined : defaultSelected}
      isIndeterminate={isIndeterminate}
      isDisabled={interactionDisabled}
      isReadOnly={resolvedIsReadOnly}
      className={baseClassName}
      onPress={handlePress}
      onChange={handleChange}
      {...rest}
    >
      {(state) => {
        const slots = buildSlots(state);
        const classes = {
          checkbox: slots.checkbox({ class: classNames?.checkbox }),
          spinner: slots.spinner({ class: classNames?.spinner }),
          content: slots.content({ class: classNames?.content }),
          iconWrapper: slots.iconWrapper({ class: classNames?.iconWrapper }),
          iDefault: slots.iDefault({ class: classNames?.iDefault }),
          iIndeterminate: slots.iIndeterminate({
            class: classNames?.iIndeterminate,
          }),
        };

        const contentNode =
          typeof children === 'function' ? children(state) : children;

        return (
          <>
            <span className={classes.checkbox}>
              {renderIcon(state, classes)}
            </span>
            {contentNode && (
              <span className={classes.content}>{contentNode}</span>
            )}
          </>
        );
      }}
    </AriaCheckbox>
  );
});

Checkbox.displayName = 'Srcube.Checkbox';
