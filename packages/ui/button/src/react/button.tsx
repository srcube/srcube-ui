import { composeTwRenderProps } from '@srcube-ui/react';
import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { button } from '../style';
import { useButtonGroupContext } from './button-group';
import type { ButtonReactProps } from './props';

export const Button = React.forwardRef<HTMLButtonElement, ButtonReactProps>(
  (props, ref) => {
    const group = useButtonGroupContext();

    const {
      color,
      variant,
      size,
      radius,
      isBlock,
      isIcon,
      isLoading,
      isDisabled,
      groupPosition,
      className,
      classNames,
      style,
      onTap,
      children,
      ...rest
    } = props;

    const resolvedColor = color ?? group?.color ?? 'primary';
    const resolvedVariant = variant ?? group?.variant ?? 'solid';
    const resolvedSize = size ?? group?.size ?? 'md';
    const resolvedRadius = radius ?? group?.radius ?? 'md';
    const resolvedIsBlock = isBlock ?? group?.isBlock ?? false;
    const resolvedIsDisabled = isDisabled ?? group?.isDisabled ?? false;

    const isAutoLoading = isLoading === 'auto';
    const [autoLoading, setAutoLoading] = React.useState(false);
    const resolvedIsLoading = isAutoLoading ? autoLoading : Boolean(isLoading);

    const resolvedGroupPosition = radius ? 'none' : (groupPosition ?? 'none');
    const resolvedIsInGroup = Boolean(group);

    const slots = React.useMemo(
      () =>
        button({
          color: resolvedColor,
          variant: resolvedVariant,
          size: resolvedSize,
          radius: resolvedRadius,
          isBlock: resolvedIsBlock,
          isIcon,
          isLoading: resolvedIsLoading,
          isDisabled: resolvedIsDisabled || resolvedIsLoading,
          isInGroup: resolvedIsInGroup,
          groupIsBlock: group?.isBlock,
          groupPosition: resolvedGroupPosition,
        }),
      [
        resolvedColor,
        resolvedVariant,
        resolvedSize,
        resolvedRadius,
        resolvedIsBlock,
        isIcon,
        resolvedIsLoading,
        resolvedIsDisabled,
        resolvedIsInGroup,
        resolvedGroupPosition,
        group?.isBlock,
      ],
    );

    const baseClassName = composeTwRenderProps(
      className,
      slots.base({ class: classNames?.base }),
    );

    const handlePress = React.useCallback(
      async (event: Parameters<NonNullable<ButtonReactProps['onTap']>>[0]) => {
        if (resolvedIsDisabled || resolvedIsLoading) return;
        if (!onTap) return;

        if (isAutoLoading) {
          const result = onTap(event);

          if (result instanceof Promise) {
            setAutoLoading(true);
            try {
              await result;
            } catch (error) {
              console.error('Button async error:', error);
            } finally {
              setAutoLoading(false);
            }
          }

          return;
        }

        onTap(event);
      },
      [resolvedIsDisabled, resolvedIsLoading, onTap, isAutoLoading],
    );

    return (
      <AriaButton
        ref={ref}
        className={baseClassName}
        style={style}
        isDisabled={resolvedIsDisabled || resolvedIsLoading}
        onPress={handlePress}
        {...rest}
      >
        {resolvedIsLoading && <span className={slots._iLoading()} />}
        {(!isIcon || !resolvedIsLoading) && children}
      </AriaButton>
    );
  },
);

Button.displayName = 'Srcube.Button';
