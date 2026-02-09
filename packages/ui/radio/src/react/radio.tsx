import { composeTwRenderProps } from '@srcube-ui/react';
import * as React from 'react';
import {
  Radio as AriaRadio,
  type RadioRenderProps,
} from 'react-aria-components';
import { radio } from '../style';
import type { RadioReactProps } from './props';
import { RadioGroup, useRadioGroupContext } from './radio-group';

const resolveAriaLabel = (
  children: React.ReactNode | ((state: RadioRenderProps) => React.ReactNode),
  ariaLabel?: string,
  ariaLabelledBy?: string,
) => {
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledBy) return undefined;
  if (typeof children === 'function') return undefined;

  const parts = React.Children.toArray(children);
  if (parts.length === 0) return undefined;

  const hasNonText = parts.some(
    (child) => typeof child !== 'string' && typeof child !== 'number',
  );
  if (hasNonText) return undefined;

  return parts.map(String).join('');
};

const RadioInner = React.forwardRef<HTMLLabelElement, RadioReactProps>(
  (props, ref) => {
    const group = useRadioGroupContext();

    const {
      value,
      isLoading,
      isDisabled,
      isReadOnly,
      color,
      size,
      className,
      classNames,
      icon,
      onTap,
      children,
      'aria-label': ariaLabelProp,
      'aria-labelledby': ariaLabelledByProp,
      ...rest
    } = props as RadioReactProps & {
      'aria-label'?: string;
      'aria-labelledby'?: string;
    };

    const resolvedValue = value ?? '';
    const resolvedColor = color ?? group?.color ?? 'default';
    const resolvedSize = size ?? group?.size ?? 'md';
    const resolvedIsDisabled = isDisabled ?? group?.isDisabled ?? false;
    const resolvedIsReadOnly = isReadOnly ?? group?.isReadOnly ?? false;
    const resolvedAriaLabel = resolveAriaLabel(
      children,
      ariaLabelProp,
      ariaLabelledByProp,
    );

    const isAutoLoading = isLoading === 'auto';
    const [autoLoading, setAutoLoading] = React.useState(false);
    const resolvedIsLoading = isAutoLoading ? autoLoading : Boolean(isLoading);

    const ariaDisabled =
      resolvedIsDisabled ||
      resolvedIsLoading ||
      (!group?.isReadOnly && resolvedIsReadOnly);

    const buildSlots = React.useCallback(
      (state: RadioRenderProps) =>
        radio({
          color: resolvedColor,
          size: resolvedSize,
          isSelected: state.isSelected,
          isDisabled: state.isDisabled,
          isReadOnly: resolvedIsReadOnly,
          isLoading: resolvedIsLoading,
        }),
      [resolvedColor, resolvedSize, resolvedIsReadOnly, resolvedIsLoading],
    );

    const baseClassName = composeTwRenderProps(className, (state) => {
      const slots = buildSlots(state);
      return slots.base({ class: classNames?.base });
    });

    const handlePress = React.useCallback(
      async (event: Parameters<NonNullable<RadioReactProps['onTap']>>[0]) => {
        if (ariaDisabled || resolvedIsReadOnly) return;
        if (!onTap) return;

        if (isAutoLoading) {
          const result = onTap(event);

          if (result instanceof Promise) {
            setAutoLoading(true);
            try {
              await result;
            } catch (error) {
              console.error('Radio async error:', error);
            } finally {
              setAutoLoading(false);
            }
          }

          return;
        }

        onTap(event);
      },
      [ariaDisabled, resolvedIsReadOnly, onTap, isAutoLoading],
    );

    const renderIcon = (
      state: RadioRenderProps,
      classes: {
        _iLoading: string;
        iconWrapper: string;
        iDefault: string;
      },
    ) => {
      if (resolvedIsLoading) {
        return (
          <span className={classes.iconWrapper}>
            <span className={classes._iLoading} />
          </span>
        );
      }

      if (typeof icon === 'function') {
        return icon({
          isSelected: state.isSelected,
          isLoading: resolvedIsLoading,
          isDisabled: state.isDisabled,
          className: classes.iconWrapper,
        });
      }

      return (
        <span className={classes.iconWrapper}>
          {icon ?? <span className={classes.iDefault} />}
        </span>
      );
    };

    return (
      <AriaRadio
        ref={ref}
        value={resolvedValue}
        isDisabled={ariaDisabled}
        className={baseClassName}
        onPress={handlePress}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledByProp}
        {...rest}
      >
        {(state) => {
          const slots = buildSlots(state);
          const classes = {
            radio: slots.radio({ class: classNames?.radio }),
            _iLoading: slots._iLoading(),
            content: slots.content({ class: classNames?.content }),
            iconWrapper: slots.iconWrapper({ class: classNames?.iconWrapper }),
            iDefault: slots.iDefault({ class: classNames?.iDefault }),
          };

          const contentNode =
            typeof children === 'function' ? children(state) : children;

          return (
            <>
              <span className={classes.radio}>
                {renderIcon(state, classes)}
              </span>
              {contentNode && (
                <span className={classes.content}>{contentNode}</span>
              )}
            </>
          );
        }}
      </AriaRadio>
    );
  },
);

RadioInner.displayName = 'Srcube.Radio.Inner';

export const Radio: React.ForwardRefExoticComponent<
  RadioReactProps & React.RefAttributes<HTMLLabelElement>
> = React.forwardRef<HTMLLabelElement, RadioReactProps>((props, ref) => {
  const group = useRadioGroupContext();

  if (!group) {
    const {
      value,
      defaultSelected,
      isSelected,
      onValueChange,
      color,
      size,
      isDisabled,
      isReadOnly,
      ...rest
    } = props;

    const resolvedValue = value ?? '';
    const isControlled = isSelected !== undefined;
    const groupValue = isControlled
      ? isSelected
        ? resolvedValue
        : null
      : undefined;
    const groupDefault =
      !isControlled && defaultSelected ? resolvedValue : null;

    const ariaLabel = props['aria-label'];
    const ariaLabelledby = props['aria-labelledby'];
    const groupAriaLabel = resolveAriaLabel(
      props.children,
      ariaLabel,
      ariaLabelledby,
    );

    return (
      <RadioGroup
        className="contents"
        value={groupValue}
        defaultValue={groupDefault}
        onValueChange={(next) => {
          onValueChange?.(next === resolvedValue);
        }}
        color={color}
        size={size}
        isDisabled={isDisabled}
        isReadOnly={isReadOnly}
        aria-label={groupAriaLabel}
        aria-labelledby={ariaLabelledby}
      >
        <RadioInner ref={ref} value={resolvedValue} {...rest} />
      </RadioGroup>
    );
  }

  return <RadioInner ref={ref} {...props} />;
});

Radio.displayName = 'Srcube.Radio';
